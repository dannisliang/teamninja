using UnityEngine;
using System.Collections;
using System.Linq;
using System.Collections.Generic;

public class Builder : MonoBehaviour {

	// Maximum distance you can place an object in meters
	public float MaxBuildDistance = 100f;
	public bool RotateEnabled = false;
	public float RotationSpeed = 700f;

	// Colors overlaid on itemwhen placing an object
	public Color ValidColor = Color.green;
	public Color InvalidColor = Color.red;

	public Material ValidPlacementMaterial;
	public Material InvalidPlacementMaterial;

	// Grid settings
	public float GridWidth = 0.125f;
	public float GridHeight = 0.125f;

	// Layer of terrain for collision detection
	private int terrainLayer = 8;

	// States for building
	// The object we are placing
	private GameObject BuildObject;
	private GameObject initialBuilding; // Store initial item
	private bool isBuilding = false;
	private bool isFloorObject = false;
	private bool canPlaceObject;


	// Placing object info
	// If true, will colorize object if it can be placed (ex: green / red)
	public bool tintIfValidPosition = true;

	// Initial colors of object we are placing. If we tint the object, we need use this to reset to original
	private Color[] initalColors;
	// Store width, height, etc of object we are moving
	private Bounds totalBounds = new Bounds();


	// Temp object when showing build validation
	private Material prevObjectMat;
	private GameObject prevObject;
	private Color prevObjectColor;

	// Store list of object raycast will collide with
	// These are disabled whe not building to not interfere with raycasts
	private List<BoxCollider> colliderObjects = new List<BoxCollider>();

	// List of object names to snap to
	private static List<string> snapObjects = new List<string>() {
		"Snap",
		"North",
		"East",
		"South",
		"West",
		"Ceiling"
	};


	// Use this for initialization
	void Start () {

		// Init Layers


		terrainLayer = LayerMask.NameToLayer("Terrain");
	}
	
	// Update is called once per frame
	void Update () {

		// Always reset previous build object if it exists
		if (prevObject != null) {
			prevObject.GetComponent<Renderer>().material = prevObjectMat;
			prevObject.GetComponent<Renderer>().enabled = false;
		}
	
		// Only run logic if we are in build mode
		if (isBuilding) {
			
			// CHECK PLACE / ROTATE object
			CheckMouseEvents();
			
			// Move object around via crosshair / mouse
			ShowBuildObject();
		}

		// Temp keycodes to init blocks
		if (Input.GetKeyDown (KeyCode.N)) {
			// Cache selectors, make sure object ignores raycasts, etc
			initBuildObject(GameObject.Find("WallBuildable")); // Starting with temp cube for now
		}
		if (Input.GetKeyDown (KeyCode.B)) {
			// Cache selectors, make sure object ignores raycasts, etc
			initBuildObject(GameObject.Find("PillarBuildable")); // Starting with temp cube for now
		}
		if (Input.GetKeyDown (KeyCode.M)) {
			// Cache selectors, make sure object ignores raycasts, etc
			initBuildObject(GameObject.Find("FloorBuildable"), true); // Starting with temp cube for now
		}
	}

	/*
	 *  Check for mouse events
	 */
	private void CheckMouseEvents(){
		
		// Left click to place object and end building
		if (Input.GetKeyDown (KeyCode.Mouse0)) {
			ConfirmBuild ();
			endBuildObject ();
		}
		
		// Right click to cancel building
		if (Input.GetKeyDown (KeyCode.Mouse1)) {
			// Clean Up
			endBuildObject ();
		}
		
		// Rotate Build Object
		if (RotateEnabled) {
			if (Input.GetAxis ("Mouse ScrollWheel") < 0) {
				BuildObject.transform.Rotate (Vector3.down * Time.deltaTime * RotationSpeed);
			} else if (Input.GetAxis ("Mouse ScrollWheel") > 0) {
				BuildObject.transform.Rotate (Vector3.up * Time.deltaTime * RotationSpeed);
			}
		}

	}

	void initBuildObject(GameObject buildItem, bool isFloor = false) {

		// If we were already building, destroy previous element
		if (isBuilding) {
			endBuildObject();
		}

		BuildObject = buildItem;

		isBuilding = true;
		isFloorObject = isFloor;

		// Floor Objects Need extra parameters set
		if (isFloor) {
			initFloorObject(buildItem);
		}

		// Activate any invisible objects that act as colliders for object placement
		foreach(var co in colliderObjects) {
			if(co != null )
				co.enabled = true;
		}
	}

