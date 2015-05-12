using UnityEngine;
using System.Collections;
using UnityStandardAssets.ImageEffects;

public class MultiPlayerCore : MonoBehaviour {

	public bool RaysAdded = false;

	vp_FPPlayerEventHandler m_Player;


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

			//GameObject water = GameObject.Find("SUIMONO_Module");




			if(fpCam != null && fpCam.GetComponent<SunShafts>() != null) {

				SunShafts shafts = fpCam.GetComponent<SunShafts>();

				shafts.sunTransform = GameObject.Find("Sun").transform;

				//fpCam.AddComponent<FlareLayer>();

				// Add God Rays to sun
				//TOD_Rays rays = fpCam.AddComponent<TOD_Rays>();
				//rays.sky = GameObject.Find("Sky Dome").GetComponent<TOD_Sky>();
			}


			RaysAdded = true;

//			if (!PhotonNetwork.isMasterClient)

			// Get event handler
			m_Player = transform.GetComponent<vp_FPPlayerEventHandler>();

		}




	}

}
