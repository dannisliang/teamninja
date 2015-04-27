using UnityEngine;
using System.Collections;

public class FlashLight : MonoBehaviour {

	// JP : Flashlight is for testing day / night cycle and should be hooked up to inventory object
	private Light flashLight;

	private TOD_Time mfTime;

	// Use this for initialization
	void Start () {
		flashLight = GameObject.Find("FlashLight").GetComponent<Light>();
		mfTime = GameObject.Find("Sky Dome").GetComponent<TOD_Time>();
	}
	
	// Update is called once per frame
	void Update () {
	
		// Toggle FlashLight via range attribute
		if (Input.GetKeyDown (KeyCode.T)) {

			if(flashLight.range == 0) {
				flashLight.range = 400;
			}
			else {
				flashLight.range = 0;
			}
		}

		// Toggle Time.. for testing.. again..
		if (Input.GetKeyDown (KeyCode.Y)) {
			
			if (mfTime.DayLengthInMinutes == 30) {
				mfTime.DayLengthInMinutes = 1.5f;
			}
			else {
				mfTime.DayLengthInMinutes = 30f;
			}
		}
	}
}
