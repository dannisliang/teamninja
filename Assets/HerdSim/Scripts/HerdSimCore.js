#pragma strict
///HERDSIM is a simple and easy to use animal roaming simulator.
///Simply drag the prefab to the stage and it will move within the roaming area.
///Assign a tag to the ground. (Default tag name: "Ground")

///To use a custom model:
///Duplicate the example pig prefab included.
///Drag the prefab to the stage.
///Drag the custom model to stage and replace the model object. Make sure it is rotated in the same direction as the old model.
///Move the Scanner gameobject from old Model to the new model. Rotation of Scanner object should be 0,0,0
///Delete the old model from the gameobject.
///Assign new model to the _model variable.
///Assign the right animation names.
///Adjust collider if needed.
///Adjust Avoidance and push variables if needed.
///Apply changes.

///Hierarchy of HerdSim object:
///-Prefab
///		-Model			- Model with animations, bones and materials. Default animation names: walk, run, sleep, idle and dead
///			-Scanner	- Rotates to check for collisions, pushes away from objects close by. To avoid using rigidbodies for collisions, this method proves alot more CPU friendly.
///		-Collider		- Rays will be shot from the pivot point of this gameobject, make sure the pivot is inside the collider bounds. Or else ray might hit it's own collider.
///

///OBJECTS
public var _controller:HerdSimController;	//Controller is used to make one big roaming area
public var _scanner:Transform;				//Scanner object used for push, this rotates to check for collisions
public var _collider:Transform;				//Collider object, ground check uses _collider position to find ground. Ray is shot from within the collider to avoid hitting this collider
public var _model:Transform;				//Model object, must be parented within this transform and contain the required animations.
public var _renderer:Renderer;				//Renderer of the model object, used to swap material when this dies


///PROPERTIES
public var _hitPoints:float = 100;			//Life points, below zero and this dies. Use the Damage(x); function to decrease hitpoints: example : SendMessage ("Damage", 5.0);
public var _type:int;						//This will only create herds with others of the same type
public var _minSize:float = 1;				//Randomzed scale, minimum. (only scales down to avoid clipping, this walking trough others)


///AVOIDANCE
public var _avoidAngle:float = 0.35; 		//Angle of the rays used to avoid obstacles left and right
public var _avoidDistance:float;			//How far avoid rays travel
public var _avoidSpeed:float = 75;			//How fast this turns around when avoiding	
public var _stopDistance:float;				//How close this can be to objects directly in front of it before stopping and backing up. This will also rotate slightly, to avoid "robotic" behaviour
private var _rotateCounterR:float;			//Used to increase avoidance speed over time
private var _rotateCounterL:float;


///PUSH (COLLISIONS) - Push is used to simulate collisions, a ray is used to scan for close by objects and push this away
public var _pushHalfTheTime:boolean;
private var _pushToggle:boolean;
public var _pushDistance:float;				//How far away obstacles can be before starting to push away	
public var _pushForce:float = 5;			//How fast/hard to push away
private var _scan:boolean;					//Scanner rotate fast or slow


///MOVEMENT
public var _roamingArea:Vector3;			//The area this roams within, this will not be used if a herd controller is assigned
public var _walkSpeed:float = .5;			//The speed of this while walking
public var _runSpeed:float = 1.5;			//Running speed
public var _damping:float;					//How fast this should turn towards waypoint, avay from obstacles or scary objects
public var _idleProbablity:int = 20;		//Chance this will stop instead of finding a new waypoint 20 is aprox 20 to 1 chance every second standing still.
public var _runChance:float = .1;			//If not idle % chance this will run instead of walk (only applies to leaders or individuals without a herd)


public var _waypoint : Vector3;						//Waypoint this should rotate towards
public var _speed:float;							//Current speed this has
public var _targetSpeed:float;						//The desired speed
public var _mode:int = 0;							//The movement state of this, 0 = idle 1 = walk 3 = run
public var _startPosition:Vector3;					//The position this was when it was added to the scene, used for roaming area when no herd controller is assigned. Change this to move roaming area when not using controller										
private var _reachedWaypoint:boolean = true;		//If this can get a new waypoint to move to
private var _lerpCounter:int;						//Used to rotate smoothly


