////////////////////////////////////////////////////////////////
// Project Web Console                                        //
// Copyright 2016 by Hristo Iankov        All Rights Reserved //
// This file is part of a larger project, please keep the     //
// files together.                                            //
////////////////////////////////////////////////////////////////



function DisplayLibrary(myconsole) {

	this.darkenDisplay = function() {
		$('*').css("background-color", "black");
		$('*').css("border-color", "black");
		$('*').css("color", "gray");
		return "";
	}
	this.lowerConsole = function() {
		$(myconsole.formSelector).css("height", "50px");
		return "";
	}
	this.standardConsole = function() {
		$(myconsole.formSelector).css("height", "200px");
		return "";
	}
	this.fullConsole = function() {
		$(myconsole.formSelector).css("height", "100%");
		$(myconsole.formSelector).css("z-index", "100");
		$(myconsole.formSelector).hide();
		return "";
	}
	
	// mandatory help function
	this.getHelp = function() {
		var text = 
		"| -------------------- Display --------------------- |\n" +
		"| darken display            - darken the display     |\n" +
		"| lower console             - lower the console      |\n" +
		"| standard console          - return console to 200px|\n" +
		"| full console              - fill screen w/ console |";
		return text;
	};
	
	// define the command map at the end
	this.commandmap = {};
	this.commandmap['^darken display$']     = this.darkenDisplay;
	this.commandmap['^lower console$'] 	    = this.lowerConsole;
	this.commandmap['^standard console$']	= this.standardConsole;
	this.commandmap['^full console$']	    = this.fullConsole;
}

// add a function to show a notepad in split with the console
// the notepad will be a plain-text text area
