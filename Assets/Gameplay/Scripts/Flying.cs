using UnityEngine;
using System.Collections;

public class Flying : MonoBehaviour {

	// Hold down key for this long to initiate
	public float Count = 0.5f;
	public bool IsFlying = false;

	// Lerp High Speed Effect
	public float StockFov = 60;
	public float FastFov = 50;
	//Will reach target value in 1sec. 2f will make it achieve in half second (1f/2f)... and so on!
	public float Speed = 0.5f;

	// High speed effect
	private GameObject speedEffect;

	private CharacterController m_CharacterController = null;
	public CharacterController CharacterController
	{
		get
		{
			if (m_CharacterController == null)
				m_CharacterController = gameObject.GetComponent<CharacterController>();
			return m_CharacterController;
		}
	}

	private vp_Controller m_FPController = null;
	public vp_Controller FPController
	{
		get
		{
			if (m_FPController == null)
				m_FPController = gameObject.GetComponent<vp_Controller>();
			return m_FPController;
		}
	}


	// Use this for initialization
	void Start () {


		// Set reference to high speed effect so we can trigger it later
		//speedEffect = GameObject.FindWithTag("SpeedEffect");

		// Don't emit by default
		//speedEffect.GetComponent<ParticleEmitter>().emit = false;

	}

	// Update is called once per frame
	void Update () {

		// Reset flight if we hit the ground while we were flying
		if (CharacterController.isGrounded && IsFlying) {
			DeActivateFlight();
		}
	
		// See if we can initiate flying mode when key is held down
		if (vp_Input.GetButton("Jump") && !IsFlying) {


			ActivateFlight();

			Count -= Time.deltaTime; 

			if (Count < 0) { 

				Count = 0.5f;

				// Maybe here actually enforce gravity?
				//ActivateFlight();
			} 
		} 
		else {
			Count = 0.5f;
		}

		// How fast we are moving relative to player "forwards" direction
		float forwardsVel = CharacterController.transform.InverseTransformDirection(CharacterController.velocity).z;
		
		// todo : cache
		GameObject camObj = GameObject.Find ("FPSCamera");
		if (camObj == null) {
			camObj = Camera.main.gameObject;
		}
		if (camObj == null) {
			return;
		}
		vp_FPCamera cam = camObj.GetComponent<vp_FPCamera>();
		
		// Shake camera and show speed indicators if flying fast
		if ((forwardsVel > 9 || forwardsVel < -9)  && IsFlying ) {
			//speedEffect.GetComponent<ParticleEmitter>().emit = true;
			cam.RenderingFieldOfView =  Mathf.Lerp(cam.RenderingFieldOfView, FastFov, Speed * Time.deltaTime);
			cam.ShakeSpeed = 2.5f;

			// Rotate similar to plane at high speed
			// Todo : change to keyboard axis
			if(vp_Input.GetAxisRaw("Horizontal") == -1 || vp_Input.GetAxisRaw("Horizontal") == 1) {
				cam.RotationStrafeRoll = -1.5f;
			}
			else {
				cam.RotationStrafeRoll = 3f;
			}
		} 
		else {
			//speedEffect.GetComponent<ParticleEmitter>().emit = false;
			cam.RenderingFieldOfView =  Mathf.Lerp(cam.RenderingFieldOfView, StockFov, Speed * Time.deltaTime);
			cam.ShakeSpeed = 0f;

			// Todo : LERP if from keyboard
			cam.RotationStrafeRoll = 0f;
		}

		// Always make sure gravity is good
		if (IsFlying) {
			FPController.MotorFreeFly = true;
			FPController.PhysicsGravityModifier = 0;
		}

		//Debug.LogWarning (CharacterController.isGrounded);
//
//		Debug.LogWarning (FPController.MotorFreeFly);

	}

	void ActivateFlight () {

		//Debug.LogWarning ("Initiate flight");
		
		FPController.MotorFreeFly = true;
		FPController.PhysicsGravityModifier = 0;

		IsFlying = true;

		
		//gameObject.GetComponent<vp_FPController>().PhysicsForceDamping = 0f;
		//gameObject.GetComponent<vp_FPController>().MotorJumpForceDamping = 0;
		//gameObject.GetComponent<vp_FPController>()

	}

	void DeActivateFlight () {
		Debug.LogWarning ("Deactivate flight");
		
		FPController.MotorFreeFly = false;
		FPController.PhysicsGravityModifier = 0.2f;

		IsFlying = false;
	}
}