	void endBuildObject() {
		
		// Reset UFPS camera movement
		//GameObject player = GameObject.Find ("Player");
		vp_FPBodyAnimator fpBAnimator = transform.GetComponentInChildren<vp_FPBodyAnimator>();
		fpBAnimator.DontUpdateCamera = false;
		
		// Destroy the building object
		if(BuildObject && isFloorObject){
			Destroy(BuildObject);
		}
		
		// Deactivate any invisible objects that act as colliders for object placement
		// This ensures they don't interfere with game raycasts (ex: bullets)
		colliderObjects = new List<BoxCollider>(); // Reset list
		List<BuildCollider> searchObjects = GameObject.FindObjectsOfType<BuildCollider>().ToList<BuildCollider>();
		
		Debug.LogWarning (searchObjects.Count);
		
		foreach(var co in searchObjects) {
			
			BoxCollider box = co.gameObject.GetComponent<BoxCollider>();
			if(box != null && box.isTrigger) {
				box.enabled = false;
				colliderObjects.Add(box);
			}
		}
		
		// We are no longer in building mode
		initialBuilding = null;
		isBuilding = false;
	}

	/// <summary>
	/// Starts Building 
	/// </summary>
	/// <param name="buildObject">Build object.</param>
	/// <param name="isFloor">If set to <c>true</c> is floor. Floors can only be set on terrain or flat ceilings </param>
	void initFloorObject(GameObject buildObject) {

		// Assign the public object to be manipulated
		BuildObject = (GameObject) Instantiate(buildObject, Camera.main.transform.position, Quaternion.identity);
		initialBuilding = buildObject;

		// Make sure object ignores raycasts so it doesn't mess with movement
		//BuildObject.layer = LayerMask.GetMask("Ignore Raycast") - 1;
		BuildObject.layer = 2;

		// Get Bounds and Height
		Renderer buildingRenderer = BuildObject.GetComponent<Renderer> ();
		if (buildingRenderer) {
			// Make sure we can see the item
			buildingRenderer.enabled = true;
			totalBounds = BuildObject.GetComponent<Renderer>().bounds;
		} 

		// Make sure collider doesn't move things around
		BoxCollider collider =  BuildObject.GetComponent<BoxCollider>();
		collider.isTrigger = true;

		// Fixes raycast position bug in UFPS
//		GameObject player = GameObject.Find ("Player");
		//GameObject player = GameObject.GetComponent<vp_FPPlayerEventHandler>();

		// RAYCAST FIX in MP
		vp_FPBodyAnimator fpBAnimator = transform.GetComponentInChildren<vp_FPBodyAnimator>();
		fpBAnimator.DontUpdateCamera = true;

		// Add a component that determines if touching object
		BuildingCollision buildCollider = BuildObject.AddComponent<BuildingCollision>();
		buildCollider.terrainLayer = terrainLayer;

		// In order to detect collision we add a rigidbody with continuous detection mode
		if(BuildObject.GetComponent<Rigidbody>()){
			Destroy(BuildObject.GetComponent<Rigidbody>());
		} 
		Rigidbody rigidbody =  BuildObject.AddComponent<Rigidbody>();
		rigidbody.useGravity = false;
		rigidbody.collisionDetectionMode = CollisionDetectionMode.Continuous;
	}

	void ShowBuildObject() {
	
		if (isFloorObject) {
			MoveFloor();
		}
		else {
			MoveObject();
		}
	}

