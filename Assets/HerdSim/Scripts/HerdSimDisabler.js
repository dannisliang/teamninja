#pragma strict
var _distanceDisable:int = 1000;
var _distanceFrom:Transform;
var _distanceFromMainCam:boolean;
var _checkDisableEverSeconds:float = 10;
var _checkEnableEverSeconds:float = 1;

var _disableModel:boolean;
var _disableCollider:boolean;
var _disableOnStart:boolean;

function Start () {
	if(_distanceFromMainCam){
		_distanceFrom = Camera.main.transform;
	}
	
	InvokeRepeating("CheckDisable", _checkDisableEverSeconds + (Random.value * _checkDisableEverSeconds) , _checkDisableEverSeconds);
	InvokeRepeating("CheckEnable", _checkEnableEverSeconds + (Random.value * _checkEnableEverSeconds) , _checkEnableEverSeconds);
	
	Invoke("DisableOnStart", 0.01f);
}

function DisableOnStart () {
	if(_disableOnStart){
		transform.GetComponent(HerdSimCore).Disable(_disableModel, _disableCollider);
	}
}

function CheckDisable () {
	if(_distanceFrom != null && transform.GetComponent(HerdSimCore)._enabled && (transform.position - _distanceFrom.position).sqrMagnitude > _distanceDisable){
		transform.GetComponent(HerdSimCore).Disable(_disableModel, _disableCollider);	
	}
}

function CheckEnable () {
	if(_distanceFrom != null && !transform.GetComponent(HerdSimCore)._enabled && (transform.position - _distanceFrom.position).sqrMagnitude < _distanceDisable){	
		transform.GetComponent(HerdSimCore).Enable();
	}
}