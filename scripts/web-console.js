////////////////////////////////////////////////////////////////
// Project Web Console                                        //
// Copyright 2016 by Hristo Iankov        All Rights Reserved //
// This file is part of a larger project, please keep the     //
// files together.                                            //
////////////////////////////////////////////////////////////////


// attach this library onto a div and activate the div to function as
// a console.
//
// ----------------------------------
// interface
// ----------------------------------
//
// the console div will contain two types of elements:
// - input line
// - output line
//
// The input line will represent input into the console before
// an [enter] was pressed.  The output lines will represent the
// response to an input line.
//
// Each line will be executed with the exec(); command and will
// contain local scope.
//
// ----------------------------------
// interface (styles)
// ----------------------------------
// .console
// .console-line
// .input-line
// .output-line
// .input-div
// .input-symbol
// .input-box
//
// ----------------------------------
// libraries
// ----------------------------------
// additional libraries will be attached at the start
// these will provide convenience functions in order to ease
// the console use.
//

function WebConsole(formSelector) {
	WebConsole.instance = this;
	if($(formSelector).length <= 0) {return;}
	// constructor
	var me = this;
	this.formSelector = formSelector;
	this.$form = $(formSelector);
	this.commandlibraries = [];
	// this.$inputdiv - defined below
	// this.$inputbox - defined below
	
	// methods
	this.generateInterface = function() {
		// clear all contents from the container
		this.$form.html("");
		
		// add .console css class to form
		this.$form.addClass("console");
		// create the input box
		this.$inputdiv = $("<div>", {class:"input-div"});
		this.$inputbox = $("<div>", {class:"input-box", contentEditable:"true"});
		this.$inputsymbol = $("<div>", {class:"input-symbol"});
		this.$inputsymbol.append(">&nbsp;");
		this.$inputdiv.append(this.$inputsymbol);
		this.$inputdiv.append(this.$inputbox);
		this.$form.append(this.$inputdiv);
		this.revertCount = 0; // + backward, - forward
		
		// set up event handlers for input box
		this.$inputbox.keypress(function(e) {
			switch(e.which) {
				case 13: // enter key
					me.executeInputLine();
					me.revertCount = 0;
					e.preventDefault();
					break;
			}
		});
		this.$inputbox.keyup(function(e) {
			// need to use this for non printable characters
			switch(e.which) {
				case 38: // up arrow
					me.revertCommand(me.revertCount);
					me.revertCount += 1;
					break;
				case 40: // down arrow
					me.revertCommand(me.revertCount);
					me.revertCount -= 1;
					if(me.revertCount < 0) {me.revertCount = 0;}
					break;
			}
		});
		this.$inputbox.on('paste', function (e) {
			//e.preventDefault();
			setTimeout(function() {
				me.$inputbox.html(me.$inputbox.text());
			});
		});
		this.$form.click(function(e) {
			me.$inputbox.focus();
		});
		
		// set focus onto input box
		this.$inputbox.focus();
	};
	
	this.revertCommand = function(revertCount) {
		// revert to the last x command
		var $elements = this.$form.find(".input-line");
		
		// determine the index based on revert count
		var index = $elements.size() - 1 - revertCount;
		if(index < 0) {index = 0;}
		else if(index > $elements.size() - 1) {index = $elements.size() - 1;}
		
		var lastelement = $elements[index];
		var lastcommand = $(lastelement).text();
		// remove '> ' prefix
		lastcommand = lastcommand.substring(2);
		this.$inputbox.text(lastcommand);
	};
	
	this.moveInputBoxToBottom = function() {
		// move the input box to bottom
		this.$inputdiv.detach();
		var $lastchild = this.$form.find(".console-line").last();
		$lastchild.after(this.$inputdiv);
		// set focus onto input box
		this.$inputbox.focus();
	};
	
	this.executeInputLine = function() {
		// execute the current line in the console input box
		// write the query to console
		// write the result to console
		// clear input box
		var text = this.$inputbox.text();
		this.writeConsole(text, true);
		this.$inputbox.empty();
		
		// attempt to match against attached libraries
		var response = this.executeAgainstLibraries(text);
		
		// if no match against libraries, then execute in console
		if(response == -1) {response = me.executeLine(text);}
		
		// write the response out to the console
		if(response) { this.writeConsole(response, false);}
	}
	
	this.executeAgainstLibraries = function(text) {
		// traverse each library
		for(var libraryIndex in WebConsole.libraries) {
			var library = WebConsole.libraries[libraryIndex];
			if(!typeof library.definition === "object") {
				me.print("The library: " + library.name + 
				" has an invalid library.definition defined.");
				continue;
			}
			for(var commandIndex in library.definition.commands) {
				var command = library.definition.commands[commandIndex];
				if(command.pattern && new RegExp(command.pattern).test(text)
					&& typeof command.action === "function") {
					return command.action(text);
				}
			}
		}
		return -1;
	}
	
	this.executeLine = function(text) {
		// execute the given text
		// return the result of the execution
		try {
			return eval(text);
		} catch(error) {
			return error.message;
		}
	};
	
	this.writeConsole = function(text, isInputLine) {
		// write output or input to the console interface
		// outputclass defines the type of console line
		// is being written: .output-line or .input-line
		text = this.conformText(text);
		var outputline = "";
		if(isInputLine) {
			outputline = "<div class='input-line console-line'>> " + text + "</div>";
		} else {
			outputline = "<div class='output-line console-line'>" + text + "</div>";
		}
		this.$form.append(outputline);
		this.moveInputBoxToBottom();
	};
	
	this.conformText = function(text) {
		text = text + "";
        text = text.replace(/ /g, "&nbsp;");
        text = text.replace(/\n/g, "<br>");
        text = text.replace(/^$/g, "&nbsp;");
		return text;
	}
	
	this.print = function(text) {
		this.writeConsole(text, false);
		return "";
	}
	
	function print(text) {
		me.print(text);
	}
	
	// constructor call
	this.generateInterface();
}
WebConsole.libraries = [];

