using UnityEngine;
using System.Collections;

public class OpenDoor : MonoBehaviour {

	public float smooth = 2.0f;
	public float DoorOpenAngle = 90.0f;
	private bool open;
	private bool enter;

	private Vector3 defaultRot;
	private Vector3 openRot;

	private GameObject door;
	private GameObject hinge;


	// Use this for initialization
	void Start () {

		door = GameObject.Find ("Door");
		hinge = GameObject.Find("Hinge");

		defaultRot = door.transform.eulerAngles;
		openRot = new Vector3 (defaultRot.x, defaultRot.y + DoorOpenAngle, defaultRot.z);
	}
	
	// Update is called once per frame
	void Update () {

		if (open) {
			//Open door
			door.transform.eulerAngles = Vector3.Slerp (door.transform.eulerAngles, openRot, Time.deltaTime * smooth);
		} 
		else {
			//Close door
			door.transform.eulerAngles = Vector3.Slerp (door.transform.eulerAngles, defaultRot, Time.deltaTime * smooth);
		}
	}

	void OnTriggerEnter (Collider col) {
		Debug.LogWarning ("enter");
		open = true;
	}

	void OnTriggerExit (Collider col) {
		Debug.LogWarning ("Exit");
		open = false;
	}
}
