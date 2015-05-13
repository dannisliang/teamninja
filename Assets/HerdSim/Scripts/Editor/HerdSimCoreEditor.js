//	Unluck Software	
// 	www.chemicalbliss.com
@CustomEditor(HerdSimCore)
@CanEditMultipleObjects

public class HerdSimCoreEditor extends Editor {
    var showHelp: boolean;
    var showHelpComponents: boolean;
    var showHelpProperties: boolean;
    var showHelpAvoidance: boolean;
    var showHelpPush: boolean;
    var showHelpMovement: boolean;
    var showHelpGround: boolean;
    var showHelpHerding: boolean;
    var showHelpDeath: boolean;
    var showHelpAnimation: boolean;  
	
    //Objects that can be multi edited
    var groundLayerMask: SerializedProperty;
    var updateDivisor: SerializedProperty;
    var controller: SerializedProperty;
    var hitPoints: SerializedProperty;
    var type: SerializedProperty;
    var minSize: SerializedProperty;
    var avoidAngle: SerializedProperty;
    var avoidDistance: SerializedProperty;
    var avoidSpeed: SerializedProperty;
    var stopDistance: SerializedProperty;
    var pushHalfTheTime: SerializedProperty;
    var pushDistance: SerializedProperty;
    var pushForce: SerializedProperty;
    var roamingArea: SerializedProperty;
    var walkSpeed: SerializedProperty;
    var runSpeed: SerializedProperty;
    var damping: SerializedProperty;
    var idleProbablity: SerializedProperty;
    var runChance: SerializedProperty;   
    var groundCheckInterval: SerializedProperty;
    var groundTag: SerializedProperty;
    var maxGroundAngle: SerializedProperty;
    var maxFall: SerializedProperty;
    var fakeGravity: SerializedProperty;
    var leaderAreaMultiplier: SerializedProperty;
    var maxHerdSize: SerializedProperty;
    var minHerdSize: SerializedProperty;
    var herdDistance: SerializedProperty;
    var randomDeath: SerializedProperty;
    var deadMaterial: SerializedProperty;
    var scaryCorpse: SerializedProperty;
    var animIdle: SerializedProperty;
    var animIdleSpeed: SerializedProperty;
    var animSleep: SerializedProperty;
    var animSleepSpeed: SerializedProperty;
    var animWalk: SerializedProperty;
    var animWalkSpeed: SerializedProperty;
    var animRun: SerializedProperty;
    var animRunSpeed: SerializedProperty;
    var animDead: SerializedProperty;
    var animDeadSpeed: SerializedProperty;
    var idleToSleepSeconds: SerializedProperty;	
	var herdLayerMask: SerializedProperty;	
	var pushyLayerMask: SerializedProperty;
	var herdSimLayerName: SerializedProperty;
	
	static var tex:Texture2D;
	
