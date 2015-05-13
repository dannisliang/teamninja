#pragma strict
var _chase:HerdSimCore;
var _scareType:int[];			//What types can this scare
var _canChase:boolean;			//If this is a HerdSim object, it will chase others

var _scaryInterval:float = .25;

var _herdLayerMask:LayerMask = -1;

function Start () {
	Init();
}

function Init() {
	if(_scareType.Length > 0){
		InvokeRepeating("BeScary", (Random.value*_scaryInterval)+1 , _scaryInterval);
		InvokeRepeating("CheckChase", 2,2);
	}else{
		Debug.Log(this.transform.name + " has nothing to scare; Please assigne ScareType");
	}
}


function CheckChase(){
	_canChase=!_canChase;
	if(!_canChase)
	_chase = null;
}

function BeScary() {
	var hitColliders:Collider[] = Physics.OverlapSphere(transform.position, 4, _herdLayerMask);
	var c:HerdSimCore = null;
	for (var i = 0; i < hitColliders.Length; i++) {
		var t:Transform = hitColliders[i].transform.parent;
		if(t)
		c = t.GetComponent(HerdSimCore);
		if(c){
			var scare:boolean;
			for(var j:int = 0; j < _scareType.Length; j++){		
				if(c._type == _scareType[j])
				scare=true;			
			}
			if(scare){
				c.Scare(this.transform);
				if(!_chase && _canChase)
				_chase = c;
			}
		}	
	}
	if(_chase){
		var p:HerdSimCore = GetComponent(HerdSimCore);
		if(p){
			p._waypoint = _chase.transform.position;
			p._mode = 2;
		}
	}
}