
ZICA = {
	version:'0.1',
	author: 'Zeljko Ivanovic'
};

ZICA.boxIntersection = function (a, b) {
    return (a.x < b.x + b.width && a.x + a.width > b.x) && (a.y < b.y + b.height && a.y + a.height > b.y);
};

/** 
 * Returns a new value which is clamped between low and high. 
 */
ZICA.clamp = function(n, low, high)
{
	if (n < low)
		return low;
		
	if (n > high)
		return high;
		
	return n;
}

ZICA.Keys = ["Left Mouse Button", "Right Mouse Button", "Escape", "Enter", "Tab", "Shift", "Control", "Space", "Left", "Up", "Right", "Down", "Delete", "App Menu Key", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

var State;(function (State) {State[State["stopped"] = 1] = "stopped";State[State["running"] = 2] = "running"; State[State["paused"] = 3] = "paused";})(State || (State = {}));
ZICA.State = State;

/**
ZICA.Vect2d, ZICA.Animator & ZICA.Action (and their extends) are modified classes from the copperlitch open source library
https://github.com/Sebmaster/copperlicht
https://www.ambiera.com/copperlicht/

CopperLicht License
Copyright © 2009-2020 Nikolaus Gebhardt

This software is provided 'as-is', without any express or implied warranty. In no event will the authors be held liable for any damages arising from the use of this software.

Permission is granted to anyone to use this software for any purpose, including commercial applications, and to alter it subject to the following restrictions:

If you use this software in a product, an acknowledgment in the product documentation is necessary.
Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
This notice may not be removed or altered from any source distribution.
*/


// START OF THE mltext.js LIBRARY
// Library: mllib.js
// Desciption: Extends the CanvasRenderingContext2D that adds two functions: mlFillText and mlStrokeText.
//
// The prototypes are:
//
// function mlFillText(text,x,y,w,h,vAlign,hAlign,lineheight);
// function mlStrokeText(text,x,y,w,h,vAlign,hAlign,lineheight);
//
// Where vAlign can be: "top", "center" or "button"
// And hAlign can be: "left", "center", "right" or "justify"
// Author: Jordi Baylina. (baylina at uniclau.com)
// License: GPL
// Date: 2013-02-21

function mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, fn) {

    // The objective of this part of the code is to generate an array of words. 
    // There will be a special word called '\n' that indicates a separation of paragraphs.
    text = String(text);
	text = text.replace(/\r/g, '');
    var words = [];
    var inLines = text.split('\n');
    var i;
    for (i=0; i < inLines.length; i++)
    {
    	if (i) words.push('\n');
    	words = words.concat( inLines[i].split(' ') );
    }
    // words now contains the array.


    // Next objective is generate an array of lines where each line has a property 
    // called Words with all the words that fits in the line. Each word contains 2 fields:
    // .word for the actual word and .l for the length o the word.
    // If the line is the last line of a paragraps, the property EndOfParagraph will be true
    var sp = this.measureText(' ').width;
    var lines = [];
    var actualline = 0;
    var actualsize = 0;
    var wo;
    lines[actualline] = {};
    lines[actualline].Words = [];
    i = 0;
    while (i < words.length) {
        var word = words[i];
        if (word == "\n") {
            lines[actualline].EndParagraph = true;
            actualline++;
            actualsize = 0;
            lines[actualline] = {};
            lines[actualline].Words = [];
            i++;
        } else {
            wo = {};
            wo.l = this.measureText(word).width;
            if (actualsize === 0) {

                // If the word does not fit in one line, we split the word
                while (wo.l > w) {
                    word = word.slice(0, word.length - 1);
                    wo.l = this.measureText(word).width;
                }

                wo.word = word;
                lines[actualline].Words.push(wo);
                actualsize = wo.l;
                if (word != words[i]) {
                    // if a single letter does not fit in one line, just return without painting nothing.
                    if (word === "") return;
                    words[i] = words[i].slice(word.length, words[i].length);
                } else {
                    i++;
                }
            } else {
                if (actualsize + sp + wo.l > w) {
                    lines[actualline].EndParagraph = false;
                    actualline++;
                    actualsize = 0;
                    lines[actualline] = {};
                    lines[actualline].Words = [];
                } else {
                    wo.word = word;
                    lines[actualline].Words.push(wo);
                    actualsize += sp + wo.l;
                    i++;
                }
            }
        }
    }
    if (actualsize === 0) lines.pop(); // We remove the last line if we have not added any thing here.

    // The last line will be allways the last line of a paragraph even if it does not end with a  /n
    if(lines[actualline])
	lines[actualline].EndParagraph = true;


    // Now we remove any line that does not fit in the heigth.
    var totalH = lineheight * lines.length;
    while (totalH > h) {
        lines.pop();
        totalH = lineheight * lines.length;
    }

    // Now we calculete where we start draw the text.
    var yy;
    if (vAlign == "bottom") {
        yy = y + h - totalH + lineheight;
    } else if (vAlign == "center") {
        yy = y + h / 2 - totalH / 2 + lineheight;
    } else {
        yy = y + lineheight;
    }

    var oldTextAlign = this.textAlign;
    this.textAlign = "left"; // we will draw word by word.

	var maxWidth = 0;
    for (var li in lines) {
    	if (!lines.hasOwnProperty(li)) continue;
        var totallen = 0;
        var xx, usp;


        for (wo in lines[li].Words) {
            if (!lines[li].Words.hasOwnProperty(wo)) continue;
            totallen += lines[li].Words[wo].l;
        }
        // Here we calculate the x position and the distance betwen words in pixels 
        if (hAlign == "center") {
            usp = sp;
            xx = x + w / 2 - (totallen + sp * (lines[li].Words.length - 1)) / 2;
        } else if ((hAlign == "justify") && (!lines[li].EndParagraph)) {
            xx = x;
            usp = (w - totallen) / (lines[li].Words.length - 1);
        } else if (hAlign == "right") {
            xx = x + w - (totallen + sp * (lines[li].Words.length - 1));
            usp = sp;
        } else { // left
            xx = x;
            usp = sp;
        }
        for (wo in lines[li].Words) {
	    	if (!lines[li].Words.hasOwnProperty(wo)) continue;
            if (fn == "strokeText" || fn=="fillStrokeText") {
                this.strokeText(lines[li].Words[wo].word, xx, yy);
            }
            if (fn == "fillText" || fn=="fillStrokeText") {
                this.fillText(lines[li].Words[wo].word, xx, yy);
            }
            xx += lines[li].Words[wo].l + usp;
        }
        maxWidth = Math.max(maxWidth, xx);
        yy += lineheight;
    }
    this.textAlign = oldTextAlign;

    return {
    	width: maxWidth,
    	height: totalH,
    };
}

(function mlInit() {
    CanvasRenderingContext2D.prototype.mlFunction = mlFunction;

    CanvasRenderingContext2D.prototype.mlFillText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
        return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "fillText");
    };

    CanvasRenderingContext2D.prototype.mlStrokeText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
        return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "strokeText");
    };

    CanvasRenderingContext2D.prototype.mlFillStrokeText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
        return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "fillStrokeText");
    };

})();

// for touch devices
var touchToMouse = function(event) {
    if (event.touches.length > 1) return; //allow default multi-touch gestures to work
    var touch = event.changedTouches[0];
    var type = "";
    
    switch (event.type) {
    case "touchstart": 
        type = "mousedown"; break;
    case "touchmove":  
        type="mousemove";   break;
    case "touchend":   
        type="mouseup";     break;
    default: 
        return;
    }
    
    // https://developer.mozilla.org/en/DOM/event.initMouseEvent for API
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
            touch.screenX, touch.screenY, 
            touch.clientX, touch.clientY, false, 
            false, false, false, 0, null);
    
	//event.preventDefault();
    touch.target.dispatchEvent(simulatedEvent);
    
};
//document.ontouchstart = touchToMouse;
//document.ontouchmove = touchToMouse;
//document.ontouchend = touchToMouse;