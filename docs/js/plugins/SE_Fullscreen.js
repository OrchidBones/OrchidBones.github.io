"use strict";
/*:
╔════════════════╗
║ Plugin Manager ║
╚════════════════╝
 * @plugindesc v1.11 - Starts the game in fullscreen mode.
 * @author Squirting Elephant
  ╔════════════╗
  ║ Parameters ║
  ╚════════════╝
 * @param FullScreenIfTitleSkipped
 * @text Activate Fullscreen if Title Skipped?
 * @desc Also go into fullscreen-mode if the title-screen was skipped?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 * 
   ╔══════╗
   ║ Help ║
   ╚══════╝
 * @help
 * License: Public Domain or CC0.
 * 
 * Optional Plugin(s):
 * SE_SkipTitle (is required if you don't want to go full-screen when you skip the titlescreen).
 *
 * Alias created for:
 * * SceneManager.run()
 * 
 * Version History:
 * v1.11 (04 Oktober 2019)
 * - Fixed a bug with the parameter.
 * 
 * v1.10 (28 September 2019)
 * - Updated this plugin for the latest version of RMMV and SE_Keys.
 * - Changed the names from Silv --> SE.
*/

/*╔═══════════════════════╗
  ║ Plugin Initialization ║
  ╚═══════════════════════╝*/
var Imported = Imported || {};
Imported.SE_Fullscreen = { name: 'SE_Fullscreen', version: 1.11, author: 'Squirting Elephant', date:'2019-09-28'};
var SE = SE || {};

/*╔════════════╗
  ║ Parameters ║
  ╚════════════╝*/
SE.Params = SE.Params || {};
SE.Params.Fullscreen = PluginManager.parameters('SE_Fullscreen');

(function()
{ 
  function parseParameters(string)
  {
    try
    {
      return JSON.parse(string, (key, value) => {
        try { return parseParameters(value); }
        catch (e) { return value; }
        });
    } catch (e) { return string; }
  };

  for (var key in SE.Params.Fullscreen) { SE.Params.Fullscreen[key] = SE.Params.Fullscreen[key].replace('\r', ''); } // Because: fix stupid RMMV bug (https://forums.rpgmakerweb.com/index.php?threads/parameter-string-does-not-equal-string.113697/)
  SE.Params.Fullscreen = parseParameters(JSON.stringify(SE.Params.Fullscreen));


  /*╔═════════════════════════╗
    ║ Alias: SceneManager.run ║
    ╚═════════════════════════╝*/
	var SEA_SceneManager_Run = SceneManager.run;
	SceneManager.run = function(sceneClass)
	{
		SEA_SceneManager_Run.apply(this, arguments);
		if ((Imported.SE_SkipTitle == null) || ((SE.Params.Fullscreen.FullScreenIfTitleSkipped === true) || (SE.Params.SkipTitle.StartScene === 'Scene_Title')))
		{
			Graphics._switchFullScreen();
		}
	};

})();

/*╔═════════════╗
  ║ End of File ║
  ╚═════════════╝*/