///FEAR
public var _scared:boolean;				//If this is scared it will run and flee away from _scareOf
public var _scaredOf:Transform;


///FOOD
public var _eating:boolean;				
public var _food:Transform;


///GROUND
public var _groundCheckInterval:float = 0.1;	//How often to check where the ground is
public var _groundTag:String = "Ground";		//The ground should have this tag so that this knows how to behave if it collides with it (not avoid ground)
private var _ground:Vector3;					//Position of last ground position
private var _groundRot:Quaternion;				//The rotation used on the model to align with the grounds angle
private var _grounded:boolean;
public var _maxGroundAngle:float = 45;		//Maximum angle this will walk up
public var _maxFall:float = 3;				//Max distance to find new ground position, used to avoid falling down from heights. It is better to use invisible colliders.
public var _fakeGravity:float = 5;			//How fast this will move towards the ground. This works on both up and down directions smoothly.


///HERD
var _herdLayerMask:LayerMask = -1;					//Mask to look for other animals
public var _leader:HerdSimCore;						//Who is the leader of the pack, can be this
public var _leaderArea:Vector3;						//When this is a leader, this are will be used by all followers
public var _leaderSize:int;							//How many followers this has
public var _leaderAreaMultiplier:float = .2;		//How big the leader area grows for each follower
public var _maxHerdSize:int = 25;					//Max amount of followers
public var _minHerdSize:int = 10;					//Min ---
public var _herdDistance:float = 2;					//How far this will check for a herd
private var _herdSize:int;							//Random Min/Max followers this can have


///DEATH
public var _dead:boolean;							//This is dead or not
public var _randomDeath:float = .001;				//The chance this will die randomly (aprox check every second)
public var _deadMaterial:Material;					//Material to apply when this dies
public var _scaryCorpse:boolean;					//Corpse scares others


///ANIMATIONS
public var _animIdle:String = "idle";
public var _animIdleSpeed:float = 1;
public var _animSleep:String = "sleep";
public var _animSleepSpeed:float = 1;
public var _animWalk:String = "walk";
public var _animWalkSpeed:float = 1;
public var _animRun:String = "run";
public var _animRunSpeed:float = 1;
public var _animDead:String = "dead";
public var _animDeadSpeed:float = 1;
public var _idleToSleepSeconds:float = 1;

private var _sleepCounter:float;
private var _idle:boolean;						//Used for idle animations

///FRAME SKIP
private var _updateCounter:int;					//
public var _updateDivisor:int = 1;				//Skip update every N frames (Higher numbers might give choppy results, 3 - 4 on 60fps , 2 - 3 on 30 fps)
private static var _updateNextSeed:int = 0;		
private var _updateSeed:int = -1;	
private var _newDelta:float;

///ENABLE/DISABLE
public var _enabled:boolean;

public var _groundLayerMask:LayerMask = -1;
public var _pushyLayerMask:LayerMask = -1;
public var _herdSimLayerName:String = "HerdSim";

private var _groundIndex:int = 25;
private var _herdSimIndex:int = 26;

function Disable(disableModel:boolean, disableCollider:boolean){
	if(_enabled){
		_enabled = false;
		CancelInvoke();		
		if(disableModel)
		this._model.gameObject.SetActive(false);
		if(disableCollider)
		this._collider.gameObject.SetActive(false);
		transform.GetComponent(HerdSimCore).enabled = false;
		_model.GetComponent.<Animation>().Stop();
	}
}

function Enable(){
	if(!_enabled){
		_enabled = true;
		Init();
		if(!_model.gameObject.activeInHierarchy)
		this._model.gameObject.SetActive(true);
		if(!_collider.gameObject.activeInHierarchy)
		this._collider.gameObject.SetActive(true);
		transform.GetComponent(HerdSimCore).enabled = true;
		_model.GetComponent.<Animation>().Play();
	}
}

function Damage(d:float){
	_hitPoints -= d;
	if(_hitPoints <=0){
		Death();
	}
}

