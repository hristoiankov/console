////////////////////////////////////////////////////////////////
// Project Web Console                                        //
// Copyright 2016 by Hristo Iankov        All Rights Reserved //
// This file is part of a larger project, please keep the     //
// files together.                                            //
////////////////////////////////////////////////////////////////

// TODO: add a 'clear' screen command

function DisplayLibrary() {

	this.darkenDisplay = function() {
		$('*').css("background-color", "black");
		$('*').css("border-color", "black");
		$('*').css("color", "gray");
		return "";
	}
	this.lowerConsole = function() {
		$(WebConsole.instance.formSelector).css("height", "50px");
		return "";
	}
	this.standardConsole = function() {
		$(WebConsole.instance.formSelector).css("height", "200px");
		return "";
	}
	this.fullConsole = function() {
		$(WebConsole.instance.formSelector).css("height", "100%");
		$(WebConsole.instance.formSelector).css("z-index", "100");
		$(WebConsole.instance.formSelector).hide();
		return "";
	}
	this.clearConsole = function() {
		if(WebConsole.instance) {
			WebConsole.instance.generateInterface();
		}
		return "";
	}
	
	this.definition = {
		name: "Display",
		commands: [
			{
				pattern: "^darken display$",
				action: this.darkenDisplay,
				signiture: "darken display",
				description: "darken the display"},
			{
				pattern: "^lower console$",
				action: this.darkenDisplay,
				signiture: "lower console",
				description: "lower the console"},
			{
				pattern: "^standard console$",
				action: this.darkenDisplay,
				signiture: "standard console",
				description: "return console to 200px"},
			{
				pattern: "^full console$",
				action: this.darkenDisplay,
				signiture: "full console",
				description: "fill screen w/ console"},
			{
				pattern: "^clear$",
				action: this.clearConsole,
				signiture: "clear",
				description: "clear the console"}
		]
	};
}
WebConsole.addLibrary(new DisplayLibrary());

// add a function to show a notepad in split with the console
// the notepad will be a plain-text text area
