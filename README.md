# WebConsole

WebConsole is an idea of a tool that allows users to interact with a website using an embedded console.
The user not only interacts with the website in this way, but can run their own code and manipulate 
the way they see the website themselves.

<link rel="stylesheet" type="text/css" href="https://raw.githubusercontent.com/hristoiankov/console/master/style.css">
<div id="console" style="overflow:hidden;"></div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="https://raw.githubusercontent.com/hristoiankov/console/master/console.js"></script>
<script src="https://raw.githubusercontent.com/hristoiankov/console/master/lib/lib-math.js"></script>
<script src="https://raw.githubusercontent.com/hristoiankov/console/master/lib/lib-navigation.js"></script>
<script src="https://raw.githubusercontent.com/hristoiankov/console/master/lib/lib-display.js"></script>
<script>
	var myconsole = new Console("#console");
	myconsole.addLibrary(new MathLibrary());
	myconsole.addLibrary(new NavigationLibrary());
	myconsole.addLibrary(new DisplayLibrary());
	myconsole.print("Welcome to my website");
</script>