function Effects(){
	if(_controller  && _mode == 2 && _controller._runPS && _speed > 1 ){
    	_controller._runPS.transform.position = this.transform.position;
		_controller._runPS.Emit(1);
	}
	if(_dead && _controller && _controller._deadPS){
		_controller._deadPS.transform.position = _collider.transform.position;
		_controller._deadPS.Emit(1);
	}
}

function Death(){
	if(!_dead){
		_dead = true;
		this._mode = 0;
		CancelInvoke("Wander");
		CancelInvoke("WalkTimeOut");
		CancelInvoke("FindLeader");
		if(_leader){
			if(_leader != this)	
			_leader._leaderSize--;
			else
			_leaderSize = 0;
			_leader = null;
		}
		if(_deadMaterial)
		_renderer.sharedMaterial = _deadMaterial;		
		_model.GetComponent.<Animation>()[this._animDead].speed = 1;   
		_model.GetComponent.<Animation>().CrossFade(_animDead,.1);
		if(_scaryCorpse)
		InvokeRepeating("Corpse", 1, 1);
	}
}

function Corpse(){
	var hitColliders = Physics.OverlapSphere(transform.position, 10);
		var c:HerdSimCore;
		for (var i = 0; i < hitColliders.Length; i++) {
			if(hitColliders[i].transform.parent)
			c = hitColliders[i].transform.parent.GetComponent(HerdSimCore);
			if(_scaryCorpse && c && !c._dead && c._mode<1){
				c.Scare(transform);
			}
		}
}

///HERD
function FindLeader(){
	if(_leader == this && _leaderSize <= 1){
		_leader = null;
		_leaderSize = 0;
	}else 	 
	if(_leader != this){
		if(_leader && _leader._dead)
		_leader=null;
		_leaderSize = 0;
		var hitColliders = Physics.OverlapSphere(transform.position, _herdDistance, _herdLayerMask);
		var c:HerdSimCore;
		for (var i = 0; i < hitColliders.Length; i++) {
			if(hitColliders[i].transform.parent)
			c = hitColliders[i].transform.parent.GetComponent(HerdSimCore);
			if(c && c!=this && _type == c._type){
				//Nobody has a leader, this becomes leader of other
				if(!_leader && !c._leader){				
					_leader = this;
					c._leader = this;
					_leaderSize +=2;
					break;
				}						
				//If collider object has leader but this has null, leader is adopded -easy
				if(!_leader && c._leader && c._leader._leaderSize < c._leader._herdSize){			
					_leader = c._leader;
					_leader._leaderSize++;
					break;
				}
				if(_leader && c._leader != _leader){
					if(c._leader && c._leader._leaderSize >= _leader._leaderSize && c._leader._leaderSize < c._leader._herdSize){
						_leader._leaderSize--;
						c._leader._leaderSize++;
						_leader = c._leader;
						break;
					}
				}
			}
		}
	}
}

function Wander(){

	var t:Vector3;
		if(_leader == this)
		_leaderArea = Vector3.one * ((_leaderSize*_leaderAreaMultiplier)+1);
		var _ra:Vector3;
		var _pb:Vector3;
		if(_leader && _leader!=this){
			_ra = _leader._leaderArea;
			_pb = _leader.transform.position;
		}else if(!_controller){
			_ra = _roamingArea;
			_pb = _startPosition;
		}else{
			_ra = _controller._roamingArea;
			_pb = _controller.transform.position;
		}
		t.x = Random.Range(-_ra.x, _ra.x) + _pb.x;
		t.z = Random.Range(-_ra.z, _ra.z) + _pb.z;	
	if(_food){
		t = _food.position;
		_mode = 2;
		}else{
			//Check if this is inside the roaming area, if not run to next waypoint.
			if(transform.position.x < -_ra.x + _pb.x 
			|| transform.position.x > _ra.x + _pb.x
			|| transform.position.z < -_ra.z + _pb.z
			|| transform.position.z > _ra.z + _pb.z
			){	
			if(Random.value < .1){
				_mode = 2;	//Run
			}else{
				_mode = 1;	//Walk
			}
			_waypoint = t;
			}else if(_leader && _leader != this && Random.value < .75){			
				_mode = 0;	//Stop			
			}else if(_reachedWaypoint){
				_mode = Random.Range(-_idleProbablity , 2);		
				if(_mode == 1 && Random.value < this._runChance && (!_leader||_leader == this)){
					_mode = 2;
				}
			}
		}

	if(_reachedWaypoint && _mode > 0){
		_waypoint = t;
		CancelInvoke("WalkTimeOut");
		Invoke("WalkTimeOut", 30);
		_reachedWaypoint = false;
	}
	
	_waypoint.y = _collider.transform.position.y;
	_lerpCounter = 0;
	
	if(Random.value < _randomDeath)
	Death();
}

