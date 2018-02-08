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

function Console(formSelector) {
	if($(formSelector).length <= 0){return;}
	// constructor
	var me = this;
	this.formSelector = formSelector;
	this.$form = $(formSelector);
	this.commandlibraries = [];
	this.commandlibraries.push(new BasicLibrary(this));
	// this.$inputdiv - defined below
	// this.$inputbox - defined below
	
	// methods
	this.generateInterface = function(formSelector) {
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
		
		// test
		//this.writeConsole("test me now", "output-line");
		/*this.writeConsole("myCommand Now", "input-line");
		this.writeConsole("test me now", "output-line");
		this.writeConsole("test me now", "output-line");
		this.writeConsole("test me now", "output-line");*/
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
		//this.$form.find(":last-child").append(this.$inputdiv);
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
		this.writeConsole(text, "input-line");
		this.$inputbox.empty();
		
		// attempt to match against attached libraries
		var libraryResponse = this.executeAgainstLibraries(text);
		var result = libraryResponse[1];
		
		// if no match against libraries, then execute in console
		if(!libraryResponse[0]) {result = me.executeLine(text);}
		
		// write the response out to the console
		if(result) { this.writeConsole(result, "output-line");}
	}
	
	this.executeAgainstLibraries = function(text) {
		// traverse each library
		for(var i = 0; i < this.commandlibraries.length; i++) {
			var library = this.commandlibraries[i];
			// traverse each command in the library
			for(var key in library.commandmap) {
				var regexp = new RegExp(key);
				if(regexp.test(text)) {
					var callback = library.commandmap[key];
					var response = "Function is not properly defined.";
					if(typeof callback === "function") {
						response = callback(text);
					}
					// return with response
					return [true, response];
				}
			}
		}
		return [false, ""];
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
	
	this.writeConsole = function(text, outputclass) {
		// write output or input to the console interface
		// outputclass defines the type of console line
		// is being written: .output-line or .input-line
		text = this.conformText(text);
		var outputline = "";
		switch(outputclass) {
			case "output-line":
				outputline = "<div class='"+outputclass+" console-line'>"+text+"</div>";
				break;
			case "input-line":
				outputline = "<div class='"+outputclass+" console-line'>> "+text+"</div>";
				break;
			default:
				outputline = "<div class='"+outputclass+" console-line'>"+text+"</div>";
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
		this.writeConsole(text, "output-line");
		return "";
	}
	
	// -------------------------------------
	// Help Functions
	// -------------------------------------
	this.printHelp = function() {
		this.print(",----------------------- Help -----------------------,");
		this.print("| This is a real-time interactive javascript console.|");
		this.print("|                                                    |");
		this.printLibraryHelpDialogs();
		this.print("`----------------------------------------------------`");
	}
	
	this.printLibraryHelpDialogs = function() {
		for(var i = 0; i < this.commandlibraries.length; i++) {
			var library = this.commandlibraries[i];
			this.print(library.getHelp());
		}
	}
	
	// -------------------------------------
	// Public Functions
	// -------------------------------------
	this.addLibrary = function(library) {
		// perform a test to determine if
		// all the required function have
		// been defined.  Including each
		// of the functions in the commandmap
		var errorMessage = "";
		if(!library.commandmap) {
			errorMessage += "No commandmap defined.";}
		if(!typeof library.getHelp === "function") {
			errorMessage += "Invalid or no getHelp function defined.";}
		
		if(errorMessage.length) {
			print("Unable to add library:\n" + errorMessage);
		} else {
			// no problems so add the library
			this.commandlibraries.push(library);
		}
	}
	
	function print(text) {
		me.print(text);
	}
	
	// constructor call
	this.generateInterface(formSelector);
}

// -------------------------------------
// End-User Functions/library
// -------------------------------------
// some library functions can be defined
// outside of the library class in order
// to be accessible globally as js
// functions.
function BasicLibrary(myconsole) {
	this.commandmap = {};
	this.commandmap['^help$'] = help;
	
	this.getHelp = function() {
		text = 
		"| --------------------- Basic ---------------------- |\n" +
		"| print(text)               - print text to console  |";
		return text;
	}
	
	function help() {
		myconsole.printHelp();
	}
}