/**
 * Add a library globally to WebConsole.
 * 
 * This function should make checks to determine if the
 * provided library is valid and display feedback if
 * there is something missing from the library.
 *
 **/ 
WebConsole.addLibrary = function(library) {
	if(!WebConsole.libraries) {
		WebConsole.libraries = [];
	}
	if(!library.definition) {
		this.print("Unable to add library: No library.definition defined.");
		return;
	}
	WebConsole.libraries.push(library);
}

// -------------------------------------
// End-User Functions/library
// -------------------------------------
// some library functions can be defined
// outside of the library class in order
// to be accessible globally as js
// functions.
function HelpLibrary() {
	var me = this;
	var helpWidth = 54;
	var leftColumnWidth = 24;
	
	this.createHelpString = function() {
		return me.createHeader("Help") 
			+ me.createLine("This is a real-time interactive JavaScript console")
			+ me.createAllLibraryDialogs(WebConsole.libraries)
			+ me.createHeader();
	}
	
	// print a help header
	this.createHeader = function(text) {
		if(!text)
			return "|" + Array(helpWidth - 2 + 1).join("-") + "|\n";
		var dashes = helpWidth - text.length - 2;
		return "|" + Array(Math.floor(dashes/2)).join("-")
			+ " " + text + " " + Array(Math.floor(dashes/2)).join("-") 
			+ (dashes % 2 == 0 ? "" : "-") + "|\n";
	}
	
	// print text across the entire width
	this.createLine = function(text) {
		if(!text)
			return "|" + Array(helpWidth - 2 + 1).join(" ") + "|\n";
		var textList = text ? text.match(new RegExp('.{1,' + (helpWidth - 4) + '}', 'g')) : null;
		var lines = "";
		while(textList.length > 0) {
			var textVal = textList.shift();
			lines += "| " + textVal 
				+ Array(helpWidth - textVal.length - 3).join(" ")
				+ " |\n";
		}
		return lines;
	}
	
	// print text across two columns
	this.createSplitLine = function(col1, col2) {
		if(!col2)
			return this.createLine(col1);
		else if(!col1)
			return this.createLine(col2);
		var col1list = col1 ? col1.match(new RegExp('.{1,' + (leftColumnWidth - 4) + '}', 'g')) : null;
		var col2list = col2 ? col2.match(new RegExp('.{1,' + (helpWidth - leftColumnWidth - 3) + '}', 'g')) : null;
		var lines = "";
		while(col1list.length > 0 || col2list.length > 0) {
			var col1text = col1list.length > 0 ? col1list.shift() : "";
			var col2text = col2list.length > 0 ? col2list.shift() : "";
			lines += "| " + col1text 
				+ Array(leftColumnWidth - col1text.length - 4 + 1).join(" ")
				+ " - " + col2text
				+ Array(helpWidth - leftColumnWidth - col2text.length - 2).join(" ") + " |\n";
		}
		return lines;
	}
	
	this.createAllLibraryDialogs = function(libraries) {
		var dialogs = "";
		for (var libraryIndex in libraries) {
			var library = libraries[libraryIndex];
			dialogs += me.createLibraryDialog(library);
		}
		return dialogs;
	}
	this.createLibraryDialog = function(library) {
		var dialog = me.createLine() 
			+ me.createHeader(library.definition.name);
		for(var commandIndex in library.definition.commands) {
			var command = library.definition.commands[commandIndex];
			if(command.signiture && command.description) {
				dialog += me.createSplitLine(command.signiture, command.description);
			}
		}
		return dialog;
	}
	
	this.definition = {
		name: "Basic",
		commands: [
			{
				pattern: "^help$",
				action: me.createHelpString,
				signiture: null,
				description: null},
			{
				pattern: null, 
				action: null, 
				signiture: "print(text)",
				description: "print text to the console"}
		]
	};
}
WebConsole.addLibrary(new HelpLibrary());