function Init() {
	if(_controller){
		//Controller holds all particle effects, greatly reduces draw calls compared to using particle systems on everything
		InvokeRepeating("Effects" , 1+Random.value ,.1);
	}
	//Repeating function: creates new waypoits and sets behavior
	InvokeRepeating("Wander" , 1+Random.value ,1);
	
	//Repeating function: Finds and sets ground position
	InvokeRepeating("GroundCheck", (_groundCheckInterval*Random.value) +1 , _groundCheckInterval);
	
	//Repeating function: Looks for a herd leader, or sets itself as one if none are found
	InvokeRepeating("FindLeader", Random.value*3, 3);
}

function Start() {
	_enabled = true;
	_groundIndex = LayerMask.NameToLayer(this._groundTag);
	_herdSimIndex = LayerMask.NameToLayer(this._herdSimLayerName);
	
	if(_updateDivisor > 1){
		var _updateSeedCap:int = _updateDivisor - 1;
		_updateNextSeed++;
	    this._updateSeed = _updateNextSeed;
	    _updateNextSeed = _updateNextSeed % _updateSeedCap;
	}
	//GroundTag should not be null
	if(!_groundTag)
	_groundTag = "Ground";
	
	Init();
	
	//Save starting position so that roaming area doesn't move
	_startPosition = transform.position;

	//Makes sure push distance is greater than zero
	if(_pushDistance <=0)
	_pushDistance = _avoidDistance *.25;
	
	//Makes sure stopping distance is greater than zero
	if(_stopDistance <=0)
	_stopDistance = _avoidDistance *.25;
	
	//Set ground and waypoint to this position
	_ground = _waypoint = transform.position;
	
	//Ignores max fall first time looking for ground
	var b:float = _maxFall;
	_maxFall = 1000000;
	GroundCheck();
	_maxFall = b;
		
	if(!_collider)
		_collider = transform.FindChild("Collider");
	
	//Randomize herd size when this is leader
	_herdSize = Random.Range(this._minHerdSize, this._maxHerdSize);
	
	//Randomize transform size
	if(this._minSize < 1)
		this.transform.localScale = Vector3.one*Random.Range(this._minSize, 1);
		
	_model.GetComponent.<Animation>()[this._animIdle].speed = _animIdleSpeed;
	_model.GetComponent.<Animation>()[this._animDead].speed = _animDeadSpeed;
	_model.GetComponent.<Animation>()[this._animSleep].speed = _animSleepSpeed;
}

function AnimationHandler(){
	if(!_dead){
		if(_mode == 1){
			if(_speed>0)
				_model.GetComponent.<Animation>()[_animWalk].speed = (_speed*_animWalkSpeed) + 0.051; 
			else
				_model.GetComponent.<Animation>()[_animWalk].speed = .1;
			_model.GetComponent.<Animation>().CrossFade(_animWalk, .5);
			_idle = false;
		}else if(_mode == 2){		
			if(_speed > _runSpeed*.35){
			_model.GetComponent.<Animation>().CrossFade(_animRun, .5);
			_model.GetComponent.<Animation>()[_animRun].speed = (_speed*_animRunSpeed) + 0.051;
			}else{
			_model.GetComponent.<Animation>().CrossFade(_animWalk, .5);
			_model.GetComponent.<Animation>()[_animWalk].speed = (_speed*_animWalkSpeed) + 0.051;
			}
			_idle = false;	
			
		}else{
			if(!_idle && _speed < .5){
				_sleepCounter = 0;
				_model.GetComponent.<Animation>().CrossFade(_animIdle, 1);
				_idle = true;					
			}
			if(_idle && _sleepCounter > _idleToSleepSeconds)
				_model.GetComponent.<Animation>().CrossFade(_animSleep, 1);
			else 
				_sleepCounter+=_newDelta;
		}
	}
}

