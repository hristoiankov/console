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
	this.definition = {
		name: "Basic",
		commands: [
			{
				pattern: null,
				action: null,
				signiture: "sin(), cos(), tan()",
				description: "trigonometry"},
			{
				pattern: null, 
				action: null, 
				signiture: "PI",
				description: "constants"},
			{
				pattern: null, 
				action: null, 
				signiture: "hex()",
				description: "conversions"},
			{
				pattern: null, 
				action: null, 
				signiture: "pow(a,b)",
				description: "raise a to the power of b"}
		]
	};
}
WebConsole.addLibrary(new MathLibrary());

var PI = Math.PI;
function pow(a, b) {return Math.pow(a, b);}
function sin(exp) {return Math.sin(exp);}
function cos(exp) {return Math.cos(exp);}
function tan(exp) {return Math.tan(exp);}
function hex(exp) {return "0x" + exp.toString(16);}