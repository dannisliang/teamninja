#
#
#	First consider making a BACKUP of project before changing script language.
#	The following procedure will replace scripts. 
#	
#	
#	HOW TO CHANGE FROM JS TO C SHARP:
#
#		To use the C# scripts: 
#			Delete the 4 JS scripts BEFORE importing.
#				- Delete:
#					-HerdSimController.js
#					-HerdSimCore.js
#					-HerdSimDisabler.js
#					-HerdSimScary.js
#				- Double Click "HerdSim C Scripts".
#				- Import.
#
#
#		
#		To change back to JS scripts:
#			Delete the 4 C# scripts BEFORE importing.
#				- Delete:
#					-HerdSimController.cs
#					-HerdSimCore.cs
#					-HerdSimDisabler.cs
#					-HerdSimScary.cs
#				- Double Click "HerdSim JS Scripts".
#				- Import.
#		
#			- or -
#
#				Re-import the scripts from the Unity asset package.
#
#
#		If a replaced file is not deleted before importing the C# version will have .JS extension.
#			This will produce errors.
#			Simply Delete the file and import C# version again.