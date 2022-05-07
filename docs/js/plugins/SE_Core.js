"use strict";
/*:
 * @plugindesc v1.10 - Core script.
 * @author Squirting Elephant
 * @help
 * Load this plugin before any other plugins that requires this plugin.
 * If you use SE_Keys.js, please uninstall it because this plugin already includes it.
 * 
 * License:
 * For the license and/or terms see: http://forums.rpgmakerweb.com/index.php?/topic/51307-silvers-advanced-minimap-now-with-fog-of-war/&page=1
 * They are subject to change.
 * 
 * Compatibility:
 * Creates the following globals:
 * SE, EMPTY_STR, SINGLE_SPACE, SE_Reporter.
 * 
 *--------------------------------------
 * #Version History:
 *--------------------------------------
 * v1.10 (?? April 2020)
 *  - Added window sliding.
 *  - Added AddAlias.
 *  - Added methods for checking if file exists.
 *  - Added methods for checking if project is deployed or not.
 * 
 * v1.01 (08 April 2020)
 * - Bugfix: Defined the Imported variable.
 * - Now initialized SE.Params.
 * 
 * v1.00 (14 February 2020)
 * - Initial version.
 */

var Imported = Imported || {};
Imported.SE_Core = { name: "SE_Core", version: 1.10, author: "Squirting Elephant", date:"2020-??-??"};

var SE = SE || {};
SE.Core = SE.Core || {};
SE.Alias = SE.Alias || {}; // Contains all of the aliases.
SE.Params = SE.Params || {};

/*╔════════════╗
  ║ #Constants ║
  ╚════════════╝*/
const EMPTY_STR = "";
const SINGLE_SPACE = " ";

/*╔════════════╗
  ║ #Utilities ║
  ╚════════════╝*/
SE.Alias.Core = SE.Alias.Core || {};
// Example usage:
// SE.Core.AddAlias('mm_Game_Screen_updateFadeOut', Game_Screen.prototype.updateFadeOut);
SE.Core.AddAlias = function(alias, original_method)
{
	if (SE.Alias.Core[alias]) { throw new Error("Alias in SE.Alias.Core already exists for: " + alias); }
	SE.Alias.Core[alias] = original_method;
};

// Returns true if the game is NOT deployed; otherwise returns false.
SE.Core.IsDevEnv = function() { return Utils.isNwjs() && Utils.isOptionValid("test"); };

// Returns true if the game is deployed; otherwise returns false.
SE.Core.IsDeployed = function() { return !SE.Core.IsDevEnv(); };

/*╔═════╗
  ║ #IO ║
  ╚═════╝*/

SE.Core.fs = require("fs");

// Example usage: SE.Core.projectImageExists("system", "Window");
// imageFilename is w/o extension. Images must be png.
SE.Core.projectImageExists = function(imageFolderName, imageFilename)
{
	return this.projectfileExists("img/" + imageFolderName, imageFilename + ".png");
};

// Checks if the project-file exists both pre- and post deployment.
// filename must include the file extension.
SE.Core.projectfileExists = function(filePath, filename)
{
	return this.fs.existsSync(this.maybeDeployedPath(filePath + "/" + filename));
};

// Adds "www/" to the filepath if the project is deployed.
SE.Core.maybeDeployedPath = function(filePath)
{
	return this.IsDeployed() ? "www/" + filePath : filePath;
};

/* ╔═══════════════════════════════════════════════════════════════════════════════════════╗
 * ║ Reporter class used for logging messages. Example usage:                              ║
 * ║ SE.MyPlugin.Rep = new SE_Reporter(SE.Minimap.DebugMode, SE.Minimap.SuppressWarnings); ║
 * ║ SE.MyPlugin.Rep.logWarning("my warning text");                                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════╝*/
class SE_Reporter
{
    constructor(isDebug, suppressWarnings)
    {
        this.log = console.log.bind(window.console);
        this.logWarning = suppressWarnings ? function(){} : console.log.bind(window.console, "Warning:");
        this.logError = console.log.bind(window.console, "Error:");
        this.logDebug = isDebug ? console.log.bind(window.console, "Debug:") : function(){};
    }
};
/* ╔═══════════════════════════════════════════════════════════════════════════════════════
 * ║ Parse Parameters. Note that this function was not developed by me but I have permission.
 * ║ Parses most of the parameters to their primitive types. Example usage:
 * ║ for (let key in SE.Params.Minimap) { SE.Params.Minimap[key] = SE.Params.Minimap[key].replace("\r", ""); } // Because: fix stupid RMMV bug (https://forums.rpgmakerweb.com/index.php?threads/parameter-string-does-not-equal-string.113697/)
 * ║ SE.Params.Minimap = SE.parseParameters(JSON.stringify(SE.Params.Minimap));
 * ╚═══════════════════════════════════════════════════════════════════════════════════════*/
