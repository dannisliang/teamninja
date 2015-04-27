using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class BuildObject : MonoBehaviour {

	// Colliders object contains for positioning
	public List<BuildCollider> Colliders;

	// A list of layer to be ignored during raycast.
	// Ex: Floor Layers can ignore Walls and Pillars
	public int ShowLayer;
	public LayerMask IgnoreLayers;

	// If provided, this object will be instantiated on successful placement
	public GameObject ObjectOnBuild;


	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