	void MoveFloor() {
		// See where we hit and try to place object there
		RaycastHit hit;
		
		//Camera cam = GameObject.Find("WeaponCamera").GetComponent<Camera>();
		Camera cam = Camera.main;
		BuildObject obj = BuildObject.GetComponent<BuildObject> ();
		bool isFloorPosition = false;
		
		Ray ray = cam.ScreenPointToRay(Input.mousePosition);
		
		if (Physics.Raycast(ray, out hit, MaxBuildDistance, ~obj.IgnoreLayers))
		{
			Vector3 hitPosition = hit.point;

			// Test
			BuildObject.transform.position = hitPosition;

			int hitLayer = hit.transform.gameObject.layer;
			LayerMask hitMask = (1 << hit.transform.gameObject.layer);
			isFloorPosition = isFloorSnapObject(hit.transform.gameObject);

			if(hitLayer == terrainLayer || hitLayer == LayerMask.NameToLayer("Floor") && !isFloorPosition) {

				Vector3 objectPosition = getObjectPosition(hit, BuildObject);
				
				// Move the element to the new position
				BuildObject.transform.position = objectPosition;
			}
			else if(isFloorPosition) {
				// Snap to floor position
				BuildObject.transform.position = hit.transform.position;
			}
		}

		// Always check building position for accuracy
		// Colorize if valid position
		CheckBuildingPosition(isFloorPosition);
	}

	/// <summary>
	/// Determines whether this instance is floor snap object the specified go.
	/// </summary>
	/// <returns><c>true</c> if this instance is floor snap object the specified go; otherwise, <c>false</c>.</returns>
	/// <param name="go">Go.</param>
	public static bool isFloorSnapObject(GameObject go) {
		bool isSnap = false;

		if (snapObjects.Contains(go.name)) {
			isSnap = true;
		}

		return isSnap;
	}

	void MoveObject() {
		// See where we hit and try to place object there
		RaycastHit hit;
		
		Camera cam = Camera.main;
		Ray ray = cam.ScreenPointToRay(Input.mousePosition);
		
		BuildObject obj = BuildObject.GetComponent<BuildObject> ();

		if (Physics.Raycast(ray, out hit, MaxBuildDistance, ~obj.IgnoreLayers))
		{
			int hitLayer = hit.transform.gameObject.layer;
			LayerMask hitMask = (1 << hit.transform.gameObject.layer);

			// What are we hitting
			if(hit.transform.gameObject.layer == obj.ShowLayer) {

				Renderer ren = hit.transform.gameObject.GetComponent<Renderer> ();

				// Only tint object that don't already exist naturally or prebuilt
				if(!ren.enabled) {

					ren.enabled = true;
					
					prevObject = hit.transform.gameObject;
					prevObjectMat = ren.material;
					prevObjectColor = ren.material.color;
					
					// Show valid color via specified material
					ren.material = ValidPlacementMaterial;

					// Make sure it's not solid
					BoxCollider collider = prevObject.GetComponent<BoxCollider>();
					if(collider) {
						collider.isTrigger = true;
					}
				}
			}
		}
	}

	// Gets position of building object based on raycast, building object transform, and pivot point offset
	// 
	private Vector3 getObjectPosition(RaycastHit hitPoint, GameObject buildObject)
	{
		// Start off a hitpoint position then adjust depending on where ray hit
		Vector3 newPosition = hitPoint.point;
		// Get transform to box offset
		Renderer ren = buildObject.GetComponent<Renderer> ();
		Vector3 renCenter = ren.bounds.center;
		
		// from transform to render distance. Used for offset if transform point is not in the middle
		float pointDistance = Vector3.Distance(buildObject.transform.position, renCenter);
		// Prevent minor collisions
		float noColl = 0.0001f;

		newPosition.x = (Mathf.Floor(newPosition.x / GridWidth)) * GridWidth;
		newPosition.y = newPosition.y + totalBounds.extents.y + pointDistance + noColl;
		newPosition.z = (Mathf.Floor(newPosition.z / GridWidth)) * GridWidth;
		
		return newPosition;
	}

	/// <summary>
	/// Create the building and stop build
	/// </summary>
	private void ConfirmBuild(){
		if (canPlaceObject && isFloorObject) {

//			ObjectOnBuild
			BuildObject obj = BuildObject.GetComponent<BuildObject> ();

			GameObject newBuilding;

			if(obj.ObjectOnBuild) {
				newBuilding = (GameObject)Instantiate (obj.ObjectOnBuild, BuildObject.transform.position, BuildObject.transform.rotation);
			}
			else {
				newBuilding = (GameObject)Instantiate (initialBuilding, BuildObject.transform.position, BuildObject.transform.rotation);
			}


			// Create collision for newly placed object
			AddCollider (newBuilding);

//
//			if(builtFX){
//				GameObject fx = (GameObject) Instantiate(builtFX,currentBuilding.transform.position, currentBuilding.transform.rotation);
//			}
//
			// Fire Off Any Callbacks
			newBuilding.SendMessage ("OnBuilt", SendMessageOptions.DontRequireReceiver);    
			
		} 

		else {
			// Doing a wall, pillar, stairs, etc
			if (prevObject != null) {
				prevObject.GetComponent<Renderer>().material = prevObjectMat;
				prevObject.GetComponent<Renderer>().enabled = true;
				prevObject.GetComponent<BoxCollider>().isTrigger = false;

				prevObject = null;
			}
		}
	}

