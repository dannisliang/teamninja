using UnityEngine;
using System.Collections;

public class OpenDoor : MonoBehaviour {

	public float smooth = 2.0f;
	public float DoorOpenAngle = 90.0f;
	private bool open;
	private bool enter;
	private bool doorSet = false;

	private Vector3 defaultRot;
	private Vector3 openRot;

	private GameObject door;
	private GameObject hinge;



	// Use this for initialization
	void Start () {

		//transform.parent.FindChild("Door");
		checkAndSetDoor ();
	}
	
	// Update is called once per frame
	void Update () {

		checkAndSetDoor();

		if (open) {
			//Open door
			if(door != null) {
				door.transform.eulerAngles = Vector3.Slerp (door.transform.eulerAngles, openRot, Time.deltaTime * smooth);
			}
		} 
		else {
			//Close door
			if(door != null) {
				door.transform.eulerAngles = Vector3.Slerp (door.transform.eulerAngles, defaultRot, Time.deltaTime * smooth);
			}
		}
	}

	void OnTriggerEnter (Collider col) {
		Debug.LogWarning ("enter");

		if (!doorSet) {
			defaultRot = door.transform.eulerAngles;

			float newRotation = defaultRot.y + DoorOpenAngle;
			if(newRotation > 360) {
				newRotation = 270;
				Debug.LogWarning("oops");
			}

			openRot = new Vector3 (defaultRot.x, newRotation, defaultRot.z);
			Debug.LogWarning(defaultRot);

			// Don't need to calc again
			doorSet = true;
		}

		if(col.gameObject.tag == "Player") {
			open = true;
		}

	}

	void OnTriggerExit (Collider col) {
		if(col.gameObject.tag == "Player") {
			open = false;
		}
	}

	void checkAndSetDoor() {
		if (door == null) {
			hinge = transform.parent.FindChild("Hinge").gameObject;
			door = hinge.transform.FindChild("Door").gameObject;
			
			defaultRot = door.transform.eulerAngles;
			openRot = new Vector3 (defaultRot.x, defaultRot.y + DoorOpenAngle, defaultRot.z);
		}
	}
}
