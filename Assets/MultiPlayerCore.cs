using UnityEngine;
using System.Collections;

public class MultiPlayerCore : MonoBehaviour {

	public bool RaysAdded = false;


	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

		if (!RaysAdded) {


			Camera mainC = Camera.main;

			// Set clear flags to depth only so lighting works properly
			mainC.clearFlags = CameraClearFlags.Depth;

			// Add flare layer for sun flare to show up
			GameObject fpCam = GameObject.Find("FPSCamera");

			if(fpCam != null) {
				fpCam.AddComponent<FlareLayer>();
			}


			RaysAdded = true;
			Debug.LogWarning("Added Rays");
		}


	}
}
