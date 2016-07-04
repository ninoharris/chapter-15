var something = document.querySelector("p");
console.log(something);
something.click(function() {
	console.log("it works hazaaaahh");
});

/* TOC.js: create a table of contents for a document
 * 
 * This module registers an anonymous function that runs automatically
 * when the document finishes loading. When it runs, the function first
 * looks for a document element with an id of "TOC". If there is no
 * such element it creates one at the start of the document.

 * Next, the functon finds all <h1> through <h6> tags, treats them as
 * section titles, and creates a table of contents with the TOC
 * element. The function adds section number to each section heading
 * and wraps the heading in named anchors so that the TOC can link to
 * them. The generated anchors have names that begin with "TOC", so
 * you should avoid this in your HTML.

 * The entries in the generated TOC can be styled with CSS. All entries have
 * a class "TOCEntry". Entries also have a class that corresponds to the level
 * of the section heading. <h1> tags generate entries of class "TOCLevel1",
 * <h2> tags generate entries of class "TOCLevel2", and so on. Section numbers
 * inserted into heading have class "TOCSectNum".
 */

// Anonymous function defines a local scope
 window.onload = (function() {

 	// Find if there is a div with an id of "TOC"
 	var toc = document.getElementById("TOC");
 	if(!toc) {
 		toc = document.createElement("div");
 		toc.id = "TOC";
 		document.body.insertBefore(toc, document.body.firstChild);
 	}

 	var headings;
 	// Get headers, either the easy way or the hard way
 	if(document.querySelectorAll) {
 		headings = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
 	} else {

		headings = findHeadings(document.body, []);

 		function findHeadings(root, sect) {
 			for(var i = root.firstChild; i !== null; i = i.nextSibling) {
 				if (i.nodeType == 1) {
 					if ( i.tagName.length == 2 && i.tagName.charAt(0) == "H" )
 						sect.push(i);
 					findHeadings(i, sect);
 				}
 			}
 			return sect;
 		}

 	}

 	var sections = [0,0,0,0,0,0];

 	for (var h = 0; h < headings.length; h++) {
 		var header = headings[h];
 		level = header.tagName.charAt(1);

 		// Skip if directly under document as it looks stupid/excessive
 		if (header.parentNode == document) continue;
 		// Skip if not a read header
 		if(isNaN(level) || parseInt(level) < 1 || parseInt(level) > 6) continue;

 		// Increment section number and reset following dividers (eg 2.3.4 -> 3.0.0)
 		sections[level-1]++;
 		for (var j = level; j < 6; j++) sections[j] = 0;

 		// Trim the fat and make it pretty
 		var sect = sections.slice(0, level).join(".");

 		var por = document.createElement("a");
 		por.id = "POC" + sect;
 		por.href = "#POC" + sect;
 		por.className = "POCNumber";
 		header.parentNode.insertBefore(por, header);
 		por.appendChild(header);

 		var a = document.createElement("a");
 		a.href = "#POC" + sect;
 		a.innerHTML = sect + " " + header.innerHTML;

 		toc.appendChild(a);
 		toc.appendChild(document.createElement("br"));

 	}

 	console.log(headings);
 });

(function() { // create a closure to prevent dirtying up the global namespace
	// return nothing if the function outerHTML() exists

	// Return the outer HTML of the element to the speicified value
	function outerHTMLGetter() {
		var container = document.createElement("div");
		container.appendChild(this.cloneNode(true));
		return container.innerHTML;
	}
	// Set the outer HTML of the this element to the specified value
	function outerHTMLSetter(value) {
		// We can only action on the parent node, so let's refer to that
		var parent = this.parentNode;
		// Create a container to hold all our parsed HTML
		var container = document.createElement("div");
		container.innerHTML = value;
		// Add each child node to the parent element
		while(container.firstChild)
			parent.insertBefore(container.firstChild, this);
		// Delete the previous child nodes
		parent.removeChild(this);
	}

	// Use these two functions are getters and setters for the outerHTML property
	// Use ES5 Object.defineProperty if it exists, otherwise fall ball on
	// __defineGetter__ and __defineSetter__.
	if (Object.defineProperty) {
		Object.defineProperty(Element.prototype, "outeyHTML", 
		{
			get: outerHTMLGetter,
			set: outerHTMLSetter,
			enumerable: false,
			configurable: true
		});

	} else {
		Element.prototype.__defineGetter__("outeyHTML", outerHTMLGetter);
		Element.prototype.__defineSetter__("outeyHTML", outerHTMLSetter);
	}
}());

var replaceHTMLdiv = document.querySelector(".replace-me");
// console.log(replaceHTMLdiv);
replaceHTMLdiv.outeyHTML = "<div class='it works'>This is the replacement (aka it works)</div>"