// (function()
// {
    SE.parseParameters = function(string)
    {
        try
        {
            return JSON.parse(string, (key, value) => {
                try { return SE.parseParameters(value); }
                catch (e) { return value; }
            });
        } catch (e) { return string; }
    };
// })();
/* ═════════════════════════════════════════════════════════════════════════════════════════
 * Keybinding.
 * This Key-Mapper is for plugin-developers and for other plugins.
 *
 * Example usage:
 * var myKey = SE.Keys.fromStringParam('pageup');
 * SE.Minimap.ScrollKey = SE.Keys.fromStringParam(SE.Parameters['home']);
 * Note: string-value is NOT case-sensitive
 
 * Example usage 2 (press home-key and watch console window):
 * 
 * var myKey = SE.Keys.fromStringParam('home');
 * 
 *  (function()
 *  {	
 *   var test2 = Input.update;
 *   Input.update = function()
 *   {
 *     test2.call(this);
 *     if (Input.isPressed(myKey)){ console.log('PRESSED!, key used: ' + myKey); }
 *   }
 *  })();
 * ═════════════════════════════════════════════════════════════════════════════════════════*/
SE.Keys = {}

// Key Mapping:
SE.Keys.MappingInv =
{
	'':-1,
	'none':-1,
	
	'backspace':8,
	'tab':9,
	'enter':13,
	'shift':16,
	'control':17,
	'alt':18,
	'pause':19,
	'capslock':20,
	'escape':27,
	'space':32,
	'pageup':33,
	'pagedown':34,
	'end':35,
	'home':36,
	'left':37,
	'up':38,
	'right':39,
	'down':40,
	'insert':45,
	'delete':46,
	
	'0':48,
	'1':49,
	'2':50,
	'3':51,
	'4':52,
	'5':53,
	'6':54,
	'7':55,
	'8':56,
	'9':57,
	
	'a':65,
	'b':66,
	'c':67,
	'd':68,
	'e':69,
	'f':70,
	'g':71,
	'h':72,
	'i':73,
	'j':74,
	'k':75,
	'l':76,
	'm':77,
	'n':78,
	'o':79,
	'p':80,
	'q':81,
	'r':82,
	's':83,
	't':84,
	'u':85,
	'v':86,
	'w':87,
	'x':88,
	'y':89,
	'z':90,
	
	'windows_left':91,
	'windows_right':92,
	'media':93,
	
	'numpad0':96,
	'numpad1':97,
	'numpad2':98,
	'numpad3':99,
	'numpad4':100,
	'numpad5':101,
	'numpad6':102,
	'numpad7':103,
	'numpad8':104,
	'numpad9':105,
	
	'*':106,
	'+':107,
	'-':109, // same as 189
	'.':110,
	'/':111,
	
	'f1':112,
	'f2':113,
	'f3':114,
	'f4':115,
	'f5':116,
	'f6':117,
	'f7':118,
	'f8':119,
	'f19':120,
	'f10':121,
	'f11':122,
	'f12':123,
	
	'numlock':144,
	'num_lock':144,
	'scrolllock':145,
	'scroll_lock':145,
	';':186,
	'semicolon':186,
	'semi_colon':186,
	'=':187,
	'equal':187,
	'equal_sign':187,
	',':188,
	'comma':188,
	//'-':189, // duplicate of 109
	'.':190,
	'dot':190,
	'decimal':190,
	'decimal_point':190,
	'decimal_dot':190,
	'/':191,
	'forwardslash':191,
	'forward_slash':191,
	'grave_accent':192,
	'graveaccent':192,
	'[':219,
	'openbracket':219,
	'open_bracket':219,
	'backslash':220,
	']':221,
	'closebracket':221,
	'close_bracket':221,
	'single_quote':222
};

SE.Keys.fromStringParam = function(key_str)
{
	// The removal of hidden control characters MUST be performaned because RMMV still bugs after so many years. See: https://forums.rpgmakerweb.com/index.php?threads/parameter-string-does-not-equal-string.113697/
	key_str = key_str.replace('\r', '').toLowerCase();

	var keyCode = SE.Keys.MappingInv[key_str];
	if (keyCode === undefined) { throw 'No key found for: ' + key_str; }
	if (Input.keyMapper[keyCode] === undefined) { Input.keyMapper[keyCode] = key_str; }
	return Input.keyMapper[keyCode];
}

/*╔══════════════╗
  ║ #Window_Base ║
  ║ For #Sliding ║ 
  ╚══════════════╝*/