//Scare this for x seconds, t = object this is running away from
function Scare(t:Transform){
	_scaredOf = t;
	_mode = 2;
	if(!_scared){
		_scared = true;
		UnFlock();
		
		yield WaitForSeconds(3);
		_scared = false;
		Wander();
		_reachedWaypoint = true;
	}
}

//
function Food(t:Transform){
	if(!_food){
		_food = t;
	}
}

//Uses scanner to push away from obstacles
function Pushy() {
	var hit : RaycastHit;
	var dx:float;
	var fwd:Vector3 = _scanner.forward;

	if(_scan)	//Scan fast if not pushing
	_scanner.Rotate(Vector3(0,1000*_newDelta,0));
	else		//Scan slow if pushing
	_scanner.Rotate(Vector3(0,250*_newDelta,0));
	if (Physics.Raycast(_collider.transform.position, fwd, hit, _pushDistance, _pushyLayerMask)){
		var trns:Transform = hit.transform;
		if(trns.gameObject.layer != _groundIndex||(trns.gameObject.layer == _groundIndex && Vector3.Angle(Vector3.up, hit.normal) > _maxGroundAngle)){	
			var dist:float = hit.distance;
			dx = (_pushDistance - dist)/_pushDistance;	
			if(gameObject.layer != _herdSimIndex){	
				transform.position -= fwd*_newDelta*dx*_pushForce;
			}else if(dist < _pushDistance *.5){
				transform.position -= fwd*_newDelta*(dx-.5)*_pushForce;				
			}
			_scan = false;
		}else{
			_scan = true;
		}
	}else{
		_scan = true;
	}
}

function UnFlock(){
	if(_leader && _leader != this){
		_reachedWaypoint = true;
		_leader._leaderSize--;
		_leader = null;
		Wander();
	}
}

function WalkTimeOut() {
	_reachedWaypoint = true;
	UnFlock();
	Wander();
}