// Reverse the order of the children of Node n
function reverse(n) {
	var f = document.createElement("div");
	while(n.lastChild) {
		f.appendChild(n.lastChild);
		console.log(f);
	}
	n.appendChild(f);
}

reverse(document.querySelector(".reverse-me"));

// Return the current scrollbar offsets as the x and y properties of an object
function getScrollOffsets(w) {
	// Use the specified window or the current window if no argument
	w = w || window;

	// Default behaviour
	if (w.pageXOffset) return {x: w.pageXOffset, y: w.pageYOffset};

	// For IE (or any other browser) in Standards mode
	var d = w.document;
	if (document.compatMode == "CSS1Compat")
		return { x:d.documentElement.scrollLeft, y:d.document.scrollTop };

	// For browsers in Quirks mode
	return { x: d.body.scrollLeft, y: d.body.scrollTop }

}


// Return the viewport size as w and h properties of an object
function getViewportSize(w) {
	// Use the specified window or the current window if no argument
	w = w || window;

	if (w.innerWidth != null) return {w: w.innerWidth, h: w.innerHeight};

	// For other in standards mode
	var d = w.document;
	if (document.compatMode == "CSS1Compat")
		return { w: d.documentElement.clientWidth, h: d.documentElement.clientHeight};

	// For browsers in Quirks mode
	return { w: d.body.clientWidth, h: d.body.clientHeight};

}

function getElementSize(el) {
	var box = el.getBoundingClientRect();
	return { 
		w: (box.width || (box.right - box.left)),
		h: (box.height || (box.right - box.left))
	};
}

// Scroll to the bottom
function scrollToBottom() {
	var posX = window.pageXOffset;
	var pageHeight = document.body.getBoundingClientRect().width;
	var targetHeight =  pageHeight - window.innerHeight;
	if (targetHeight > 0)
		window.scrollTo(posX, targetHeight);
}

function getElementPosition(el) {
	var x = 0, y = 0;
	while(el != null) {
		x += el.offsetLeft;
		y += el.offsetTop;
		el = el.offsetParent;
	}
	return { x: x, y: y };
}

function getElementPosition2(e) {
	// what you want to do here is add up all the total top and left positions and MINUS all the scrolls.
	// easy to do huh?
	var x = 0;
	var y = 0;

	for ( var elt = e; elt != null; elt = elt.offsetParent ) {
		x += elt.offsetLeft;
		y += elt.offsetTop;
	}

	// Loop again, through all ancestor elements to subtract scroll offsets
	// 
	// This subtracts the main scrollbars, too, *and coverts to ****  viewport coords  ****.
	// 
	// We start with elt = e.offsetParent because we don't want to include the element's inner scroll distances
	for ( var elt = e.offsetParent, i = 0; elt != null && elt.nodeType == 1; elt = elt.offsetParent ) {
		x -= elt.scrollLeft;
		y -= elt.scrollTop;
		console.log("Level: " + i + " of element " + elt + " minuses a vertical of " + elt.scrollTop);
	}

	return { x:x, y:y };
}

var shipping = document.forms.shipping;
// Jibberish vvv
//shipping.onreset = return confirm('Are you sure you want to do this? It means restarting');
//shipping.onsubmit = return confirm('Do you wish to submit all your personal information? We WILL use it against you');


if (document.referrer.indexOf("http://www.google.com/") == 0) {
	var args = document.referrer.substring(document.referrer.indexOf("?")+1).split("&");
	for ( var i = 0; i < args.length; i++ ) {
		if ( args[i].substring(0,2) == "q=") {
			document.write("<p>Welcome Google user.");
			document.write("You searched for " + 
				unescape(args[i].substring(2)).replace('+', " "));
				break;
		}
	}
};

function ElementStream(elt) {
	if ( typeof elt == "string" ) elt = document.getElementById(elt);
	this.elt = elt;
	this.buffer = "";
}
ElementStream.prototype.write = function(/* input of strings */) {
	this.buffer += Array.prototype.join.call(arguments, "");
}
ElementStream.prototype.writeln = function(/* a list of strings */) {
	this.buffer += Array.prototype.join.call(arguments, "") + "\n";
}
ElementStream.prototype.close = function() {
	this.elt.innerHTML = this.buffer;
	this.buffer = "";
}


// Useful for bookmarklets
function getSelectedText() {
	if (window.getSelection) // for HTML5 standard API
		return window.getSelection().toString();
	else if (document.selection) // This is a IE specific implementation
		return document.selection.createRange().text;
}




/* Event handling */
function addEvent(target, type, handler) {
    if (target.addEventListener)
        target.addEventListener(type, handler, false);
    else
        target.attachEvent  ("on" + type,
                            function(event) {
                                // Invoke the handler as a method of target
                                return handler.call(target,event);
                            });
}



















































