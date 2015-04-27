using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class BuildCollider : MonoBehaviour {

	public enum ColliderTypes { 
		Floor, 
		Wall, 
		Ceiling, 
		Pillar 
	};

	public ColliderTypes ColliderType;

	public BuildCollider ()
	{

	}

	// The factory
	public static BuildCollider GetCollider(ColliderTypes colliderType) {
		// Floor
		if (colliderType == ColliderTypes.Floor) {
			return new FloorCollider();
		}
		
		// Wall
		if (colliderType == ColliderTypes.Wall) {
			return new WallCollider();
		}

		// Pillar
		if (colliderType == ColliderTypes.Pillar) {
			return new PillarCollider();
		}

		return new BuildCollider ();
	}
}

public class FloorCollider : BuildCollider
{

}

public class WallCollider : BuildCollider
{
	
}

public class PillarCollider : BuildCollider
{
	
}
