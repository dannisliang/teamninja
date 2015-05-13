#pragma strict
var _roamingArea:Vector3;

var _runPS:ParticleSystem;
var _deadPS:ParticleSystem;

function OnDrawGizmos () {
       	Gizmos.color = Color.blue;
       	Gizmos.DrawWireCube (transform.position, _roamingArea*2);
    }