function Update() {
	//Skip frames
	if(_updateDivisor > 1){
		_updateCounter++;
		if (_updateCounter != _updateSeed ){
	            _updateCounter = _updateCounter % _updateDivisor;	
	            return;         
	        }
	        _updateCounter = _updateCounter % _updateDivisor;
		_newDelta = Time.deltaTime*_updateDivisor;	
	}else{
		_newDelta = Time.deltaTime;
	}
	
	//Fake collisions
	if(!_pushHalfTheTime || _pushToggle)
	Pushy();
	_pushToggle=!_pushToggle;
	
	//Fake gravity
	var gr:Vector3 = transform.position;
	gr.y -= (transform.position.y-_ground.y)*_newDelta*_fakeGravity;
	transform.position = gr;
	
	if(!_dead){
		AnimationHandler();
	
	var lookit:Vector3;
	var rotation:Quaternion;
	
	//Rotates model to align with the ground
	_model.transform.rotation = Quaternion.Slerp(_model.transform.rotation, _groundRot, _newDelta  * 5);
	var rot:Quaternion = _model.transform.localRotation;
	rot.eulerAngles = Vector3(rot.eulerAngles.x, 0, rot.eulerAngles.y);
	_model.transform.localRotation = rot;
	
	//Look at waypoints, rotation is used for movement direction
	if(!_scared && _mode>0){
		lookit = _waypoint - transform.position;
		if(lookit != Vector3.zero) rotation = Quaternion.LookRotation(lookit);
	}
	else if(_scared){
		lookit = _scaredOf.position - transform.position;
		if(lookit != Vector3.zero) rotation = Quaternion.LookRotation(-lookit);
	}
  
    
    //Check distance to waypoint
    if((transform.position - _waypoint).sqrMagnitude < 10){
   		if(_mode > 0)
   		_mode=1;
   		_reachedWaypoint = true;
    }else{
    	_eating = false;
    }
    
    //If scared this will always run. Eating always stopped if not scared.
   	if(this._scared||_leader && _leader!=this && _leader._mode==2){
   		_mode = 2;
   	}else if(_eating){
   		_mode = 0;
   	}
   	 	
    if(_mode == 1){   
    	 if(_leader !=this)
    	 _targetSpeed = _walkSpeed;
    	 else
    	 _targetSpeed = _walkSpeed*.75;
    }else if(_mode == 2){
    	_targetSpeed = _runSpeed;
    }
    
  	_speed = Mathf.Lerp(_speed, _targetSpeed, _lerpCounter * _newDelta *.05);
  	_lerpCounter++;

    if(!Avoidance ()){
   	 	transform.rotation = Quaternion.Slerp(transform.rotation, rotation, _newDelta * _damping);
    }
    
  	if(_mode == 1) _targetSpeed = _walkSpeed;
    else if(_mode == 2) _targetSpeed = _runSpeed;
    else if(_mode <= 0) _targetSpeed = 0;
    
	transform.rotation = Quaternion.Euler(0, transform.rotation.eulerAngles.y,0);
}
	
	///MOVEMENT
	if(!_grounded){
		//Turns off scared when not grounded
		_scared = false;
		UnFlock();
		var pos:Vector3;
		pos = transform.position;
		pos.x -= (transform.position.x-_ground.x)*_newDelta*15;
		pos.z -= (transform.position.z-_ground.z)*_newDelta*15;
		transform.position = pos;
	}else if(!_dead){	
    	transform.position += transform.TransformDirection(Vector3.forward)*_speed*_newDelta;	
	}
}

function GroundCheck(){
	var hit : RaycastHit;
	if (Physics.Raycast(Vector3(transform.position.x, _collider.transform.position.y, transform.position.z) , -transform.up, hit, _maxFall, _groundLayerMask)){
		_grounded = true;
		_groundRot = Quaternion.FromToRotation(_model.transform.up, hit.normal) * _model.transform.rotation;
		_ground = hit.point;
	}else{
		_grounded = false;
		_waypoint = transform.position + (transform.right*5);
		_speed = 0;
	}
}
  					