Window_Base.prototype.se_SlidingEnabled = function() { return false; };
Window_Base.prototype.se_SlideInDestination = function() { return new Point(0,0); };
Window_Base.prototype.se_SlideOutDestination = function() { return new Point(0,0); };
Window_Base.prototype.se_SlideInSpeed = function() { return new Point(10, 10); };
Window_Base.prototype.se_SlideOutSpeed = function() { return new Point(10, 10); };
Window_Base.prototype.se_OnFinishSliding = function() {};
Window_Base.prototype.se_OnFinishSlidingOut = function() { this.se_OnFinishSliding(); };
Window_Base.prototype.se_OnFinishSlidingIn = function() { this.se_OnFinishSliding(); };
Window_Base.prototype.se_HasReachedSlideDestination = function(destination) { return this.x === destination.x && this.y === destination.y; };

// Moves towards the destination x & y by the speed x & y. If it overshoots the destination, it'll adjust.
// Note: the destination and speed parameters are typeof Point. The speed parameter should have positive x & y.
Window_Base.prototype.se_UpdateMoveTo = function(destination, speed)
{
	// Direction (1 or -1).
	const direction = new Point(destination.x > this.x ? 1 : -1,
							 	destination.y > this.y ? 1 : -1);
	const direction_X = direction.x > 0 ? Math.min : Math.max;
	const direction_Y = direction.y > 0 ? Math.min : Math.max;

	this.x = direction_X(destination.x, this.x + (Math.abs(speed.x) * direction.x));
	this.y = direction_Y(destination.y, this.y + (Math.abs(speed.y) * direction.y));

	return this.se_HasReachedSlideDestination(destination);
};

// Slides this window out.
Window_Base.prototype.se_UpdateSlideOut = function()
{
	if (this._closing)
	{
		const finishedSliding = this.se_UpdateMoveTo(this.se_SlideOutDestination(), this.se_SlideOutSpeed());
		if (finishedSliding)
		{
			this.se_OnFinishSlidingOut();
			this._closing = false;
		}
	}
};

// Slides this window in.
Window_Base.prototype.se_UpdateSlideIn = function()
{
	if (this._opening)
	{
		const finishedSliding = this.se_UpdateMoveTo(this.se_SlideInDestination(), this.se_SlideInSpeed());
		if (finishedSliding)
		{
			this.se_OnFinishSlidingIn();
			this._opening = false;
		}
	}
};

SE.Core.AddAlias('Window_Base_initialize', Window_Base.prototype.initialize);
Window_Base.prototype.initialize = function()
{
	SE.Alias.Core.Window_Base_initialize.apply(this, arguments);
	if (this.se_SlidingEnabled()) { this.se_SetInitialSlidingLocation(); }
};

Window_Base.prototype.se_SetInitialSlidingLocation = function()
{
	this.x = this.se_SlideOutDestination().x;
	this.y = this.se_SlideOutDestination().y;
};

SE.Core.AddAlias('Window_Message_updatePlacement', Window_Message.prototype.updatePlacement);
Window_Message.prototype.updatePlacement = function()
{
	SE.Alias.Core.Window_Message_updatePlacement.apply(this, arguments);
	if (this.se_SlidingEnabled()) { this.se_SetInitialSlidingLocation(); }
};

SE.Core.AddAlias('Window_Base_isOpen', Window_Base.prototype.isOpen);
Window_Base.prototype.isOpen = function()
{
	return (this.se_SlidingEnabled()) ? this.se_HasReachedSlideDestination(this.se_SlideInDestination()) : SE.Alias.Core.Window_Base_isOpen.apply(this, arguments);
};

SE.Core.AddAlias('Window_Base_isClosed', Window_Base.prototype.isClosed);
Window_Base.prototype.isClosed = function()
{
	return (this.se_SlidingEnabled()) ? this.se_HasReachedSlideDestination(this.se_SlideOutDestination()) : SE.Alias.Core.Window_Base_isClosed.apply(this, arguments);
};

SE.Core.AddAlias("Window_Base_updateClose", Window_Base.prototype.updateClose);
Window_Base.prototype.updateClose = function()
{
	if (this.se_SlidingEnabled())
	{
		if (this._closing) { this.se_UpdateSlideOut(); }
	}
	else
	{
		SE.Alias.Core.Window_Base_updateClose.apply(this, arguments);
	}
};

SE.Core.AddAlias("Window_Base_updateOpen", Window_Base.prototype.updateOpen);
Window_Base.prototype.updateOpen = function()
{
	if (this.se_SlidingEnabled())
	{
		if (this._opening) { this.se_UpdateSlideIn(); }
	}
	else
	{
		SE.Alias.Core.Window_Base_updateOpen.apply(this, arguments);
	}
};

/*╔═════════════╗
  ║ End of File ║
  ╚═════════════╝*/