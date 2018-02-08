////////////////////////////////////////////////////////////////
// Project Web Console                                        //
// Copyright 2016 by Hristo Iankov        All Rights Reserved //
// This file is part of a larger project, please keep the     //
// files together.                                            //
////////////////////////////////////////////////////////////////


// library name convention:
// filename : lib-math
// classname: MathLibrary

function MathLibrary() {
	
	// mandatory help function
	this.getHelp = function() {
		var text = 
		"| ---------------------- Math ---------------------- |\n" +
		"| sin(), cos(), tan()       - trigonometry           |\n" +
		"| PI                        - constants              |\n" +
		"| hex()                     - conversions            |\n" +
		"| pow(a,b)                  - raise a to the b power |";
		return text;
	};
	
	// define the command map at the end
	this.commandmap = {};
}

var PI = Math.PI;
function pow(a, b) {return Math.pow(a, b);}
function sin(exp) {return Math.sin(exp);}
function cos(exp) {return Math.cos(exp);}
function tan(exp) {return Math.tan(exp);}
function hex(exp) {return "0x" + exp.toString(16);}