	/*
	 * Add a collider to the final building if it not existing yet
	 */
	private void AddCollider(GameObject building){
		if(!building.GetComponent<Collider>() && !building.GetComponentInChildren<Collider>()){
			BoxCollider collider = building.AddComponent<BoxCollider>();
			collider.size = totalBounds.size;
			collider.center = new Vector3(0f, totalBounds.size.y / 2,0f);
		}
	}


	/// <summary>
	/// Make sure building can be placed. Ex: If no collisions.
	/// </summary>
	private void CheckBuildingPosition(bool isSnap = false){
		canPlaceObject = true;

		if(BuildObject.GetComponent<BuildingCollision>().hasGameCollision || BuildObject.GetComponent<BuildingCollision>().touchTerrain) {
			canPlaceObject = false;
		}

		// Temp fix
		if (isSnap) {
			canPlaceObject = true;
		}

		Renderer objRenderer = BuildObject.GetComponent<Renderer> ();
		if (canPlaceObject && objRenderer != null) {
			objRenderer.material = ValidPlacementMaterial;
		}
		else if (!canPlaceObject && objRenderer != null) {
			objRenderer.material = InvalidPlacementMaterial;
		}
	}

	/*
	 * Used to find the bounds of the building
	 */
	private void AddChildrenToBounds( Transform child ) {		
		foreach( Transform grandChild in child ) {			
			if( grandChild.GetComponent<Renderer>() ) {				
				totalBounds.Encapsulate( grandChild.GetComponent<Renderer>().bounds.min );				
				totalBounds.Encapsulate( grandChild.GetComponent<Renderer>().bounds.max );				
			}			
			AddChildrenToBounds( grandChild );			
		}
	}
}


// Assigned to building object. Store collision info and layer info
// Stores gameObject collisions, not terrain collisions
public class BuildingCollision : MonoBehaviour {
	public int collisionsTotal = 0;
	public int terrainLayer = 0;
	public bool touchTerrain = false;
	public bool hasGameCollision { 
		get {
			return collisionsTotal > 0;
		}
	}
	
	void OnTriggerEnter (Collider col) {

		// Record Game Object Collisions
		// Ignore the collision if there is no renderer attached / enabled
		bool noRenderer;
		Renderer colRenderer = col.gameObject.GetComponent<Renderer> ();
		if (colRenderer != null) {
			noRenderer = !colRenderer.enabled;
		} 
		else {
			noRenderer = true;
		}

		bool ignoreCollision = Builder.isFloorSnapObject(col.gameObject) || noRenderer;
		if(!col.gameObject.Equals(gameObject) && !col.gameObject.layer.Equals(terrainLayer) && !ignoreCollision){
			collisionsTotal++;
			Debug.Log (col.gameObject.name);
		}

		// Save state if touching terrain
		if(!col.gameObject.Equals(gameObject) && col.gameObject.layer.Equals(terrainLayer)){
			touchTerrain = true;
		}
	}
	void OnTriggerExit (Collider col) {

		// Record Game Object Collisions
		// Ignore the collision if there is no renderer attached / enabled
		bool noRenderer;
		Renderer colRenderer = col.gameObject.GetComponent<Renderer> ();
		if (colRenderer != null) {
			noRenderer = !colRenderer.enabled;
		} 
		else {
			noRenderer = true;
		}
		
		bool ignoreCollision = Builder.isFloorSnapObject(col.gameObject) || noRenderer;

		// Remove GameObject collisions
		if(!col.gameObject.Equals(gameObject) && !col.gameObject.layer.Equals(terrainLayer) && !ignoreCollision){
			collisionsTotal--;
		}

		// Update terrain state
		if(!col.gameObject.Equals(gameObject) && col.gameObject.layer.Equals(terrainLayer)){
			touchTerrain = false;
		}
	}
}