    function OnEnable() {
    	pushyLayerMask= serializedObject.FindProperty("_pushyLayerMask");
    	herdSimLayerName= serializedObject.FindProperty("_herdSimLayerName");
		herdLayerMask= serializedObject.FindProperty("_herdLayerMask");
        animIdle = serializedObject.FindProperty("_animIdle");
        animIdleSpeed = serializedObject.FindProperty("_animIdleSpeed");
        animSleep = serializedObject.FindProperty("_animSleep");
        animSleepSpeed = serializedObject.FindProperty("_animSleepSpeed");
        animWalk = serializedObject.FindProperty("_animWalk");
        animWalkSpeed = serializedObject.FindProperty("_animWalkSpeed");
        animRun = serializedObject.FindProperty("_animRun");
        animRunSpeed = serializedObject.FindProperty("_animRunSpeed");
        animDead = serializedObject.FindProperty("_animDead");
        animDeadSpeed = serializedObject.FindProperty("_animDeadSpeed");
        idleToSleepSeconds = serializedObject.FindProperty("_idleToSleepSeconds");
        randomDeath = serializedObject.FindProperty("_randomDeath");
        deadMaterial = serializedObject.FindProperty("_deadMaterial");
        scaryCorpse = serializedObject.FindProperty("_scaryCorpse");
        leaderAreaMultiplier = serializedObject.FindProperty("_leaderAreaMultiplier");
        maxHerdSize = serializedObject.FindProperty("_maxHerdSize");
        minHerdSize = serializedObject.FindProperty("_minHerdSize");
        herdDistance = serializedObject.FindProperty("_herdDistance");		
		groundCheckInterval = serializedObject.FindProperty("_groundCheckInterval");
        groundTag = serializedObject.FindProperty("_groundTag");
        maxGroundAngle = serializedObject.FindProperty("_maxGroundAngle");
        maxFall = serializedObject.FindProperty("_maxFall");
        fakeGravity = serializedObject.FindProperty("_fakeGravity");
        roamingArea = serializedObject.FindProperty("_roamingArea");
        walkSpeed = serializedObject.FindProperty("_walkSpeed");
        runSpeed = serializedObject.FindProperty("_runSpeed");
        damping = serializedObject.FindProperty("_damping");
        idleProbablity = serializedObject.FindProperty("_idleProbablity");
        runChance = serializedObject.FindProperty("_runChance");
        groundLayerMask = serializedObject.FindProperty("_groundLayerMask");
        updateDivisor = serializedObject.FindProperty("_updateDivisor");
        controller = serializedObject.FindProperty("_controller");
        hitPoints = serializedObject.FindProperty("_hitPoints");
        type = serializedObject.FindProperty("_type");
        minSize = serializedObject.FindProperty("_minSize");
        avoidAngle = serializedObject.FindProperty("_avoidAngle");
        avoidDistance = serializedObject.FindProperty("_avoidDistance");
        avoidSpeed = serializedObject.FindProperty("_avoidSpeed");
        stopDistance = serializedObject.FindProperty("_stopDistance");
        pushHalfTheTime = serializedObject.FindProperty("_pushHalfTheTime");
        pushDistance = serializedObject.FindProperty("_pushDistance");
        pushForce = serializedObject.FindProperty("_pushForce");
    }
	
    override function OnInspectorGUI() {    	
        serializedObject.Update();
        
        var dColor: Color = Color32(175, 175, 175, 255);
		var aColor: Color = Color.white;
		var bColor: Color = Color32(222, 222, 222, 255);
		var wColor: Color = Color.red;
		var w2Color: Color = Color.yellow;
		var helpColor: Color = Color.yellow;
		var warningColor: Color = 	Color32(255, 174, 0, 255);
		var warningColor2: Color =  Color.yellow;
		var helpStyle: GUIStyle;
		var buttonStyle: GUIStyle;
		var buttonStyle2: GUIStyle;
		var boxStyle: GUIStyle;
        
       // GUI.color = bColor;
        helpStyle = new GUIStyle(GUI.skin.label);
        helpStyle.fontSize = 9;
        helpStyle.normal.textColor = helpColor;
        
        warningStyle = new GUIStyle(GUI.skin.label);
        warningStyle.normal.textColor = warningColor;
        warningStyle.fontStyle = FontStyle.Bold;
		
		warningStyle2 = new GUIStyle(GUI.skin.label);
		warningStyle2.normal.textColor = warningColor2;
		warningStyle2.fontStyle = FontStyle.Bold;
       
        buttonStyle = new GUIStyle(GUI.skin.button);
        buttonStyle.fontStyle = FontStyle.Bold;
        buttonStyle.fixedWidth = 25;

        boxStyle = new GUIStyle(GUI.skin.box);
        boxStyle.stretchWidth = true;
        boxStyle.fontStyle = FontStyle.Bold;
        boxStyle.normal.textColor = warningColor;
		boxStyle.normal.background = tex;
        
        var boxStyle2 = new GUIStyle(boxStyle);
        boxStyle2.normal.textColor = warningColor2;
        boxStyle2.margin = new RectOffset(0,0,0,0);
      	var boxStyle3 = new GUIStyle(boxStyle2);
      	boxStyle3.fontStyle = FontStyle.Normal;
      	boxStyle3.fontSize = 9;
		buttonStyle2 = new GUIStyle(GUI.skin.button);
        GUILayout.Space(5);
      
		var warned:boolean;
		
        if(LayerMask.NameToLayer(target._groundTag) == -1){
        	 EditorGUILayout.LabelField("Warning: No "+ target._groundTag +" layer found", boxStyle);
        	 warned = true;    	
        }
       
		
        if(LayerMask.NameToLayer(target._herdSimLayerName) == -1){
        	EditorGUILayout.LabelField("Warning: No "+ target._herdSimLayerName +" layer found", boxStyle);
        	 warned = true;  	
        }
        
        if(warned){
        	EditorGUILayout.LabelField("Please create layers:\nLayer25: Ground\n & \nLayer26: HerdSim\n\nSee Readme.txt for more info", boxStyle2);
			EditorGUILayout.LabelField("This can must be done manually", boxStyle3);
		if(tex == null){
	        tex = new Texture2D(1, 1, TextureFormat.RGBA32, false);
			tex.SetPixel(0, 0, new Color32(0, 0, 0, 255));
			tex.hideFlags = HideFlags.DontSave;
			tex.Apply();
        }
      	  
        }
          GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Frame Skipping", EditorStyles.boldLabel);


        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelp = !showHelp;
        }
		