function Avoidance ():boolean {
	//Avoidance () - Returns true if there is an obstacle in the way
		var r:boolean;
		var hit : RaycastHit;
		var dx:float;
		var fwd:Vector3 = _model.transform.forward;
		var rgt:Vector3 = _model.transform.right;
		var trns:Transform;
		var spd:float = Mathf.Clamp(_speed, 0.1, 1);
		var rot:Quaternion;
		
		//If idle and not moving return
		if(_mode == 0 && _speed < 0.21){
			return true;
		}
		
		//Crash avoidance //Checks for obstacles forward
		if (Physics.Raycast(_collider.transform.position, fwd+(rgt*Random.Range(-.1, .1)), hit, _avoidDistance *.9,_pushyLayerMask)){
			trns = hit.transform;
			if(trns.gameObject.layer != _groundIndex ||(trns.gameObject.layer == _groundIndex && Vector3.Angle(Vector3.up, hit.normal) > _maxGroundAngle)){
				//Debug.DrawLine(_collider.transform.position,hit.point);
				var dist:float = hit.distance;
				dx = (_avoidDistance - hit.distance)/_avoidDistance;
					rot = transform.rotation;			
					if(_rotateCounterL > _rotateCounterR){
						rot.eulerAngles = Vector3(rot.eulerAngles.x, rot.eulerAngles.y -_avoidSpeed*_newDelta*dx, rot.eulerAngles.z);
					}
					else{
						rot.eulerAngles = Vector3(rot.eulerAngles.x, rot.eulerAngles.y +_avoidSpeed*_newDelta*dx, rot.eulerAngles.z);
					}
					transform.rotation = rot; 
					
				if(dist < _stopDistance*.5){	
					_speed = -.2;
					r = true;
				}if(dist < _stopDistance && _speed > .2){
					_speed -= _newDelta*(1-dx)*25;
				}
				
				if(_speed < -.2){
					_speed = -.2;
				}
			}
		}
		//Avoid obstacles left and right in front
		else if (_mode > 0 && Physics.Raycast(_collider.transform.position, fwd+(rgt*(_avoidAngle+_rotateCounterL)), hit, _avoidDistance,_pushyLayerMask)){
			trns = hit.transform;
			if(trns.gameObject.layer != _groundIndex ||(trns.gameObject.layer == _groundIndex && Vector3.Angle(Vector3.up, hit.normal) > _maxGroundAngle)){	
				//	Debug.DrawLine(_collider.transform.position,hit.point);
				_rotateCounterL+=_newDelta;
				dx = (_avoidDistance - hit.distance)/_avoidDistance;
				rot = transform.rotation;	
				rot.eulerAngles = Vector3(rot.eulerAngles.x, rot.eulerAngles.y -_avoidSpeed*_newDelta*dx*_rotateCounterL*spd, rot.eulerAngles.z);
				transform.rotation = rot; 

				if(_rotateCounterL > 1.5){
					_rotateCounterL = 1.5;	
					_rotateCounterR = 0;
					r= true;
				}
			}
		}
		else if (_mode > 0 && Physics.Raycast(_collider.transform.position, fwd+(rgt*-(_avoidAngle+_rotateCounterR)), hit, _avoidDistance,_pushyLayerMask)){
			trns = hit.transform;
			if(trns.gameObject.layer != _groundIndex  ||(trns.gameObject.layer == _groundIndex && Vector3.Angle(Vector3.up, hit.normal) > _maxGroundAngle)){
			//	Debug.DrawLine(_collider.transform.position,hit.point);
				_rotateCounterR +=_newDelta;
				dx = (_avoidDistance - hit.distance)/_avoidDistance;
				rot = transform.rotation;	
				rot.eulerAngles = Vector3(rot.eulerAngles.x, rot.eulerAngles.y + _avoidSpeed*_newDelta*dx*_rotateCounterR*spd, rot.eulerAngles.z);
				transform.rotation = rot; 
				
				if(_rotateCounterR > 1.5){
					_rotateCounterR = 1.5;
					_rotateCounterL = 0;
					r= true;
				}
			}
		}else{
			_rotateCounterL = 0;
			_rotateCounterR = 0;
		}	
		return r;																	    																																				    																				
}

function OnDrawGizmos () {
		var guiStyle:GUIStyle = new GUIStyle();
		var colorBlue:Color = Color.blue;
		var colorCyan:Color = new Color32(0, 255, 246, 255);
		var colorYellow:Color = new Color32(255, 255, 0, 255);
		
		guiStyle.normal.textColor = Color.yellow;		
		if(!Application.isPlaying){
			_startPosition = transform.position;			
		}else{
		 	Gizmos.color = colorCyan;
	  		Gizmos.DrawLine(_collider.transform.position, _waypoint);
		}
		if(!_controller){
	       	Gizmos.color = colorBlue;
	       	Gizmos.DrawWireCube (_startPosition, _roamingArea*2);
		}
		if(_leader==this){
			Gizmos.color = colorYellow;
	       	Gizmos.DrawWireCube (transform.position, Vector3(_leaderArea.x*2, 0, _leaderArea.y*2));
			Gizmos.DrawIcon(_collider.transform.position,"leader.png", false);
			//Handles.Label(_collider.transform.position, " " +this._leaderSize + " / " + this._herdSize,g);
		}else if(_leader){
			Gizmos.color = colorYellow;
			Gizmos.DrawLine(_collider.transform.position, _leader._collider.transform.position);
		}	
		if(_scared)
		Gizmos.DrawIcon(_collider.transform.position,"scared.png", false);
	
	if(_dead){
		Gizmos.DrawIcon(_collider.transform.position,"dead.png", false);
	}	
}


//function LerpByDistance( A:Vector3, B:Vector3, x:float)
//{
//     var P:Vector3 = x * Vector3.Normalize(B - A) + A;
//    return P;
//}