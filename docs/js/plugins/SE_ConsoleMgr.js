"use strict";
/*:
╔════════════════╗
║ Plugin Manager ║
╚════════════════╝
 * @plugindesc v1.10 - Console Manager. Enables/Disables the console for playtests/deployments. Is also capable of automatically showing the console.
 * @author Squirting Elephant
   ╔════════════╗
   ║ Parameters ║
   ╚════════════╝
 * @param Playtest
 *
 * @param AutoShowConsole_P
 * @text Automatically Show Console?
 * @parent Playtest
 * @default true
 *
 * @param IsF8ConsoleEnabled_P
 * @text F8 Console Enabled?
 * @parent Playtest
 * @type boolean
 * @on Enabled
 * @off Disabled
 * @default true
 *
 * @param Deployment
 *
 * @param AutoShowConsole_D
 * @text Auto Show Console?
 * @parent Deployment
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @param IsF8ConsoleEnabled_D
 * @text F8 Console Enabled?
 * @parent Deployment
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
   ╔══════╗
   ║ Help ║
   ╚══════╝
 * @help
 * License: Public Domain or CC0.
 * 
 * Aliases created for:
 * * SceneManager.initialize()
 * * SceneManager.onKeyDown()
 *
 * Version History:
 * v1.10 (25 September 2019)
 * - Updated this plugin for the latest version of RMMV.
 *
 * v1.00 (17 February 2016)
 * - First Release.
 *
 */

/*╔═══════════════════════╗
  ║ Plugin Initialization ║
  ╚═══════════════════════╝*/
var Imported = Imported || {};
Imported.SE_ConsoleMgr = { name: 'SE_ConsoleMgr', version: 1.10, author: 'Squirting Elephant', date:'2019-09-25'};

/*╔════════════╗
  ║ Parameters ║
  ╚════════════╝*/
var SE = SE || {};
(function()
{
	SE.Params = SE.Params || {};
	SE.Params.SE_ConsoleMgr = PluginManager.parameters('SE_ConsoleMgr');
	var Params = SE.Params.SE_ConsoleMgr; // Alias for ease of use.

	//General
	Params.AutoShowConsole_P = Params.AutoShowConsole_P.toLowerCase() === 'true';
	Params.ConsoleEnabled_P  = Params.IsF8ConsoleEnabled_P.toLowerCase() === 'true';
	Params.AutoShowConsole_D = Params.AutoShowConsole_D.toLowerCase() === 'true';
	Params.ConsoleEnabled_D  = Params.IsF8ConsoleEnabled_D.toLowerCase() === 'true';
	// Non-Parameters
	SE.TEST                  = Utils.isOptionValid('test');

/*╔══════╗
  ║ Code ║
  ╚══════╝*/
	var SEA_SceneManager_Initialize = SceneManager.initialize;
	SceneManager.initialize = function()
	{
		SEA_SceneManager_Initialize.apply(this, arguments);
		this.initConsole();
	};

	SceneManager.initConsole = function()
	{
		if ((SE.TEST && Params.AutoShowConsole_P) || (!SE.TEST && Params.AutoShowConsole_D)) { SceneManager.showConsole(); }
	};

	var SEA_SceneManager_OnKeyDown = SceneManager.onKeyDown;
	SceneManager.onKeyDown = function(event)
	{
		if (!event.ctrlKey && !event.altKey && (event.keyCode === 119))
		{
			if ((SE.TEST && Params.ConsoleEnabled_P) || (!SE.TEST && Params.ConsoleEnabled_D)) { this.showConsole(); }
		}
		else
		{
			SEA_SceneManager_OnKeyDown.apply(this, arguments);
		}
	};

	SceneManager.showConsole = function()
	{
		require('nw.gui').Window.get().showDevTools();
	};
})();
/*╔═════════════╗
  ║ End of File ║
  ╚═════════════╝*/