        EditorGUILayout.EndHorizontal(); GUI.color = aColor;
        EditorGUILayout.IntSlider(updateDivisor, 1, 9);

        if (showHelp) EditorGUILayout.LabelField("Increase performance by skipping frames", helpStyle);
        if (target._updateDivisor > 4) {
          //  GUI.color = wColor;
           
            EditorGUILayout.LabelField("Will cause choppy movement", warningStyle);
        
        } else if (target._updateDivisor > 2) {
          //  GUI.color = w2Color;
          
            EditorGUILayout.LabelField("Can cause choppy movement	", warningStyle2);
           
        }


        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Components", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpComponents = !showHelpComponents;
        }
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;
		
		
        EditorGUILayout.PropertyField(controller, new GUIContent("Controller"));
        if (showHelpComponents) EditorGUILayout.LabelField("Used to make shared roaming area", helpStyle);

        target._scanner = EditorGUILayout.ObjectField("Scanner", target._scanner, typeof(Transform), true) as Transform;
        if (showHelpComponents) EditorGUILayout.LabelField("Used for push; rotates to check for collisions", helpStyle);

        target._collider = EditorGUILayout.ObjectField("Collider", target._collider, typeof(Transform), true) as Transform;
        if (showHelpComponents) EditorGUILayout.LabelField("Rays are shot from within the collider pivot", helpStyle);

        target._model = EditorGUILayout.ObjectField("Model", target._model, typeof(Transform), true) as Transform;
        if (showHelpComponents) EditorGUILayout.LabelField("Animated model", helpStyle);

        target._renderer = EditorGUILayout.ObjectField("Renderer", target._renderer, typeof(Renderer), true) as Renderer;
        if (showHelpComponents) EditorGUILayout.LabelField("Model renderer, used to swap material when this dies", helpStyle);




        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        


        //PROPERTIES

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Properties", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpProperties = !showHelpProperties;
        }
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;

        EditorGUILayout.PropertyField(hitPoints, new GUIContent("Hit Points"));
        if (showHelpProperties) {
            EditorGUILayout.LabelField("Life points; when below zero this dies", helpStyle);
            EditorGUILayout.LabelField("Example: HerdSimCore.Damage(5);", helpStyle);
        }
        EditorGUILayout.PropertyField(type, new GUIContent("Type"));
        if (showHelpProperties) EditorGUILayout.LabelField("Creates herds with others of the same type", helpStyle);

        EditorGUILayout.PropertyField(minSize, new GUIContent("Minimum Size"));
        if (showHelpProperties) EditorGUILayout.LabelField("Randomzed scale, minimum to 1", helpStyle);


        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        


        ///AVOIDANCE

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Avoidance", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpAvoidance = !showHelpAvoidance;
        }
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;


        EditorGUILayout.PropertyField(avoidAngle, new GUIContent("Avoid Angle"));
        if (showHelpAvoidance) EditorGUILayout.LabelField("Angle of the rays used to avoid obstacles", helpStyle);

        EditorGUILayout.PropertyField(avoidDistance, new GUIContent("Avoid Distance"));
        if (showHelpAvoidance) EditorGUILayout.LabelField("How far avoid rays travel", helpStyle);

        EditorGUILayout.PropertyField(avoidSpeed, new GUIContent("Avoid Speed"));
        if (showHelpAvoidance) EditorGUILayout.LabelField("How fast this turns around when avoiding	", helpStyle);

        EditorGUILayout.PropertyField(stopDistance, new GUIContent("Stop Distance"));
        if (showHelpAvoidance) EditorGUILayout.LabelField("Proximity to collider in front before stopping", helpStyle);



        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        


        ///PUSH

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Push / Collision", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpPush = !showHelpPush;
        }
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;
	
		EditorGUILayout.PropertyField(herdSimLayerName, new GUIContent("HerdSim Layer Name"));
        if (showHelpPush) EditorGUILayout.LabelField("Layer name of herdsim animals (Default:HerdSim)", helpStyle);
						
		EditorGUILayout.PropertyField(pushyLayerMask, new GUIContent("Pushy Layer Mask"));
        if (showHelpPush) EditorGUILayout.LabelField("Push and Avoidance will avoid colliders in layers", helpStyle);
        

        EditorGUILayout.PropertyField(pushHalfTheTime, new GUIContent("Push half the time"));
        if (showHelpPush) EditorGUILayout.LabelField("Reduce how many times push checks for obstacles", helpStyle);

        EditorGUILayout.PropertyField(pushDistance, new GUIContent("Push Distance"));
        if (showHelpPush) EditorGUILayout.LabelField("How far away from obstacles before push", helpStyle);

        EditorGUILayout.PropertyField(pushForce, new GUIContent("Push Force"));
        if (showHelpPush) EditorGUILayout.LabelField("How fast/hard to push away", helpStyle);

        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        


        ///MOVEMENT

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Movement", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpMovement = !showHelpMovement;
        }
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;

		if(!target._controller){
       		 EditorGUILayout.PropertyField(roamingArea, new GUIContent("Roaming Area"));
        	if (showHelpMovement) EditorGUILayout.LabelField("The area this roams within", helpStyle);
		}
        EditorGUILayout.PropertyField(walkSpeed, new GUIContent("Walk Speed"));
        if (showHelpMovement) EditorGUILayout.LabelField("How fast this moves while walking", helpStyle);

        EditorGUILayout.PropertyField(runSpeed, new GUIContent("Run Speed"));
        if (showHelpMovement) EditorGUILayout.LabelField("How fast this moves while running", helpStyle);

        EditorGUILayout.PropertyField(damping, new GUIContent("Turn Speed"));
        if (showHelpMovement) EditorGUILayout.LabelField("How quickly this turns", helpStyle);

        EditorGUILayout.PropertyField(idleProbablity, new GUIContent("Idle Probablity"));
        if (showHelpMovement) EditorGUILayout.LabelField("Chance this will stop instead of finding a new waypoint", helpStyle);
        if (showHelpMovement) EditorGUILayout.LabelField("0-100 chance every second while idle", helpStyle);

        EditorGUILayout.PropertyField(runChance, new GUIContent("Run Chance"));
        if (showHelpMovement) EditorGUILayout.LabelField("If not idle % chance this will run instead of walk", helpStyle);



        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        



        ///GROUND

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Ground", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpGround = !showHelpGround;
        }
       
        
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;



        EditorGUILayout.LabelField("Update: Ground detection changed from Tag to Layer", helpStyle);
        EditorGUILayout.PropertyField(groundTag, new GUIContent("Ground Layer Name"));
        if (showHelpGround) EditorGUILayout.LabelField("The ground should have this layer (Default: Ground)", helpStyle);
		
		EditorGUILayout.Slider(groundCheckInterval, 0.025, 1,new GUIContent("Ground Check Interval"));

        if (showHelpGround) EditorGUILayout.LabelField("How often to check for ground (seconds)", helpStyle);

        EditorGUILayout.PropertyField(groundLayerMask, new GUIContent("Ground Layer Mask"), true);
        if (showHelpGround) EditorGUILayout.LabelField("Layers this can walk on", helpStyle);

        EditorGUILayout.PropertyField(maxGroundAngle, new GUIContent("Max Ground Angle"));
        if (showHelpGround) EditorGUILayout.LabelField("Maximum angle this will walk up", helpStyle);

        EditorGUILayout.PropertyField(maxFall, new GUIContent("Max Fall"));
        if (showHelpGround) EditorGUILayout.LabelField("Max distance to find new ground position", helpStyle);

        EditorGUILayout.PropertyField(fakeGravity, new GUIContent("Fake Gravity"));
        if (showHelpGround) EditorGUILayout.LabelField("How fast this will move towards the ground", helpStyle);




        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        



        ///HERDING

        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Herding", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpHerding = !showHelpHerding;
        }
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;
		
		EditorGUILayout.PropertyField(herdLayerMask, new GUIContent("Animal Layers"));
        if (showHelpHerding) EditorGUILayout.LabelField("Layer containing HerdSim animals", helpStyle);
        
        EditorGUILayout.PropertyField(leaderAreaMultiplier, new GUIContent("Leader Area Multiplier"));
        if (showHelpHerding) EditorGUILayout.LabelField("How big the leader area grows for each follower", helpStyle);

        EditorGUILayout.PropertyField(maxHerdSize, new GUIContent("Herd Size"));
        if (showHelpHerding) EditorGUILayout.LabelField("Minimum amount of followers", helpStyle);

        EditorGUILayout.PropertyField(minHerdSize, new GUIContent("Min Herd Size"));
        if (showHelpHerding) EditorGUILayout.LabelField("Minimum amount of followers", helpStyle);

        EditorGUILayout.PropertyField(herdDistance, new GUIContent("Herd Distance"));
        if (showHelpHerding) EditorGUILayout.LabelField("How far this will check for a herd", helpStyle);



        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
        


        ///DEATH
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Death", EditorStyles.boldLabel);
        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
            showHelpDeath = !showHelpDeath;
        }
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;

        EditorGUILayout.PropertyField(randomDeath, new GUIContent("Random Death"));
        if (showHelpDeath) EditorGUILayout.LabelField("The chance this will die randomly", helpStyle);

        EditorGUILayout.PropertyField(deadMaterial, new GUIContent("Dead Material"));
        if (showHelpDeath) EditorGUILayout.LabelField("Material to apply when this dies", helpStyle);

        EditorGUILayout.PropertyField(scaryCorpse, new GUIContent("Scary Corpse"));
        if (showHelpDeath) EditorGUILayout.LabelField("Corpse scares others", helpStyle);



        EditorGUILayout.EndVertical();
        GUI.color = dColor;
        EditorGUILayout.BeginVertical("Box");
       	


        ///ANIMATION
        EditorGUILayout.BeginHorizontal();
        EditorGUILayout.LabelField("Animation", EditorStyles.boldLabel);
	        GUI.color = helpColor; if (GUILayout.Button("?", buttonStyle)) {
	            showHelpAnimation = !showHelpAnimation;
	        }
	         
        EditorGUILayout.EndHorizontal(); GUI.color = aColor;
		

        EditorGUILayout.PropertyField(animIdle, new GUIContent("Idle"), true);
        if (showHelpAnimation) EditorGUILayout.LabelField("Idle animation name", helpStyle);

        EditorGUILayout.PropertyField(animIdleSpeed, new GUIContent("Idle Speed"), true);
        EditorGUILayout.PropertyField(animSleep, new GUIContent("Sleep"), true);
        EditorGUILayout.PropertyField(animSleepSpeed, new GUIContent("Sleep Speed"), true);
        EditorGUILayout.PropertyField(animWalk, new GUIContent("Walk"), true);
        EditorGUILayout.PropertyField(animWalkSpeed, new GUIContent("alk Speed"), true);
        EditorGUILayout.PropertyField(animRun, new GUIContent("Run"), true);
        EditorGUILayout.PropertyField(animRunSpeed, new GUIContent("Run Speed"), true);
        EditorGUILayout.PropertyField(animDead, new GUIContent("Dead"), true);
        EditorGUILayout.PropertyField(animDeadSpeed, new GUIContent("Dead Speed"), true);
        EditorGUILayout.PropertyField(idleToSleepSeconds, new GUIContent("Seconds to sleep"), true);
        if (showHelpAnimation) EditorGUILayout.LabelField("Time it takes to fall asleep", helpStyle);
        if (showHelpAnimation) EditorGUILayout.LabelField("(or change to another idle)", helpStyle);

        EditorGUILayout.EndVertical();
        
        GUI.color = helpColor; if (GUILayout.Button("Add HerdSimDisabler Script")) {
        	
        	for(var i:int = 0; i < Selection.gameObjects.length; i ++){
        		var h:HerdSimDisabler;
        		h = Selection.gameObjects[i].GetComponent(HerdSimDisabler);
        		if(h == null)
        			Selection.gameObjects[i].AddComponent(HerdSimDisabler);
        	}
        }
        if (GUI.changed) EditorUtility.SetDirty(target);
        serializedObject.ApplyModifiedProperties();
    }
}