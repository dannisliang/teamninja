﻿using UnityEngine;
using System.Collections;

[AddComponentMenu( "Utilities/HUDFPS")]
public class HUDFPS : MonoBehaviour
{
	// Attach this to any object to make a frames/second indicator.
	//
	// It calculates frames/second over each updateInterval,
	// so the display does not keep changing wildly.
	//
	// It is also fairly accurate at very low FPS counts (<10).
	// We do this not by simply counting frames per interval, but
	// by accumulating FPS for each frame. This way we end up with
	// corstartRect overall FPS even if the interval renders something like
	// 5.5 frames.
	
	public Rect startRect = new Rect( 660, 10, 75, 50 ); // The rect the window is initially displayed at.
	public bool updateColor = true; // Do you want the color to change if the FPS gets low
	public bool allowDrag = true; // Do you want to allow the dragging of the FPS window
	public  float frequency = 0.5F; // The update frequency of the fps
	public int nbDecimal = 1; // How many decimal do you want to display
	
	private float accum   = 0f; // FPS accumulated over the interval
	private int   frames  = 0; // Frames drawn over the interval
	private Color color = Color.white; // The color of the GUI, depending of the FPS ( R < 10, Y < 30, G >= 30 )
	private string sFPS = ""; // The fps formatted into a string.
	private GUIStyle style; // The style the text will be displayed at, based en defaultSkin.label.
	
	void Start()
	{
		StartCoroutine( FPS() );
	}
	
	void Update()
	{
		accum += Time.timeScale/ Time.deltaTime;
		++frames;
	}
	
	IEnumerator FPS()
	{
		// Infinite loop executed every "frenquency" secondes.
		while( true )
		{
			// Update the FPS
			float fps = accum/frames;
			sFPS = fps.ToString( "f" + Mathf.Clamp( nbDecimal, 0, 10 ) );
			
			//Update the color
			color = (fps >= 30) ? new Color (1.0f, 1.0f, 1.5f, 0.5f) : ((fps > 10) ? Color.red : Color.yellow);
			
			accum = 0.0F;
			frames = 0;
			
			yield return new WaitForSeconds( frequency );
		}
	}
	
	void OnGUI()
	{
		int w = Screen.width, h = Screen.height;
		
		GUIStyle style = new GUIStyle();
		
		Rect rect = new Rect(660, 12, w, h * 2 / 100);
		style.alignment = TextAnchor.UpperLeft;
		style.fontSize = 14;
		style.normal.textColor = color;

//		string text = string.Format("{0:0.0} ms ({1:0.} fps)", msec, fps);
		GUI.Label(rect, sFPS + "fps", style);

	}
	

}