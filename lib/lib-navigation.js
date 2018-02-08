////////////////////////////////////////////////////////////////
// Project Web Console                                        //
// Copyright 2016 by Hristo Iankov        All Rights Reserved //
// This file is part of a larger project, please keep the     //
// files together.                                            //
////////////////////////////////////////////////////////////////


function NavigationLibrary() {
	// each library will require a function map,
	// the related function definitions, and
	// its auto complete dictionary
	//
	// each function must return output for the
	// resolve of the function/execution.
	//
	// each function must define a section in the
	// help print out. (please keep the margins
	// correct)
	
	var me = this;

	
	this.listDirectory = function(exp) {
		var $links = $("a");
		var output = "";
		$links.each(function() {
			//output += $(this).attr("href") + "\n";
			output += $(this).text() + "\n";
		});
		return output;
	}
	this.changeDirectory = function(exp) {
		var locationName = exp.replace(/^cd /, "");
		var $links = $("a");
		var $link = $links.filter(
			function(){return $(this).text() === locationName;});
		var destination = $link.attr("href");
		window.location.href = destination;
		return destination;
	}
	this.goBack = function(exp) {
		window.history.back();
		return "";
	}
	
	// mandatory help function
	this.getHelp = function() {
		var text = 
		"| ------------------ Navigation -------------------- |\n" +
		"| ls                        - list directory         |\n" +
		"| cd [directory]            - change directory       |\n" +
		"| cd ..                     - go back a directory    |";
		return text;
	};
	
	// define the command map at the end
	this.commandmap = {};
	this.commandmap['^ls$']      	= me.listDirectory;
	this.commandmap['^cd \.\.$'] 	= me.goBack;
	this.commandmap['^cd [^.].*$']	= me.changeDirectory;
	
	/*var library = {
		name: "Navigation"
		commands: [
			{
				pattern: '^ls$', 
				action: me.listDirectory, 
				signiture: "ls", 
				description: "list directory"},
			{
				pattern: '^cd \.\.$', 
				action: me.goBack, 
				signiture: "cd {directory}", 
				description: "change directory"},
			{
				pattern: '^cd [^.].*$', 
				action: me.changeDirectory, 
				signiture: "cd ..", 
				description: "go back a directory"}
		]
	}*/
}