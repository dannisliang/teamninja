using UnityEngine;
using System.Collections;

public class vp_EnergyHandler : MonoBehaviour {

	public bool ShowHUD = true;

	public float CurrentEnergy = 0.75f;
	public float EnergyRechargeRate = 0.00005f;

	protected vp_FPPlayerEventHandler m_Player = null;

	public float barDisplay; //current progress
	public float m_TargetHealthOffset;
	public Vector2 pos = new Vector2(20,60);
	public Vector2 size = new Vector2(2100,20);

	protected GUIStyle m_EnergyStyleFill = null;
	public GUIStyle EnergyStyleFill
	{
		get
		{
			if (m_EnergyStyleFill == null)
			{
				m_EnergyStyleFill = new GUIStyle( GUI.skin.box );
				m_EnergyStyleFill.normal.background = MakeTex( 2, 2, new Color( 0f, 1f, 0f, 0.125f ) );
			}
			return m_EnergyStyleFill;
		}
	}
	
	protected GUIStyle m_HealthStyleBG = null;
	public GUIStyle HealthStyleBG
	{
		get
		{
			if (m_HealthStyleBG == null)
			{
				m_HealthStyleBG = new GUIStyle( GUI.skin.box );
				m_HealthStyleBG.normal.background = MakeTex( 2, 2, new Color( 0f, 0f, 0f, 0.125f ) );
			}
			return m_HealthStyleBG;
		}
	}
	
	// Use this for initialization
	void Start () {
		InvokeRepeating("moreEnergy", 0, 0.2f);
	}

	protected virtual void Awake() {
		m_Player = transform.GetComponent<vp_FPPlayerEventHandler>();

		CurrentEnergy = 0f;
	}
	
	// Update is called once per frame
	void Update () {


	}

	void moreEnergy () {
		
		// Energy gradually increases over time
		if (CurrentEnergy < 1f) {
			CurrentEnergy += 0.01f;
		}
	}
	
	/// <summary>
	/// this draws a primitive HUD and also renders the current
	/// message, fading out in the middle of the screen
	/// </summary>
	protected virtual void OnGUI()
	{
		
		if (!ShowHUD) {
			return;
		}
		
		DrawEnergy();
	}

	/// <summary>
	/// displays a simple 'Health' HUD
	/// </summary>
	void DrawEnergy()
	{
		// Draw Health Background
		GUI.BeginGroup(new Rect(pos.x, pos.y, size.x, size.y));
		GUI.Box(new Rect(0,0, size.x, size.y), (int)(CurrentEnergy * 100) + "%", HealthStyleBG);
		
		// Draw Filled in Health and Amount
		GUI.BeginGroup(new Rect(0,0, size.x * CurrentEnergy, size.y));
		GUI.Box(new Rect(0,0, size.x, size.y), (int)(CurrentEnergy * 100) + "%", EnergyStyleFill);
		GUI.EndGroup();
		GUI.EndGroup();
	}

	private Texture2D MakeTex( int width, int height, Color col )
	{
		Color[] pix = new Color[width * height];
		for( int i = 0; i < pix.Length; ++i )
		{
			pix[ i ] = col;
		}
		Texture2D result = new Texture2D( width, height );
		result.SetPixels( pix );
		result.Apply();
		return result;
	}
}
