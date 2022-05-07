"use strict";
/*:
╔═══════╗
║ Index ║
╚═══════╝
#Script start
#Version History
#Coding Standards
#Plugin Initialization
#Reporter
#Parameters & Variables
	#Parameter After-care
#Utilities
	#Alias Helper
#mainmenu plugin compatibility
#Fade-out fix
#Spritset Map
#Game Event
#Minimap Window
	#MW - Initialization
	#MW - Set Drawing Bmp's
	#MW - Show & Hide
	#MW - Passability Overlay
	#MW - Map Generation
	#MW - Events
	#MW - Miscellaneous
		#Player Blip Bitmap
	#MW - Updating
	#MW - Player Location
	#MW - Scrolling
	#MW - Window Fading

#Vehicle Compatibility for Player Blip Bitmap
#Menu
	#Menu - Create Menu Bmp
	#Menu - Create Menu Markers
#Left Menu Window
#Fog of War (FoW)
#Rendering & Drawing
#Translate functions
#POI
#Creating the Minimap Window
#Required Items Handling
#Saving & Loading
#Plugin Commands
#Map Menu Scene
#Map Section Window
#Miscellaneous

╔════════════════╗
║ Plugin Manager ║
╚════════════════╝
 * @plugindesc v1.40 - Minimap. Requires plugin "SE_Keys" (place this one below it).
 * @author Squirting Elephant
╔════════════╗
║ Parameters ║
╚════════════╝
   ╔════════════════╗
   ║ Group: General ║
   ╚════════════════╝
 * @param General
 *
 * @param MapStyle
 * @text Map Style
 * @desc Is the minimap scaled to fit? Or does it zoom and scroll?
 * @parent General
 * @type select
 * @option Autofit
 * @option Scroll
 * @default Scroll
 *
 * @param GlobalMapZoom
 * @text Global Map Zoom
 * @desc Only applies if MapStyle is set to: Scroll. Determines the default zoom level for all maps. A value of 1 means a zoom level of 1:1.
 * @parent General
 * @type number
 * @decimals 2
 * @default 0.25
 *
 * @param MinimapOpacity
 * @text Minimap Opacity
 * @desc 0 = invisible, 255 = fully opaque.
 * @parent General
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @param IsVisibleByDefault
 * @text Visible By Default?
 * @desc Will the minimap be visible by default? This applies to each map. If set to false, it will also overrides any plugin commands upon entering a new map.
 * @parent General
 * @type boolean
 * @default true
 *
   ╔═══════════════════════════╗
   ║ Group: Positioning & Size ║
   ╚═══════════════════════════╝
 * @param Positioning & Size
 *
 * @param Window_X
 * @desc x-location of minimap window. If window-alignment is set to Right, this will act as an offset-value instead.
 * @parent Positioning & Size
 * @type number
 * @default 0
 *
 * @param Window_Y
 * @desc y-location of minimap window. If window-alignment is set to Top, this will act as an offset-value instead.
 * @parent Positioning & Size
 * @type number
 * @default 2
 *
 * @param Width
 * @desc Width of the minimap.
 * @parent Positioning & Size
 * @type number
 * @min 0
 * @default 256
 *
 * @param Height
 * @desc Height of the minimap.
 * @parent Positioning & Size
 * @type number
 * @min 0
 * @default 256
 *
 * @param BorderWidth
 * @desc Border width of the minimap.
 * @parent Positioning & Size
 * @type number
 * @min 0
 * @default 12
 *
 * @param BorderHeight
 * @desc Border height of the minimap.
 * @parent Positioning & Size
 * @type number
 * @min 0
 * @default 12
 *
 * @param AlignmentHorizontal
 * @text Horizontal Alignment
 * @parent Positioning & Size
 * @type select
 * @option Left
 * @option Right
 * @default Right
 *
 * @param AlignmentVertical
 * @text Vertical Alignment
 * @parent Positioning & Size
 * @type select
 * @option Top
 * @option Bottom
 * @default Bottom
 * 
   ╔════════════════════╗
   ║ Group: Player Blip ║
   ╚════════════════════╝
 * @param Player Blip
 *
 * @param RenderPlayerBlip
 * @text Render Player Blip
 * @desc Render the player blip in the minimap (=usually the center icon)?
 * @parent Player Blip
 * @type boolean
 * @default true
 *
 * @param PlayerBlipGraphic
 * @text Player Blip Graphic
 * @desc Name of the image (in /img/minimap/) to use as the blip. or use :player to use the realtime-player-graphic.
 * @parent Player Blip
 * @default :player
 *
 * @param PlayerIconWidth
 * @text Player Icon Width
 * @desc The width of the player-blip-icon.
 * @parent Player Blip
 * @type number
 * @min 0
 * @default 16
 *
 * @param PlayerIconHeight
 * @text Player Icon Height
 * @desc The height of the player-blip-icon.
 * @parent Player Blip
 * @type number
 * @min 0
 * @default 16
 *
 * @param PlayerBlinkDelay
 * @text Player Blink Delay
 * @desc Blinks the player icon (in frames). Set to 0 to disable. Does nothing if "Draw Player Icon" is set to false.
 * @parent Player Blip
 * @type number
 * @min 0
 * @default 0
 *
   ╔═════════════════╗
   ║ Group: Vehicles ║
   ╚═════════════════╝
 * @param Vehicles
 *
 * @param ShowVehicles
 * @text Show Vehicles
 * @desc Show the vehicles on the minimap? Note that the parameters below will override this one.
 * @parent Vehicles
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param ShowBoat
 * @text Show Boat
 * @desc Show the boat on the minimap?
 * @parent Vehicles
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param ShowShip
 * @text Show Ship
 * @desc Show the ship on the minimap?
 * @parent Vehicles
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param ShowAirship
 * @text Show Airship
 * @desc Show the airship on the minimap?
 * @parent Vehicles
 * @type boolean
 * @on Show
 * @off Hide
 * @default true
 *
 * @param VehicleRenderWidth
 * @text Vehicle Render Width
 * @desc The width of the vehicles on the minimap.
 * @parent Vehicles
 * @type number
 * @min 0
 * @default 28
 * 
 * @param VehicleRenderHeight
 * @text Vehicle Render Height
 * @desc The height of the vehicles on the minimap.
 * @parent Vehicles
 * @type number
 * @min 0
 * @default 28
 *
 * @param AlwaysShowVehicles
 * @text Always Show Vehicles
 * @desc Set this parameter to true if you use custom vehicles and if you want them shown on the minimap.
 * @parent Vehicles
 * @type boolean
 * @on Show
 * @off Hide
 * @default false
 *
   ╔═════════════╗
   ║ Group: Menu ║
   ╚═════════════╝
 * @param Menu
 *
 * @param MenuKey
 * @text Menu Key
 * @desc The key used to show the map-menu. Use "none" (w/o quotes) to disable. You can find more values in SE_keys.js.
 * @parent Menu
 * @type select
 * @option none
 * @option backspace @option tab @option enter @option shift @option control @option alt @option pause @option capslock @option escape @option space
 * @option pageup @option pagedown @option end @option home @option left @option up @option right @option down @option insert @option delete
 * @option 0 @option 1 @option 2 @option 3 @option 4 @option 5 @option 6 @option 7 @option 8 @option 9
 * @option a @option b @option c @option d @option e @option f @option g @option h @option i @option j @option k @option l @option m @option n
 * @option o @option p @option q @option r @option s @option t @option u @option v @option w @option x @option y @option z
 * @option windows_left @option windows_right @option media
 * @option numpad0 @option numpad1 @option numpad2 @option numpad3 @option numpad4 @option numpad5 @option numpad6 @option numpad7 @option numpad8 @option numpad9
 * @option f1 @option f2 @option f3 @option f4 @option f5 @option f6 @option f7 @option f8 @option f9 @option f10 @option f11 @option f12
 * @default m
 *
 * @param MenuPlayerDescription
 * @text Menu Player Description
 * @desc The description of the player marker in the menu. Spaces are allowed.
 * @parent Menu
 * @default You
 *
 * @param MenuZoom
 * @text Menu Zoom
 * @desc Map Zoomlevel for the menu.  A value of 1 means 1:1.
 * @parent Menu
 * @type number
 * @decimals 2
 * @default 0.3
 *
 * @param MenuLeft_WindowWidth
 * @text Left Menu Window Width
 * @desc Width of the left window.
 * @parent Menu
 * @type number
 * @min 0
 * @default 240
 *
 * @param MenuTopright_WindowHeight
 * @text Topright Menu Window Height
 * @desc Height of the topright window.
 * @parent Menu
 * @type number
 * @min 0
 * @default 510
 *
 * @param Menu_EventRenderSize
 * @text Event Menu Render Size
 * @desc How big the events are that are drawn onto the menu map.
 * @parent Menu
 * @type number
 * @min 0
 * @default 24
 *
 * @param Menu_PlayerIconSize
 * @text Player Menu Icon Size
 * @desc How big the player is drawn onto the menu map.
 * @parent Menu
 * @type number
 * @min 0
 * @default 64
 *
 * @param Menu_MinManualZoom
 * @text Minimum Menu Manual Zoom
 * @desc How far the player can zoom out.
 * @parent Menu
 * @type number
 * @decimals 2
 * @default 0.20
 *
 * @param Menu_MaxManualZoom
 * @text Maximum Menu Manual Zoom
 * @desc How far the player can zoom in
 * @parent Menu
 * @type number
 * @decimals 2
 * @default 10.0
 *
 * @param Menu_ZoominKey
 * @text Menu Zoomin-key
 * @desc Key for zooming in. You can find more values in SE_keys.
 * @parent Menu
 * @type select
 * @option none
 * @option pageup
 * @option pagedown
 * @option +
 * @option -
 * @default pageup
 *
 * @param Menu_ZoomoutKey
 * @text Menu Zoomout Key
 * @desc Key for zooming out. You can find more values in SE_keys.
 * @parent Menu
 * @type select
 * @option none
 * @option pageup
 * @option pagedown
 * @option +
 * @option -
 * @default pagedown
 *
 * @param Menu_ResetZoomKey
 * @text Menu Reset Zoom Key
 * @desc Key for resetting the zoom. You can find more values in SE_keys.
 * @parent Menu
 * @type select
 * @option none
 * @option home
 * @option end
 * @option insert
 * @option delete
 * @default home
 *
 * @param Menu_ResetScrollKey
 * @text Menu Reset Scroll Key
 * @desc Key to reset the mapscroll. You can find more values in SE_keys.
 * @parent Menu
 * @type select
 * @option none
 * @option home
 * @option end
 * @option insert
 * @option delete
 * @default end
 *
   ╔════════════════════════╗
   ║ Group: Passability Map ║
   ╚════════════════════════╝
 * @param Passability Map
 *
 * @param PassabilityOverlayOpacity
 * @text Passability Overlay Opacity
 * @desc 0 = invisible, 255 = fully opaque. 0-255.
 * @parent Passability Map
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param PassabilityColor
 * @text Passability Color
 * @desc Color for walkable tiles in hexadecimal.
 * @parent Passability Map
 * @default #6B8E23
 *
 * @param ImpassabilityColor
 * @text Impassability Color
 * @desc Color for unwalkable tiles in hexadecimal.
 * @parent Passability Map
 * @default #FF0000
 *
   ╔══════════════════════╗
   ║ Group: Map Generator ║
   ╚══════════════════════╝
 * @param Map Generator
 *
 * @param MapGenTagColors
 * @text Map Gen Tag Colors
 * @desc 0-7, use a ####### value to ignore that terrain-tag. Default: lightgreen, blue, brown, darkgreen, lightbrown, wheat.
 * @parent Map Generator
 * @default #6B8E23 #00008B #8B4513 #006400 #F4A460 #F5DEB3 ####### #FFFFFF
 *
 * @param OverworldGenTagColors
 * @text Overworld Gen Tag Colors
 * @desc 0-7, use a ####### value to ignore that terrain-tag. Default: lightgreen, blue, brown, darkgreen, lightbrown, wheat.
 * @parent Map Generator
 * @default #6B8E23 #00008B #8B4513 #006400 #F4A460 #F5DEB3 ####### #FFFFFF
 *
 * @param MapGenRegionColors
 * @text Map Gen Region Colors
 * @desc Use <region_id>:<hex_color> to add a color. Each entry is separated by a space. Note that regions will override tag-colors.
 * @parent Map Generator
 * @default 10:#6B8E23 11:#00008B 12:#8B4513 13:#006400 14:#F4A460
 *
 * @param OverworldGenRegionColors
 * @text Overworld Gen Region Colors
 * @desc Use <region_id>:<hex_color> to add a color. Each entry is separated by a space. Note that regions will override tag-colors.
 * @parent Map Generator
 * @default 10:#6B8E23 11:#00008B 12:#8B4513 13:#006400 14:#F4A460
 *
   ╔══════════════════════╗
   ║ Group: Miscellaneous ║
   ╚══════════════════════╝
 * @param Miscellaneous
 *
 * @param AllowTeleportation
 * @text Allow Teleportation
 * @desc By default, allow teleportation to events/poi's that support it?
 * @parent Miscellaneous
 * @type boolean
 * @on Allow
 * @off Disallow
 * @default true
 *
 * @param StandardPadding
 * @text Standard Padding
 * @desc Standard Window Padding. Best to leave at 0.
 * @parent Miscellaneous
 * @type number
 * @default 0
 *
 * @param WindowSkin
 * @text Window Skin
 * @desc Name of the window skin to use for this window.
 * @parent Miscellaneous
 * @default Window_Minimap
 *
 * @param FillColor
 * @text Fill Color
 * @desc Color to fill the background of the minimap with for 'odd aspect ratios'. Use 0 0 0 0 to disable. R G B A (0-255 each).
 * @parent Miscellaneous
 * @default 0 0 0 255
 *
 * @param MaintainAspectRatio
 * @text Maintain Aspect Ratio
 * @desc Maintains minimap aspect ratio if set to true.
 * @parent Miscellaneous
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param FadeoutSpeed
 * @text Fadeout Speed
 * @desc How fast the minimap fades out.
 * @parent Miscellaneous
 * @type number
 * @default 3
 *
 * @param GlobalRequiredItem
 * @text Global Required Item
 * @desc Item ID of the item that the player must have in their INVENTORY for any map to be displayed. Requires map to be reloaded if item is acquired or call the plugin command "Minimap Refresh" (w/o quotes). A value of 0 disables this.
 * @parent Miscellaneous
 * @type number
 * @min 0
 * @default 0
 *
 * @param EventRenderSize
 * @text Event Render Size
 * @desc How big the events are that are drawn onto the minimap
 * @parent Miscellaneous
 * @type number
 * @min 0
 * @default 16
 *
 * @param AutoClearPOI
 * @text Auto Clear POI
 * @desc Automatically clear POI's between map transfers?
 * @parent Miscellaneous
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @param RenderMinimapOverlay
 * @text Render Minimap Overlay
 * @desc If enabled, add the image: /img/minimap/Overlay.png and it will be drawn on top of the minimap.
 * @parent Miscellaneous
 * @type boolean
 * @on Render
 * @off Don't render
 * @default true
 *
   ╔═══════════════════╗
   ║ Group: Fog of War ║
   ╚═══════════════════╝
 * @param Fog of War
 *
 * @param FoWEnabled
 * @text FoW Enabled
 * @desc Enable Fog of War? Can be overridden on a per-map-basis.
 * @parent Fog of War
 * @type boolean
 * @on Enable
 * @off Disable
 * @default false
 *
 * @param DefaultFoWOverlay
 * @text Default FoW Overlay
 * @desc The default Fog of War (PNG) overlay image name in "<project>/img/minimap/".
 * @parent Fog of War
 * @default FoW
 *
 * @param DefaultFoWRadius
 * @text Default FoW Radius
 * @desc How far into the FoW the player can see.
 * @parent Fog of War
 * @type number
 * @min 0
 * @default 5
 *
   ╔═════════════════════════╗
   ║ Group: Manual Scrolling ║
   ╚═════════════════════════╝
 * @param Manual Scrolling
 *
 * @param AllowManualScrolling
 * @text Allow Manual Scrolling
 * @parent Manual Scrolling
 * @type boolean
 * @on Allow
 * @off Disallow
 * @default true
 *
 * @param ManualScrollspeed
 * @text Manual Scrollspeed
 * @desc How fast the map can be scrolled.
 * @parent Manual Scrolling
 * @type number
 * @min 0
 * @default 24
 *
 * @param ManualScrollKey_Up
 * @text Manual Scroll Key Up
 * @desc Key for scrolling the map upwards. Default: u. You can find more values in SE_keys.
 * @parent Manual Scrolling
 * @default u
 *
 * @param ManualScrollKey_Right
 * @text Manual Scroll Key Right
 * @desc Key for scrolling the map upwards. Default: k. You can find more values in SE_keys.
 * @parent Manual Scrolling
 * @default k
 *
 * @param ManualScrollKey_Down
 * @text Manual Scroll Key Down
 * @desc Key for scrolling the map upwards. Default: j You can find more values in SE_keys.
 * @parent Manual Scrolling
 * @default j
 *
 * @param ManualScrollKey_Left
 * @text Manual Scroll Key Left
 * @desc Key for scrolling the map upwards. Default: h. You can find more values in SE_keys.
 * @parent Manual Scrolling
 * @default h
 *
   ╔═════════════════════════╗
   ║ Group: Advanced & Debug ║
   ╚═════════════════════════╝
 * @param Advanced & Debug
 *
 * @param PlayerSpriteSourceframeWidth
 * @text Player Sprite Sourceframe Width
 * @desc Width of the playersprite sourceframe.
 * @parent Advanced & Debug
 * @type number
 * @min 0
 * @default 48
 *
 * @param PlayerSpriteSourceframeHeight
 * @text Player Sprite Sourceframe Height
 * @desc Heigth of the playersprite sourceframe.
 * @parent Advanced & Debug
 * @type number
 * @min 0
 * @default 48
 *
 * @param FrameSkip
 * @text Frame Skip
 * @desc Skips some minimap calculations&rendering if set to value > 0 to save on performance. The value equals the amount of frames skipped.
 * @parent Advanced & Debug
 * @type number
 * @min 0
 * @default 0
 *
 * @param MapshotFilenameLength
 * @text Mapshot Filename Length
 * @desc Length of the mapshot filenames. A value of 3 would equal to: 001.png, 002.png, 016.png, etc. And a value of 2 would equal: 01.png, etc. A value of 0 disables it.
 * @parent Advanced & Debug
 * @type number
 * @min 0
 * @default 3
 *
 * @param DebugMode
 * @text Debug Mode
 * @desc Prints extra info if set to Enabled (at the cost of a bit of performance).
 * @parent Advanced & Debug
 * @type boolean
 * @on Enabled
 * @off Disabled
 * @default false
 *
 * @param SuppressWarnings
 * @text Suppress Warnings
 * @desc If set to true, will not show warnings from this plugin in the console.
 * @parent Advanced & Debug
 * @type boolean
 * @on Enabled
 * @off Disabled
 * @default false
 *
 * @param RenderDebugGrid
 * @text Render Debug Grid
 * @desc Draws a debug grid. Requires "/img/Minimap/DebugGrid.png" which is 48x48 in size. WARNING: Drains a lot of performance!
 * @parent Advanced & Debug
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @param DebugGridImage
 * @text Debug Grid Image
 * @desc Name of the debug-grid image
 * @parent Advanced & Debug
 * @default DebugGrid01
 *
   ╔══════╗
   ║ Help ║
   ╚══════╝
 * @help
 * License:
 * For the license and/or terms see: http://forums.rpgmakerweb.com/index.php?/topic/51307-silvers-advanced-minimap-now-with-fog-of-war/&page=1
 * They are subject to change.
 *
 * How to use this plugin:
 * 1. Install this script: https://forums.rpgmakerweb.com/index.php?threads/silvers-keybinding.51310/ and make sure to put it above the minimap script.
 * 2. Copy the files to:
 * 3. /img/minimap/Overlay.png
 * 4. /img/minimap/DebugGrid01.png
 * 5. /img/minimap/FoW.png
 * 6. /img/minimap/PlayerBlip.png
 * 7. /img/system/Window_Minimap.png
 * 
 * How to automatically generate regular minimaps:
 * 1. Open the Databse (Press F9) and select "Tilesets". Then click on "Terrain Tag" and assign the proper terrain tags as defined in the parameter "Map Generator" > "MapGenTagColors".
 * 2. Right click on your map in the map explorer and click "Edit..." . In the "Note" field add this code w/o quotes "<mm_generate_map>"
 * 3. Test your game and spawn or teleport the player to that map.
 * 
 * How to use mapshots for realistic maps:
 * 1. Make a mapshot of your map. You may use http://forums.rpgmakerweb.com/index.php?/topic/49711-orange-mapshot/
 * 2. Place your mapshots in the /img/minimap/ directory and rename them 001.png, 002.png etc. (matching the id of your map).
 *
 * Enabling Fog of War:
 * - To enable Fog of War, copy the new FoW.png to the <project>/img/minimap/ folder and set the parameter "FoW Enabled" to true. And make sure that the current map has a minimap of course ;).
 *   FoW also works for generated maps. POI's and Events however will always be displayed on top of the FoW. This is intended.
 *
 *--------------------------------------
 * Yanfly's Main Menu Manager Setup (optional)
 *--------------------------------------
 *
 * Download & Install YEP_MainMenuManager.js
 * 
 * For showing the minimap scene configure the parameters as follow:
 * Menu Name: "Map"
 * Menu Symbol: SEMap
 * Menu Show: true
 * Menu Enabled: SE.Minimap.Menu.Enabled
 * Menu Main Bind: this.commandSEMap.bind(this)
 * 
 * For toggling the minimap visibility (also automatically closes the menu):
 * Menu Name: SE.Minimap.GetMenuToggleText()
 * Menu Symbol: toggleMinimap
 * Menu Show: true
 * Menu Enabled: SE.Minimap.EnabledInMainMenu()
 * Menu Main Bind: SE.Minimap.mainMenuToggleBind.bind(this)
 *
 *--------------------------------------
 * Map notetags (most are case sensitive!)
 *--------------------------------------
 * <mm_req_itm:item_id1 item_id2 etc>
 * Example: <mm_req_itm:1, 2, 3>
 *
 * <mm_mapstyle:Scroll/Autofit>
 * Examples:
 * <mm_mapstyle:Scroll>
 * <mm_mapstyle:AutoFit>
 *
 * <mm_frameskip:value>
 * Example: <mm_frameskip:1>
 * Note: overrides the global frameskip parameter for this map
 *
 * <mm_mapzoom:value>
 * Example: <mm_mapzoom:0.15>
 * Note: overrides the global mapzoom parameter for this map
 *
 * <mm_allowmanualscroll:value>
 * Example: <mm_allowmanualscroll:false>
 * Allowed values: true/false
 * Note: overrides the global "Allow Manual Scrolling" parameter for this map
 *
 * <mm_menuzoom:value>
 * Example: <mm_menuzoom:0.75>
 * Note: overrides the global "Menu Zoom" parameter for this map
 *
 * <mm_size:x y>
 * Example: <mm_size:128 128>
 * Note: overrides the global "Width" and "Height" parameters for this map
 *
 * Allow/disallow teleportation.
 * <mm_tp_allow:value>
 * Example: <mm_tp_allow:false>
 * Note: overrides the global "Allow Teleportation" parameter for this map
 *
 * Generate a worldmap-minimap if there is no image (does increase load-time, the first time, for the map)
 * <mm_generate_worldmap>
 * <mm_generate_overworld>
 *
 * Generate regular map (same as mm_generate_overworld but uses a different parameter-color-generator-tag)
 * <mm_generate_map>
 *
 * Generate and overlay a generated passability-map on top of the minimap
 * <mm_generate_passability_overlay>
 *
 * Change the player-blip
 * <mm_player_blip:value>
 * Example to use the realtime player graphic:
 * <mm_player_blip::player>
 * Example to use a custom blip graphic:
 * <mm_player_blip:myCustomPlayerBlip>
 * Note that in the above example, the game requires the image /img/minimap/myCustomPlayerBlip.png"
 *
 * Use another map's mapshot (handy for duplicate maps)
 * <mm_mapshot:map_id>
 * Example: <mm_mapshot:2>
 * Note: leading zero's are optional but not required.
 *
 * To use a different map-image for the map-menu-scene:
 * <mm_menu_bg:imageName>
 * Example: <mm_menu_bg:myFantasticMap>
 * Note1: Must be in png-format
 * Note2: Must be placed in the same folder that also stores the mapshots
 * Note3: If the size differs from the real mapshot (or generated map) then bad positioning of objects like the player-location may occur. So respect the original size!
 *
 * <mm_fow_enabled:value> // value: true/false
 * Example: <mm_fow_enabled:false>
 * Note: overrides the default "FoW Enabled" parameter
 *
 * <mm_fow_ov:value> // value: name of PNG-image placed in <project>/img/minimap/
 * Example: <mm_fow_enabled:FoW2>
 * Note: overrides the default "Default FoW Overlay" parameter
 *
 * <mm_fow_radius:value> // value is an integer value with a minimum value of 0.
 *
 * <mm_fow_completion:value> // an integer value (positive or negative) that will add/subtract to the total amount of 'explorable' tiles count for the Fog of War. This will only affect the completion % (how many tiles the player revealed for that map).
 *
 *--------------------------------------
 * Event notetags (not case sensitive)
 *--------------------------------------
 * mm_show
 *
 *--------------------------------------
 * Plugin Commands (not case-sensitive)
 *--------------------------------------
 * Minimap Hide
 * Minimap Show
 * Minimap FadeOut
 * Minimap FadeReset
 * Minimap Refresh
 * Minimap RefreshEvents
 * Minimap IncreaseScroll <x> <y>
 * Minimap SetScroll <x> <y>
 * Minimap DeletePOI <poi_id>
 * Minimap Generate_Passability_Overlay <true/false>
 * Minimap Gen_Pass_Ov <true/false>
 * Minimap ShowMapMenu
 * Minimap SetPlayerBlip <filename/:player>
 *
 * Minimap SetFollowTarget <type> <value>
 * Minimap setcamera <type> <value>
 * Allowed types: player, event, coordinate
 * Note: the player-type has no value parameter.
 * Examples:
 * Minimap SetFollowTarget player
 * Minimap SetFollowTarget event 1
 * Minimap SetFollowTarget coordinate 10 20
 *
 * Minimap POIDesc <description>
 * Example: Minimap POIDesc An Awesome City!
 *
 * Minimap POI_TP <poi_id x_offset y_offset direction fadeType>
 * Example: Minimap POI_TP 1 1 0 0 0
 * Note that teleporting with both offsets set to 0, will teleport the player straight into the center of the poi.
 *
 * Vehicles:
 * Minimap RenderVehicle All true/false
 * Minimap RenderVehicle Boat true/false
 * Minimap RenderVehicle Ship true/false
 * Minimap RenderVehicle Airship true/false
 * Minimap RenderVehicle ForceAll true/false       // This plugin-command is for custom vehicles.
 *
 * Adding POI's (advanced plugin command!):
 * Minimap AddPOI unique_poi_id, name, real_x, real_y, bitmap folder, bitmap filename, s_x, s_y, s_w, s_h, draw_w, draw_h
 * Example that draws Actor1_3 on tile 10,10:
 * Minimap AddPOI 1 A_Friend 10 10 img/enemies/ Actor1_3 0 0 254 225 64 64
 * Note:
 * - The real_x & real_y are in maptiles and not in coordinates. 0,0 is in the upper left corner.
 * - name-value replaces underscores _  with spaces.
 *
 * Minimap FoWShowTile x y
 * Minimap FoWHideTile x y
 * Example: Minimap FoWShowTile 10 15
 * Note: no sanity-checks are performed for these 2 plugin commands. So for example: if you show/hide a tile outside of the map boundaries or supply a NaN-value or other weird value for the x&y, it's your problem.
 * 
 * Minimap FoWChangeTiles x1 y1 x2 y2 reveal // reveal: true/false
 * Example to reveal all tiles between 10,10 and 15,15:
 * Minimap FoWChangeTiles 10 10 15 15 true
 *
 * Minimap FoWRevealTiles x1, y1, x2, y2
 * Minimap FoWHideTiles x1, y1, x2, y2
 * Minimap FoWRevealAll
 *
 * To fully cover the map again in FoW:
 * Minimap FoWReset value // value is optional and defaults to true. value: true/false. When the value is set to false, the minimap won't remove the FoW around the player immediately after this plugin command.
 * Minimap FoWHideAll     // is same as "Minimap FoWReset" shown above.
 *--------------------------------------
 * Event comment-tags (case sentitive!)
 *--------------------------------------
 * To show an event on the minimap:
 * <mm_show>
 *
 * To add a description to an event (for the minimap-scene)
 * <mm_desc>
 *
 * To add teleport to the event:
 * <mm_tp:offset_x offset_y direction fadeType>
 * Example: <mm_tp:1 0 2 0>
 * Notes: 
 *        - Offset is the offset in tiles with the event-location itself being 0 0
 *        - Possible direction values: 2 (down), 4 (left), 6 (right), 8 (up). Or use a value of 0 to maintain the current player-facing-direction
 *        - Possible fadeType values: 0 (black), 1 (white), 2 (none)
 * 
 *
 * Note to other scripters: You can access the variable that contains the window through this: "SE.Minimap.Window" w/o the quotes.
 *
 *
 *--------------------------------------
 * Script Calls & Event triggers (for advanced users & scripters ONLY!)
 *--------------------------------------
 * Getting a reference to the minimap window:
 * SE.Minimap.Window
 *
 * Retrieving the Fog of War completion status:
 * SE.Minimap.getFowCompletion(mapId);
 * Note 1: mapId is optional (if a map is active) and when left out, it will be replaced with the id of the current map.
 * Note 2: It will return an object
 *
 * SE.Minimap.Window.onFullyRevealedMap(x, y) is called whenever the map is fully revealed (no more Fog of War tiles left) by the player and the x, y are the coordinates of the last revealed tile.
 *
 *--------------------------------------
 * Aliases created for:
 *--------------------------------------
 * * DataManager.extractSaveContents()
 * * DataManager.makeSaveContents()
 * * Game_Event.prototype.setupPage()
 * * Game_Interpreter.prototype.command126()
 * * Game_Interpreter.prototype.pluginCommand()
 * * Game_Player.prototype.updateMove()
 * * Game_Screen.prototype.updateFadeOut()
 * * Game_Vehicle.prototype.getOff()
 * * Game_Vehicle.prototype.getOn()
 * * Scene_Map.prototype.callMenu()
 * * Scene_Map.prototype.createDisplayObjects()
 * * Scene_Map.prototype.createSpriteset
 * * Spriteset_Map.prototype.createCharacters()
 * 
 *--------------------------------------
 * #Known Bugs:
 *--------------------------------------
 * - Resizing the minimap to 160x160 on large overworld maps on autofit-mode with autogenerated-maps for some reason drains a lot of performance even though the world is only generated on map-load.
 * - Closing the Minimap menu with Fog of War in maps bigger than 119x119 causes a serious performance issue to the point of freezing the game:
 *   > This is the line that slows it down, no idea why: toThisBmp.blt(this.fowCurrentBmp, src_x, src_y, src_w, src_h, borderOffset_x, borderOffset_y, dest_w, dest_h); // in applyFoWSection = function
 *   > It also occurs when transferring on the same map to another location (on the same map).
 *   > Loading the game through the title screen (from a new game, so when no Game_Map was ever loaded) also causes this problem but starting a new game on a large FoW map is fine and loading a game from a map (through event) is also fine.
 * 
 *--------------------------------------
 * #Version History:
 *--------------------------------------
 * v1.40 (25 April 2020)
 * - Added a new plugin command: toggle_visibility
 * - Added a new methods for main menu managers:
 *   - SE.Minimap.Window.toggle()
 *   - SE.Minimap.GetMenuToggleText()
 *   - SE.Minimap.mainMenuToggleBind()
 * - Added Saving & loading for:
 *   - PlayerBlip graphic
 *   - Minimap visibility
 *   - Map style
 *   - Vehicle visibilities
 *   - Camera follow target
 * - Bugfix: Non-generated maps now work for deployed projects.
 *
 * v1.31 (11 April 2020)
 * - Fixed a crash when switching maps.
 *
 * v1.30 (05 April 2020) [Updated Parameters]
 * - No longer requires the dependency "SE_Keys.js" but now instead requires "SE_Core.js".
 * - Added coding standards.
 * - Added a new Parameter: Suppress Warnings, defaults to false.
 * - The minimap menu respects the fog of war.
 * - Events, POI's, etc. are now drawn underneath the fog of war instead of above it.
 * - Refactor: To comply with the new coding standards as well as for the new JS ECMA that is now supported in RMMV.
 * - Refactor: Added a SE_Reporter class, which is now being used.
 * - Bugfix: Fixed an if-statement-assignment bug in the first line of resetFoWCompletion().
 * - Bugfix: The fog of war is now cleared around the player when transferring to or within a map.
 * - Note: Changing the opacity of the minimap doesn't change the opacity of the fog of war. This is known and won't be changed because RPG Maker MV has some blitting limitations, it would cost too much maintenance/performance.
 *
 * v1.21 (10 November 2019)
 * - Fixed a bug that prevented the game from saving.
 * 
 * v1.20 (28 September 2019) [Updated Parameters]
 * - Updated this plugin for the latest version of RMMV and SE_Keys.
 * - Added an index in the code for easier navigation.
 * - Changed the names from Silv --> SE.
 * - Fixed a bug with the "mm_menuzoom" plugin command (it was treated as a boolean but should be a float).
 * - Refactoring.
 *
 * v1.14a (17 February 2016) [Updated Parameters]
 *   - Fixed a bug that refused to render the minimap mapshots when the project is deployed.
 *   - Added support for vehicles including new parameters and plugin commands for this.
 *   - Fixed a map-generation-color-bug that I accidentally caused in v1.13.
 *   - Removed a circular reference from 1.14. RPG Maker MV is just not compatible with those...
 *
 * v1.13 (09 February 2016) [Updated Parameters]
 *   - Added a new parameter to assign the default map visibility.
 *   - The plugin command "Minimap Refresh" can now be called when there is no active minimap.
 *   - The minimap now automatically attempts to create itself upon gaining the required map-item while the player is on that same map.
 *   - Automatic map-generation can now also be performed through regions. Regions override tile-tags but both can be used simultaneously.
 *
 * v1.12 (28 January 2016)
 *   - Fixed a crash when the height of the map was bigger than it's width.
 *
 * v1.11 (03 January 2016) [Updated Parameters]
 *   - Added Fog of War with new plugin commands. It obviously also works with looping maps, comes with persistence and you can determine what maps have FoW and which don't.
 *     - You can optionally customize the Fog overlay image on a per-map-basis.
 *     - Added a sample Fog of War overlay-image (FoW.png) to the forum post. I made it using the "The Gimp".
 *     - New map-notetags: <mm_fow_enabled:value> <mm_fow_ov:value> <mm_fow_radius:value> <mm_fow_completion:value>
 *     - Added a script-call to retrieve the FoW completion status: SE.Minimap.getFowCompletion(mapId);
 *     - Performs well even on super large (overworld) maps. It does use ~60-120MB of RAM on super large maps and only takes up to ~17kb of savegame file-size for super large maps.
 *  - Added a new help section: "Script Calls & Event triggers".
 *
 * v1.10 (30 December 2015)
 *   - Added the requested option to use a custom map-scene-image that is different from the actual map displayed in the minimap.
 *   - Added a new mapnotetag: <mm_menu_bg:customImageName>
 *
 * v1.09 (27 December 2015)
 *   - Fixed a crash that occurred when events (other than the last one) were deleted (in the map-editor) leaving behind null-values in the $dataMap.
 *   - Renamed the plugin-command alias (before, there was a possible compatibility issue with some of my other scripts).
 *   - Minor refactoring again and applied my new coding standards. Aliases are now stored outside of the anonymous function in a single variable.
 *
 * v1.08 (22 December 2015)
 *   - Fixed a crash when getting onto a vehicle in the overworld when no minimap was active (line 1099) and when getting off a vehicle.
 *   - Improved error reporting
 *   - Switched to the Imported-variable. Thus this plugin now requires Silvers Key plugin 1.02!
 *
 * v1.07 (12 December 2015)
 *   - New feature: Automatically shows vehicles on the minimap as the playerblip when entering a vehicle. Only applies if "Player Blip Graphic" is set to :player .
 *   - Fixed a crash when generating an overworld map without a minimap-image and with the passability-overlay enabled.
 *   - Is now compatible with dynamic map/dungeon generators. You can now recreate the minimap by calling: SE.Minimap.setup(); after generating your random map.
 *
 * v1.06 (06 December 2015)
 *   - This plugin is now compatible with Yanfly's "Main Menu Manager" plugin. It also automatically disables (or even hides if you want) the map-menu-command if
 *     you do not have an active minimap or simply do not possess the required items.
 *   - Added a new mapnotetag: <mm_mapshot:map_id>. This one is used to display a mapshot from a different map in the current map. Handy in case you have duplicate maps
 *     to prevent ending up with duplicate minimap images in your project folder.
 *   - Removed a console.log() that I forgot to remove in 1.05 before release.
 *
 * v1.05 (30 November 2015)
 *   - I accidentally had some global variables declared above the window-initialization, I made them local now to save memory and to prevent incompatibility issues with other scripts.
 *   - Fixed a crash when fading the scene without an active minimap.
 *
 * v1.04 (27 November 2015) [Updated Parameters]
 *   - Disabled strict-mode (Either Javascript or RPG Maker seems not to support this fully...).
 *   - Fixed a typo that caused the minimap to not resize in height.
 *   - Grouped the player-blink parameters together and removed the unused "Draw Player Icon" parameter (v.1.03 only removed it partially).
 *   - New feature: focus the minimap-camera onto (moving-)events, coordinates or the player.
 *   - Minor refactoring.
 *
 * v1.03 (26 November 2015) [Updated Parameters]
 *   - New feature: Use custom player blip.
 *     - 2 new parameters: "Render Player Blip" & "Player Blip Graphic" and new mapnotetag: <mm_player_blip::player> and a new plugin parameter "Minimap setplayerblip <value>".
 *     - Removed parameter "Draw Player Icon".
 *   - Added a parameter to change minimap-opacity.
 *   - Added plugin commands and map-notetags to switch between AutoScroll and Autofit map-modes, <mm_mapstyle:Scroll/Autofit>
 *
 * v1.02 (25 November 2015) [Updated Parameters]
 *   - Enabled strict mode.
 *   - Added the 'Minimap ShowMapMenu' plugin-command.
 *   - New feature: can now generate overworld-minimaps (w/o requiring mapshots) with the map-notetag: <mm_generate_worldmap> or <mm_generate_overworld> or <mm_generate_map>].
 *   - New feature: generate passability overlay. Also comes with new map-notetag & plugin command. Supports 4-direction-passability.
 *   - New feature: You can now (optional) open the minimap-menu through a keybinding and also close it with that same keybinding (if the left-menu is active).
 *   - Fixed the minimap-visibility again (it was still not properly fixed in v1.01).
 *   - Now requires Silvers Keybinding script 1.01 instead of 1.00.
 *
 * v1.01 (24 November 2015) [Updated Parameters]
 *   - Fixed the player-blip becoming invisible when walking on grass. Because of this I had to add 2 more advanced parameters.
 *   - Fixed: The minimap no longer automatically shows itself again when it was manually hidden after opening a menu.
 *   - Updated the version number to 1.01 (it was still 0.91) in the plugin description.
 *   - Cleaned up some more out-commented code.
 *   - Fixed: minimap can now hide again when it contains POI's.
 *   - Fixed a bug that would not 'dispose' the minimap-window when getting rid of a minimap within a scene because the Scene_Map still had a references in it's children to the map. This also increases performance.
 *
 * v1.00 (23 November 2015)
 *   - First release.
 *
 * v0.90-0.92 (November 2015)
 *   - First alpha release.
 * 
 *--------------------------------------
 * #Coding Standards:
 *--------------------------------------
 * - Function names: camelCase.
 * - Class names: PascalCase.
 * - Properties and global variables: PascalCase.
 * - Local variables must be defined with "let" instead of "var" and use "const" where possible.
 * - Strings will use double quotes "my string" instad of single quotes 'my string'.
 * 		- Exception: single quotes can be used when double quotes appear inside the string, so instead of escaping.
 * - True, false and null checking will be done explicitly through === and !==.
 * - Use curly brackets in switch statements if it contains more than one line (excl. the break/return) or if a local variable is declared.
 * - Function vs 'getter' (or lambda): Generally, functions/methods represent actions and getters/properties represent data. If it has one or more parameters then it will also be a function/method.
 *   - Important note for 'getters': https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 */

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  #Script start
  ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
 
╔════════════════════════╗
║ #Plugin Initialization ║
╚════════════════════════╝*/
Imported.SE_Minimap = { name: "SE_Minimap", version: 1.40, author: "Squirting Elephant", date:"2020-04-25"};

// Dependency check
if (!("SE_Core" in Imported) || Imported.SE_Core.version < 1.10) { throw new Error("ERROR: Squirting Elephant's Minimap requires Squirting Elephant's Core v1.10 or higher. It must also be placed above this minimap plugin and must be turned ON."); }

/*╔═════════════════════════╗
  ║ #Parameters & Variables ║
  ╚═════════════════════════╝*/
  (function()
  {
	// Get Plugin Parameters
	SE.Params.Minimap = PluginManager.parameters('SE_Minimap');
	for (let key in SE.Params.Minimap) { SE.Params.Minimap[key] = SE.Params.Minimap[key].replace("\r", EMPTY_STR); } // Because: fix stupid RMMV bug (https://forums.rpgmakerweb.com/index.php?threads/parameter-string-does-not-equal-string.113697/)
	SE.Params.Minimap = SE.parseParameters(JSON.stringify(SE.Params.Minimap));

	var Params = SE.Params.Minimap; // Alias for ease of use.
	SE.Minimap = SE.Minimap || {};
	SE.Minimap.Menu = SE.Minimap.Menu || {};
	SE.Minimap.Generator = SE.Minimap.Generator || {};

	// Non-parameters
	SE.Minimap.Window                       = null;
	SE.Minimap.POI                          = {};
	SE.Minimap.Events                       = []; // Is an array of objects [{ Game_Event, Sprite_Character }]. USe .event and .sprite to retrieve the values.
	SE.Minimap.ScreenIsFading               = false;
	SE.Minimap.Menu.Bmp                     = null;
	SE.Minimap.Menu.Markers                 = [];
	SE.Minimap.Menu.Enabled                 = false;
	SE.Minimap.WasLoadedFromSave            = false;
	SE.Minimap.LastMapID                    = -1; // To detect when a different map is loaded. Because loading the menu-scene for example will reload the entire map again and also recreate the minimap, but we don't want to erase the POI's and such then.
	SE.Minimap.TP_Dest                      = null;
	SE.Minimap.CreateFunctionIsLocked       = false;
	SE.Minimap.Visible                      = true;
	SE.Minimap.FoWData                      = {};
	SE.TEST                                 = SE.TEST || Utils.isOptionValid("test"); // true if the project is launched from editor, false when launched after deployment
	// General
	SE.Minimap.MapStyle                     = Params.MapStyle.toLowerCase();
	SE.Minimap.GlobalMapZoom                = Params.GlobalMapZoom;
	SE.Minimap.Window_Opacity               = Params.MinimapOpacity;
	SE.Minimap.VisibleByDefault             = Params.IsVisibleByDefault;
	// Positioning & Size
	SE.Minimap.Window_X                     = Params.Window_X;
	SE.Minimap.Window_Y                     = Params.Window_Y;
	SE.Minimap.WindowWidth                  = Params.Width;
	SE.Minimap.WindowHeight                 = Params.Height;
	SE.Minimap.BorderWidth                  = Params.BorderWidth;
	SE.Minimap.BorderHeight                 = Params.BorderHeight;
	SE.Minimap.WindowHorizontalAlignment    = Params.AlignmentHorizontal.toLowerCase();
	SE.Minimap.WindowVerticalAlignment      = Params.AlignmentVertical.toLowerCase();
	// Player Blip
	SE.Minimap.PlayerBlipEnabled            = Params.RenderPlayerBlip;
	SE.Minimap.PlayerBlipGraphic            = Params.PlayerBlipGraphic.toLowerCase();
	SE.Minimap.PlayerIconWidth              = Params.PlayerIconWidth;
	SE.Minimap.PlayerIconHeight             = Params.PlayerIconHeight;
	SE.Minimap.PlayerBlinks                 = Params.PlayerBlinkDelay > 0; // note: is not actually a parameter but uses one to calculate the value instead.
	SE.Minimap.PlayerBlinkDelay             = Params.PlayerBlinkDelay;
	// Vehicles
	SE.Minimap.RenderVehicles               = Params.ShowVehicles;
	SE.Minimap.RenderBoat                   = Params.ShowBoat;
	SE.Minimap.RenderShip                   = Params.ShowShip;
	SE.Minimap.RenderAirship                = Params.ShowAirship;
	SE.Minimap.VehicleRenderSize            = { x:Params.VehicleRenderWidth, y:Params.VehicleRenderHeight };
	SE.Minimap.AlwaysRenderVehicles         = Params.AlwaysShowVehicles;
	// Menu
	SE.Minimap.Menu.MenuKey                 = SE.Keys.fromStringParam(Params.MenuKey);
	SE.Minimap.Menu.PlayerDesc              = Params.MenuPlayerDescription;
	SE.Minimap.Menu.Zoom                    = Params.MenuZoom;
	SE.Minimap.Menu.WindowWidth_Left        = Params.MenuLeft_WindowWidth;
	SE.Minimap.Menu.WindowHeight_MapSection = Params.MenuTopright_WindowHeight;
	SE.Minimap.Menu.EventRenderSize         = Params.Menu_EventRenderSize;
	SE.Minimap.Menu.PlayerIconSize          = Params.Menu_PlayerIconSize;
	SE.Minimap.Menu.ManualZoom_Min          = Params.Menu_MinManualZoom;
	SE.Minimap.Menu.ManualZoom_Max          = Params.Menu_MaxManualZoom;
	SE.Minimap.Menu.ManualZoomKey_In        = SE.Keys.fromStringParam(Params.Menu_ZoominKey);
	SE.Minimap.Menu.ManualZoomKey_Out       = SE.Keys.fromStringParam(Params.Menu_ZoomoutKey);
	SE.Minimap.Menu.ManualZoomKey_Reset     = SE.Keys.fromStringParam(Params.Menu_ResetZoomKey);
	SE.Minimap.Menu.ManualScrollKey_Reset   = SE.Keys.fromStringParam(Params.Menu_ResetScrollKey);
	// Passability Map
	SE.Minimap.PassabilityOverlayOpacity    = Params.PassabilityOverlayOpacity;
	SE.Minimap.PassabilityColor             = Params.PassabilityColor;
	SE.Minimap.ImpassabilityColor           = Params.ImpassabilityColor;
	// Generator
	SE.Minimap.Generator.MapColors          = Params.MapGenTagColors.split(SINGLE_SPACE);
	SE.Minimap.Generator.WorldColors        = Params.OverworldGenTagColors.split(SINGLE_SPACE);
	SE.Minimap.Generator.RegionMapColors    = Params.MapGenRegionColors.split(SINGLE_SPACE);
	SE.Minimap.Generator.RegionWorldColors  = Params.OverworldGenRegionColors.split(SINGLE_SPACE);
	// Miscellaneous
	SE.Minimap.AllowTeleportation           = Params.AllowTeleportation;
	SE.Minimap.StandardPadding              = Params.StandardPadding;
	SE.Minimap.WindowSkin                   = Params.WindowSkin;
	SE.Minimap.MapBGFillColor               = Params.FillColor.split(SINGLE_SPACE);
	SE.Minimap.MaintainAspectRatio          = Params.MaintainAspectRatio;
	SE.Minimap.FadeoutSpeed                 = Params.FadeoutSpeed;
	SE.Minimap.GlobalRequiredItem           = Params.GlobalRequiredItem;
	SE.Minimap.EventRenderSize              = Params.EventRenderSize;
	SE.Minimap.AutoClearPOI                 = Params.AutoClearPOI;
	SE.Minimap.DrawOverlay                  = Params.RenderMinimapOverlay;
	// Fog of War
	SE.Minimap.FoWEnabled                   = Params.FoWEnabled;
	SE.Minimap.DefaultFoWBmpName            = Params.DefaultFoWOverlay;
	SE.Minimap.DefaultFoWRadius             = Params.DefaultFoWRadius;
	// Manual Scrolling
	SE.Minimap.AllowManualScrolling         = Params.AllowManualScrolling;
	SE.Minimap.ManualScrollspeed            = Params.ManualScrollspeed;
	SE.Minimap.ManualScrollKeyUp            = SE.Keys.fromStringParam(Params.ManualScrollKey_Up);
	SE.Minimap.ManualScrollKeyRight         = SE.Keys.fromStringParam(Params.ManualScrollKey_Right);
	SE.Minimap.ManualScrollKeyDown          = SE.Keys.fromStringParam(Params.ManualScrollKey_Down);
	SE.Minimap.ManualScrollKeyLeft          = SE.Keys.fromStringParam(Params.ManualScrollKey_Left);
	// Advanced & Debug
	SE.Minimap.PlayerSpriteSrcFrame_Width   = Params.PlayerSpriteSourceframeWidth;
	SE.Minimap.PlayerSpriteSrcFrame_Height  = Params.PlayerSpriteSourceframeHeight;
	SE.Minimap.FrameSkip                    = Params.FrameSkip;
	SE.Minimap.MapFilenameLength            = Params.MapshotFilenameLength;
	SE.Minimap.DebugMode                    = Params.DebugMode;
	SE.Minimap.SuppressWarnings             = Params.SuppressWarnings;
	SE.Minimap.DrawDebugGrid                = Params.RenderDebugGrid;
	SE.Minimap.DebugGridImage               = Params.DebugGridImage;

  /*╔═══════════════════════╗
	║ #Parameter After-care ║
	╚═══════════════════════╝*/
	// Generator parameters
	// param SHOULD be passed by reference because it is typeof Array. But it is not when a new value is assigned to that array... Therefore we use the return value. And adding a new method to Array won't work either because you can't change "this". Fuck Javascript... Fucking half-assed language.
	let convertParams = function(param)
	{
		let newArray = [];
		for(let i=0; i<param.length; i++)
		{
			let splitValue = param[i].split(":");
			newArray[parseInt(splitValue[0])] = splitValue[1];
		}
		return newArray;
	};
	
	SE.Minimap.Generator.RegionMapColors = convertParams(SE.Minimap.Generator.RegionMapColors);
	SE.Minimap.Generator.RegionWorldColors = convertParams(SE.Minimap.Generator.RegionWorldColors);

	// Create the reporter
	SE.Rep = new SE_Reporter(SE.Minimap.DebugMode, SE.Minimap.SuppressWarnings);

	// Creates a default settings object and returns it. Does not actually assign these settings.
	SE.Minimap.CreateDefaultSettings = function()
	{
		return {

			/// Camera focus
			cameraFocusType: "player", // player / event / coordinate
			followValue: null,
			
			/// Vehicles
			renderVehicles: SE.Minimap.RenderVehicles,
			renderBoat: SE.Minimap.RenderBoat,
			renderShip: SE.Minimap.RenderShip,
			renderAirship: SE.Minimap.RenderAirship,
			vehicleRenderSize: SE.Minimap.VehicleRenderSize,
			alwaysRenderVehicles: SE.Minimap.AlwaysRenderVehicles,

			// Player blip
			playerBlipFilename: ":player",
			
			// Map style
			mapStyle: SE.Minimap.MapStyle
		};
	};

	SE.Minimap.Settings = SE.Minimap.Settings || SE.Minimap.CreateDefaultSettings();

})();

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
/*╔════════════╗
  ║ #Utilities ║
  ╚════════════╝*/
(function()
{
  /*╔═══════════════╗
	║ #Alias Helper ║
	╚═══════════════╝*/
	/* Example usage:
	SE.Minimap.AddAlias('mm_Game_Screen_updateFadeOut', Game_Screen.prototype.updateFadeOut);
	Game_Screen.prototype.updateFadeOut = function()
	{
		SE.Alias.mm_Game_Screen_updateFadeOut.apply(this, arguments);
		// Your code here or above the .apply().
	}
	*/

	SE.Minimap.AddAlias = function(alias, original_method)
	{
		if (SE.Alias[alias]) { throw new Error("Alias already exists: " + alias); }
		SE.Alias[alias] = original_method;
	};

	// Example: lpad("2", "0") // result: "002"
	SE.Minimap.lpad_mapname = function(word, padStr)
	{
		word = String(word);
		while (word.length < SE.Minimap.MapFilenameLength) { word = padStr + word };
		return word;
	};

	SE.Minimap.minimapFolderPath = () => "img/minimap/";

	// filename example: "002" (so WITHOUT ".png")
	SE.Minimap.minimapImageExists = (filename) => SE.Core.projectImageExists("minimap", filename);

	SE.Minimap.dataMapGetEventByID = function(ev_id)
	{
		for (let i=1; i< $dataMap.events.length; i++)
		{
			// $dataMap.events may contain null-values when placing several events in the editor and then deleting an event (other than the last one). Therefore the ($dataMap.events[i] !== null) check is required.
			if (($dataMap.events[i] !== null) && $dataMap.events[i].id === ev_id) { return $dataMap.events[i]; }
		}
		return null;
	};

	ImageManager.loadMinimap = function(filename, hue)
	{
		return this.loadBitmap(SE.Minimap.minimapFolderPath(), filename, hue, false);
	};

  /*╔═══════════════════════════════╗
	║ Mainmenu plugin compatibility ║
	║ (like YEP_MainMenuManager)    ║
	╚═══════════════════════════════╝*/
	// Returns true if the menu item should be enabled in the main menu.
	SE.Minimap.EnabledInMainMenu = () => SE.Minimap.Window !== null;
	
	// Returns the text part for showing/hiding the minimap in the main menu.
	SE.Minimap.GetMenuToggleShowHideText = () => SE.Minimap.Visible ? "Hide" : "Show";
	
	// Returns the full text for showing/hiding the minimap in the main menu.
	SE.Minimap.GetMenuToggleText = function()
	{
		if (SE.Minimap.EnabledInMainMenu())
		{
			return SE.Minimap.GetMenuToggleShowHideText() + " minimap";
		}
		else
		{
			return "No minimap";
		}
	};
	
	// For compatibility with: YEP_MainMenuManager.js.
	// Put this method in the "Main Bind" parameter of your menu item.
	SE.Minimap.mainMenuToggleBind = function()
	{
		if (SE.Minimap.Window) { SE.Minimap.Window.toggle(); }
		this.popScene(); // This line is REQUIRED because something (probably related to the stack of a menu or a scene) is stuck or not popped or something. This pops the whole Scene_Menu but this works perfectly. I'm too lazy now to figure this out w/o popping Scene_Menu.
	};

  /*╔════════════════════════════════════════════════════════════╗
	║ #Fade-out fix                                              ║
	║ Do not just show the minimap on top of a faded-out screen. ║
	╚════════════════════════════════════════════════════════════╝*/
	SE.Minimap.AddAlias("mm_Game_Screen_updateFadeOut", Game_Screen.prototype.updateFadeOut);
	Game_Screen.prototype.updateFadeOut = function()
	{
		SE.Alias.mm_Game_Screen_updateFadeOut.apply(this, arguments);
		
		if (this._brightness < 255)
		{
			SE.Minimap.ScreenIsFading = true;
			if (SE.Minimap.Window !== null)
			{
				SE.Minimap.Window.opacity = this._brightness;
				SE.Minimap.Window.contents.paintOpacity = this._brightness;
			}
		}
		else
		{
			SE.Minimap.ScreenIsFading = false;
		}
	};

  /*╔═══════════════╗
	║ #Spritset Map ║
	╚═══════════════╝*/
	Spriteset_Map.prototype.findCharacterSpriteReversed = function(gameCharacter)
	{
		for (let i = this._characterSprites.length - 1; i >= 0; i--)
		{
			if (this._characterSprites[i]._character === gameCharacter) { return this._characterSprites[i]; }
		}
		
		SE.Rep.logDebug("CharacterSprite not found for gameCharacter:", gameCharacter);
		return null;
	};

	// Store a reference to the player graphic.
	SE.Minimap.AddAlias("mm_Spriteset_Map_createCharacters", Spriteset_Map.prototype.createCharacters);
	Spriteset_Map.prototype.createCharacters = function()
	{
		SE.Alias.mm_Spriteset_Map_createCharacters.apply(this, arguments);
		Spriteset_Map.prototype.playerSprite = this.findCharacterSpriteReversed($gamePlayer);
	};

  /*╔═════════════╗
	║ #Game Event ║
	║             ╚═══════════════════════════════════════════════════════════════╗
	║ Automatically create a event-Notetag from event-comments on the active page ║
	║ Example usage: console.log($gameMap.event(1).event.seNote);                 ║
	╚═════════════════════════════════════════════════════════════════════════════╝*/
	SE.Minimap.AddAlias("mm_Game_Event_setupPage", Game_Event.prototype.setupPage);
	Game_Event.prototype.setupPage = function()
	{
		SE.Alias.mm_Game_Event_setupPage.apply(this, arguments);
		this.seCreateNote();
	};

	Game_Event.prototype.seCreateNote = function()
	{
		this.seNote = EMPTY_STR;
		if (typeof this.page() === "undefined") { return; }
		
		let list = this.list();
		let str = null;
		for (let commandProperty in list)
		{
			if (list.hasOwnProperty(commandProperty))
			{
				const command = list[commandProperty];
				const commandCode = command.code;
				if (commandCode === 108) // 108: new comment-item, always the first line.
				{
					if (str !== null) { this.seNote += str; }
					str = command.parameters[0];
				}
				else if (commandCode === 408) // 408: comment-line, but not the first one.
				{
					this.seNote += command.parameters[0];
				}
				else if (str) // It's not a comment-code, so add the previous str (if any) to the note.
				{
					this.seNote += str;
					str = null;
				}
			}
		}
		if (this.seNote !== EMPTY_STR) { this.extractSEMetadata(); }
	};

	// <mm_tp:1> will result in: "1"
	// <mm_tp:1 0> will result in: ["1", "0"];
	Game_Event.prototype.extractSEMetadata = function()
	{
		const re = /<([^<>:]+)(:?)([^>]*)>/g;
		this.meta = {};
		for (;;)
		{
			const match = re.exec(this.seNote);
			if (match)
			{
				if (match[2] === ":")
				{
					let value = match[3];
					if (match[3].indexOf(SINGLE_SPACE) >= 0) { value = match[3].split(SINGLE_SPACE); }
					this[match[1]] = value;
				}
				else
				{
					this[match[1]] = true;
				}
			}
			else
			{
				break;
			}
		}
	};

})();

/*╔═════════════════╗
  ║ #Minimap Window ║
  ╚═════════════════╝*/
function Window_Minimap() { this.initialize.apply(this, arguments); }
// Inherit from base window
Window_Minimap.prototype = Object.create(Window_Base.prototype);
// Set Constructor
Window_Minimap.prototype.constructor = Window_Minimap;

Window_Minimap.prototype.standardPadding = function() { return SE.Minimap.StandardPadding; };
Window_Minimap.prototype.bmpPreloadTotal = 1; // The amount of images to preload before the minimap can be rendered.

// Retrieves all the POI's for the current active $gameMap
Window_Minimap.prototype.getAllPOI = () => SE.Minimap.POI[$gameMap._mapId];

/*╔══════════════════════╗
  ║ #MW - Initialization ║
  ╚══════════════════════╝*/
Window_Minimap.prototype.initialize = function(x, y, width, height, mapName, minimapType)
{
	this.mapName = mapName;
	this.minimapType = minimapType;
	if ("mm_size" in $dataMap.meta)
	{
		const newSize = $dataMap.meta.mm_size.split(SINGLE_SPACE);
		this.width = parseInt(newSize[0]);
		this.height = parseInt(newSize[1]);
	}
	
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._helpWindow = null;
    this._handlers = {};
    this._touching = false;
    this.deactivate();

	this.bmpPreloadCnt = 0;
	this.finishedBmpPreloading = false;
	
	// Fog of War
	this.fowRadius = ("mm_fow_radius" in $dataMap.meta) ? parseInt($dataMap.meta.mm_fow_radius) : SE.Minimap.DefaultFoWRadius;
	if ("mm_fow_enabled" in $dataMap.meta)
	{
		this.fowEnabled = $dataMap.meta.mm_fow_enabled.toLowerCase() === "true";
	}
	else
	{
		this.fowEnabled = SE.Minimap.FoWEnabled;
	}
	this.fowBmpName = ("mm_fow_ov" in $dataMap.meta) ? $dataMap.meta.mm_fow_ov : SE.Minimap.DefaultFoWBmpName;
	if (typeof SE.Minimap.FoWData[$gameMap._mapId] === "undefined") // This if-statement must be placed before preloading the FoW-bitmap
	{
		this.resetFoWData();
		this.fowRequiresRefresh = false;
	}
	else
	{
		this.fowRequiresRefresh = true;
	}
	this.fowOriginalBmp = ImageManager.loadMinimap(this.fowBmpName);
	this.fowOriginalBmp.addLoadListener(function() { this.onFinishOriginalFoWBmpLoad(); }.bind(this));
	
	this.originalMapBmp = null;
	this.passabilityBmp = null;
	this.drawPassabilityOverlay = false;
	this.isFadingOut = false;
	this.isFadedOut = false;
	this.setDrawMapBmp();
	this.overlayBmp = ImageManager.loadMinimap("Overlay"); // By default this is the minimap border image (Overlay.png).
	this.drawAreaWidth = this.contents.width - SE.Minimap.BorderWidth * 2;
	this.drawAreaHeight = this.contents.height - SE.Minimap.BorderHeight * 2;
	this.mapWidth = parseFloat($gameMap.width());
	this.mapHeight = parseFloat($gameMap.height());
	this.setAspectRatio();
	this.playerBlinkCnt = SE.Minimap.PlayerBlinkDelay;
	this.playerBlink_IsVisible = true;
	this.frameSkip = SE.Minimap.FrameSkip;
	this.frameSkipCnt = 0;
	SE.Minimap.Menu.Enabled = true;
	this.mapZoom = ("mm_mapzoom" in $dataMap.meta) ? parseFloat($dataMap.meta.mm_mapzoom) : SE.Minimap.GlobalMapZoom;
	this.mapZoomInverse = 1 / this.mapZoom;
	this.isFirstProcessedUpdate = true;
	this.requiresDrawing = true; // as in AFTER isReady().
	this.isManualScrolling = false;
	this.allowManualScroll = ("mm_allowmanualscroll" in $dataMap.meta) ? $dataMap.meta.mm_allowmanualscroll.toLowerCase() === "true" : SE.Minimap.AllowManualScrolling;
	this.mapScroll = {x: 0, y: 0, adjustment_x: 0, adjustment_y: 0};
	this.lastPlayerLoc = {x: $gamePlayer._realX, y: $gamePlayer._realY};
	this.menuZoom = ("mm_menuzoom" in $dataMap.meta) ? parseFloat($dataMap.meta.mm_menuzoom) : SE.Minimap.Menu.Zoom;
	this.allowTeleportation = ("mm_tp_allow" in $dataMap.meta) ? $dataMap.meta.mm_tp_allow.toLowerCase() === "true" : SE.Minimap.AllowTeleportation;
	this.playerFrame = { x:0, y:0, width:SE.Minimap.PlayerSpriteSrcFrame_Width, height:SE.Minimap.PlayerSpriteSrcFrame_Height };
	SE.Minimap.Settings.mapStyle = ("mm_mapstyle" in $dataMap.meta) ? $dataMap.meta.mm_mapstyle.toLowerCase() : SE.Minimap.MapStyle;
	this.cameraFocusObject = null; // null / reference to event / {x:real_x, y:real_y}
	this.vehicleCharSprite = null;
	this.menuBG = ("mm_menu_bg" in $dataMap.meta) ? ImageManager.loadMinimap($dataMap.meta.mm_menu_bg) : null;
	
	this.initPlayerBlip();
	
	this.loadEvents();
	this.debugGridBmp = ImageManager.loadMinimap(SE.Minimap.DebugGridImage);
		
	// The update must be called AFTER all the initialization code.
	this.update();
	
	// Default visibility
	if (!SE.Minimap.VisibleByDefault)
	{
		 this.hide();
		 SE.Rep.logDebug("Window_Minimap.prototype.initialize:\nMinimap is now hidden.");
	}

	this.loadWindowskin();
	this.setCameraFollowTarget(SE.Minimap.Settings.cameraFocusType, SE.Minimap.Settings.followValue);
};

Window_Minimap.prototype.loadWindowskin = function()
{
	if (this)
	{
		this.windowskin = ImageManager.loadSystem(SE.Minimap.WindowSkin);
	}
};

Window_Minimap.prototype.finishBmpLoad = function()
{
	this.bmpPreloadCnt++;
	if (this.bmpPreloadCnt === this.bmpPreloadTotal)
	{
		 this.finishedBmpPreloading = true; 
	
		// The line below reveals the tiles around the player for when the player enters a map for the first time
		if (this.fowEnabled) { this.updateFoW(); }
	}
};

Window_Minimap.prototype.setOpacity = function()
{
	this.opacity = SE.Minimap.Window_Opacity;
};

Window_Minimap.prototype.initPlayerBlip = function()
{
	this.playerBlipEnabled = SE.Minimap.PlayerBlipEnabled;
	this.playerBlipBmp = null;
	
	this.setPlayerBlip("mm_player_blip" in $dataMap.meta ? $dataMap.meta.mm_player_blip : SE.Minimap.Settings.playerBlipFilename);
};

// Retrieves the specified POI by index for the current active $gameMap. Note this is NOT by POI id, this is by index.
Window_Minimap.prototype.getPOIByIdx = function(index)
{
	return SE.Minimap.POI[$gameMap._mapId][index];
};

Window_Minimap.prototype.getPOIByID = function(id)
{
	for (let i=0; i<SE.Minimap.POI[$gameMap._mapId].length; i++)
	{
		if (SE.Minimap.POI[$gameMap._mapId][i].id === id) { return SE.Minimap.POI[$gameMap._mapId][i]; }
	}
	throw new Error("getPOIByID(" + id + ") not found.");
};

/*╔═════════════════════════╗
  ║ #MW - Set Drawing Bmp's ║
  ╚═════════════════════════╝*/
Window_Minimap.prototype.setDrawMapBmp = function()
{
	switch (this.minimapType)
	{
		case "regular":
		{
			if (this.originalMapBmp === null)
			{
				this.originalMapBmp = ImageManager.loadMinimap(this.mapName);
				this.mapBmp = ImageManager.loadMinimap(this.mapName);
			}
			else if (this.originalMapBmp.isReady())
			{
				this.mapBmp = new Bitmap(this.originalMapBmp.width, this.originalMapBmp.height);
				this.mapBmp.blt(this.originalMapBmp, 0, 0, this.originalMapBmp.width, this.originalMapBmp.height, 0, 0); // Because nobody knows how to clone a bitmap, we do it like this...
				this.requiresDrawing = false;
			}
			break;
		}
		case "generate_map":
		{
			this.mapBmp          = this.generateMap(SE.Minimap.Generator.MapColors, SE.Minimap.Generator.RegionMapColors);
			this.originalMapBmp  = this.generateMap(SE.Minimap.Generator.MapColors, SE.Minimap.Generator.RegionMapColors);
			this.requiresDrawing = false;
			break;
		}
		case "generate_overworld":
		{
			this.mapBmp          = this.generateMap(SE.Minimap.Generator.WorldColors, SE.Minimap.Generator.RegionWorldColors);
			this.originalMapBmp  = this.generateMap(SE.Minimap.Generator.WorldColors, SE.Minimap.Generator.RegionWorldColors);
			this.requiresDrawing = false;
			break;
		}
		default:
			throw new Error("Window_Minimap.prototype.GetMapBmp has invalid switch-value: " + this.minimapType);
	}
	
	if (this.drawPassabilityOverlay)
	{
		if (this.originalMapBmp.isReady()) { this.bltPassabilityOverlay(); }
		else { this.passabilityRequiresRedraw = true; }
	}
};

/*╔═══════════════════╗
  ║ #MW - Show & Hide ║
  ╚═══════════════════╝*/
Window_Minimap.prototype.hide = function()
{
	Window_Base.prototype.hide.apply(this, arguments);
	SE.Minimap.Visible = false;
};

Window_Minimap.prototype.show = function()
{
	Window_Base.prototype.show.apply(this, arguments);
	SE.Minimap.Visible = true;
};

Window_Minimap.prototype.toggle = function()
{
	if (SE.Minimap.Visible === true)
	{
		this.hide();
	}
	else
	{
		this.show();
	}
};

/*╔═══════════════════════════╗
  ║ #MW - Passability Overlay ║
  ╚═══════════════════════════╝*/
Window_Minimap.prototype.bltPassabilityOverlay = function()
{
	// Generate the bitmap if it wasn't done already
	if (this.passabilityBmp === null) { this.passabilityBmp = this.generatePassabilityBmp(); }
	
	// Blt the overlay on top of the this.mapBmp
	this.mapBmp.blt(this.passabilityBmp, 0, 0, this.passabilityBmp.width, this.passabilityBmp.height, 0, 0);
	
	this.passabilityRequiresRedraw = false;
};

Window_Minimap.prototype.setPassabilityOverlay = function(enabled)
{
	this.drawPassabilityOverlay = enabled;
	this.setDrawMapBmp();
};

// Dev note: this method can be severely optimized by replacing it with a modified version of the $gameMap.checkPassage(). Calling gameMap.isPassable() 4x per tile is not effective because internally it starts looping through them 4x instead of 1.
Window_Minimap.prototype.generatePassabilityBmp = function()
{
	const tile_w = $gameMap.tileWidth();
	const tile_h = $gameMap.tileHeight();
	let bmp = new Bitmap($gameMap.width() * tile_w, $gameMap.height() * tile_h);
	bmp.paintOpacity = SE.Minimap.PassabilityOverlayOpacity;
	const borderTickness = 8;
	
	for (let y=0; y<$dataMap.height; y++)
	{
		for (let x=0; x<$dataMap.width; x++)
		{
			let passability = {2:$gameMap.isPassable(x, y, 2), 4:$gameMap.isPassable(x, y, 4), 6:$gameMap.isPassable(x, y, 6), 8:$gameMap.isPassable(x, y, 8)};
			
			if (!passability[2] && !passability[4] && !passability[6] && !passability[8])
			{
				bmp.fillRect(x * tile_w, y * tile_h, tile_w, tile_h, SE.Minimap.ImpassabilityColor);
			}
			else
			{
				bmp.paintOpacity = 255;
				if (!passability[8]) { bmp.fillRect(x * tile_w, y * tile_h, tile_w, borderTickness, SE.Minimap.ImpassabilityColor); } // top
				if (!passability[6]) { bmp.fillRect(x * tile_w + tile_w - borderTickness, y * tile_h, borderTickness, tile_h, SE.Minimap.ImpassabilityColor); } // right
				if (!passability[2]) { bmp.fillRect(x * tile_w, y * tile_h + tile_h - borderTickness, tile_w, borderTickness, SE.Minimap.ImpassabilityColor); } // bottom
				if (!passability[4]) { bmp.fillRect(x * tile_w, y * tile_h, borderTickness, tile_h, SE.Minimap.ImpassabilityColor); } // left
				bmp.paintOpacity = SE.Minimap.PassabilityOverlayOpacity;
				
				bmp.fillRect(x * tile_w, y * tile_h, tile_w, tile_h, SE.Minimap.PassabilityColor);
			}
		}
	}
	return bmp;
};

/*╔══════════════════════╗
  ║ #MW - Map Generation ║
  ╚══════════════════════╝*/
Window_Minimap.prototype.generateMap = function(tagColors, regionColors)
{
	const tile_w = $gameMap.tileWidth();
	const tile_h = $gameMap.tileHeight();
	let bmp = new Bitmap($gameMap.width() * tile_w, $gameMap.height() * tile_h);
	
	for (let y=0; y<$dataMap.height; y++)
	{
		for (let x=0; x<$dataMap.width; x++)
		{
			let effectiveColor = regionColors[$gameMap.regionId(x, y)];
			if (typeof effectiveColor === "undefined") { effectiveColor = tagColors[$gameMap.terrainTag(x, y)]; }
			bmp.fillRect(x * tile_w, y * tile_h, tile_w, tile_h, effectiveColor);
		}
	}
	return bmp;
};

/*╔══════════════╗
  ║ #MW - Events ║
  ╚══════════════╝*/
Window_Minimap.prototype.loadEvents = function()
{
	SE.Minimap.Events = [];
	for (let ev_idx = 1; ev_idx < $dataMap.events.length; ev_idx++) // Note: start at 1. Because the first one is always null.
	{
		if ($dataMap.events[ev_idx] !== null)
		{
			let ev = $gameMap.event(ev_idx);
			
			// Check Event Note
			if ($dataMap.events[ev_idx].note !== EMPTY_STR || ("mm_show" in ev))
			{
				const cmds = $dataMap.events[ev_idx].note.toLowerCase().split(SINGLE_SPACE);
				if ((cmds.indexOf("mm_show") > -1) ||  ("mm_show" in ev))
				{
					this.addEvent(ev);
				}
			}
		}
	}
	SE.Rep.logDebug("Loaded Events: ", SE.Minimap.Events);
};

Window_Minimap.prototype.addEvent = function(event)
{
	const new_ev = {event: event, sprite: this.getEventCharacterSprite(event.eventId())};
	SE.Minimap.Events.push(new_ev); // Add event to the array so we can render it on the minimap
};

Window_Minimap.prototype.getEventCharacterSprite = function(ev_id)
{
	for (let i=0; i < SceneManager._scene._spriteset._characterSprites.length; i++)
	{
		const eventSprite = SceneManager._scene._spriteset._characterSprites[i];
		if (eventSprite._character.eventId() === ev_id)
		{
			return eventSprite;
		}
	}
	throw new Error("getEventCharacterSprite() did not find a match for ev_id: " + ev_id);
};

/*╔═════════════════════╗
  ║ #MW - Miscellaneous ║
  ╚═════════════════════╝*/
Window_Minimap.prototype.showMapMenuScene = function()
{
	SE.Minimap.Window.pushMapScene();
};

Window_Minimap.prototype.clamp = function(value, min, max)
{
	return Math.min(Math.max(value, min), max);
};
	
// This function requires this.mapBmp to be fully initialized.
// #Aspect #Ratio #AspectRatio
Window_Minimap.prototype.setAspectRatio = function()
{
	// this.mapAspRatInfo.scaleDelta_x is the difference in size between the mapwidth (in pixels, NOT in tiles) and the minimap (render)width.
	this.mapAspRatInfo = { w: 0.0, h: 0.0, offset_x: 0.0, offset_y: 0.0, scaleDelta_x: 0.0, scaleDelta_y: 0.0 };
	const w = $gameMap.width();
	const h = $gameMap.height();
	
	// Map Aspect Ratio
	if (!SE.Minimap.MaintainAspectRatio || (w === h))
	{
		this.mapAspRatInfo.w = 1.0;
		this.mapAspRatInfo.h = 1.0;
	}
	else if (w > h)
	{
		this.mapAspRatInfo.w = 1.0;
		this.mapAspRatInfo.h = h / parseFloat(w);
	}
	else // if (h > w)
	{
		this.mapAspRatInfo.w = w / parseFloat(h);
		this.mapAspRatInfo.h = 1.0;
	}
	
	this.mapAspRatInfo.scaleDelta_x = this.drawAreaWidth / parseFloat($gameMap.width() * $gameMap.tileWidth());
	this.mapAspRatInfo.scaleDelta_y = this.drawAreaHeight / parseFloat($gameMap.height() * $gameMap.tileHeight());
};

// Get #Player Blip Bitmap
Window_Minimap.prototype.getPlayerBitmap = function()
{
	if (this.vehicleCharSprite === null)
	{
		let playerSpr = Spriteset_Map.prototype.playerSprite;
		// Player is not in bush, so return the regular player-graphic
		if (playerSpr._bushDepth === 0 || playerSpr._lowerBody === null)
		{
			return { bmp:playerSpr._bitmap, src:playerSpr._frame };
		}

		// Create Bush graphic (which is divided into 2 graphics by the RM-code..)
		let playerBmp = new Bitmap(SE.Minimap.PlayerSpriteSrcFrame_Width, SE.Minimap.PlayerSpriteSrcFrame_Height);
		playerBmp.blt(Spriteset_Map.prototype.playerSprite._lowerBody._bitmap, Spriteset_Map.prototype.playerSprite._lowerBody._frame.x, Spriteset_Map.prototype.playerSprite._lowerBody._frame.y, Spriteset_Map.prototype.playerSprite._lowerBody._frame.width, Spriteset_Map.prototype.playerSprite._lowerBody._frame.height,
					  0, SE.Minimap.PlayerSpriteSrcFrame_Height - playerSpr._bushDepth, SE.Minimap.PlayerIconSize, SE.Minimap.PlayerIconSize);
		playerBmp.blt(Spriteset_Map.prototype.playerSprite._upperBody._bitmap, Spriteset_Map.prototype.playerSprite._upperBody._frame.x, Spriteset_Map.prototype.playerSprite._upperBody._frame.y, Spriteset_Map.prototype.playerSprite._upperBody._frame.width, Spriteset_Map.prototype.playerSprite._upperBody._frame.height,
					  0, 0, SE.Minimap.PlayerIconSize, SE.Minimap.PlayerIconSize);
		
		return {bmp:playerBmp, src:this.playerFrame};
	}
	else // return vehicle instead
	{
		return { bmp:this.vehicleCharSprite._bitmap, src:this.vehicleCharSprite._frame };
	}
};

// Skips frame (returns true) if frameSkipCnt > frameSkip
Window_Minimap.prototype.skipFrame = function()
{
	if (this.frameSkip === 0) { return false; } // process frame
	
	this.frameSkipCnt++;
	if (this.frameSkipCnt < this.frameSkip)
	{
		return true; // skip frame
	}
	else
	{
		this.frameSkipCnt = 0;
		return false; // process frame
	}
};

Window_Minimap.prototype.updatePlayerBlink = function()
{
	this.playerBlinkCnt--;
	if (this.playerBlinkCnt <= 0)		
	{	
		this.playerBlinkCnt = SE.Minimap.PlayerBlinkDelay;
		this.playerBlink_IsVisible = !this.playerBlink_IsVisible;
	}
};
	
/*╔════════════════╗
  ║ #MW - Updating ║
  ╚════════════════╝*/
Window_Minimap.prototype.update = function()
{
	
	// Do nothing if some images haven't finished loading yet
	if (!this.finishedBmpPreloading) { return; }
	
	if (!this.skipFrame() && (this.originalMapBmp === null || this.originalMapBmp.isReady()))
	{
		Window_Base.prototype.update.call(this);
		this.updateFadeOut();
		this.updateInput();
		if (SE.Minimap.PlayerBlinks) { this.updatePlayerBlink(); }
		this.updateMapScroll(this.isFirstProcessedUpdate);
		this.playerInfo = this.getPlayerBitmap();
		if (this.requiresDrawing) { this.setDrawMapBmp(); }
		this.drawMinimap();
		this.lastPlayerLoc.x  = $gamePlayer._realX;
		this.lastPlayerLoc.y  = $gamePlayer._realY;
		this.isFirstProcessedUpdate = false;
		
		// Teleport
		if (SE.Minimap.TP_Dest !== null)
		{
			this.teleport(SE.Minimap.TP_Dest);
			SE.Minimap.TP_Dest = null;
		}
		
		if (this.passabilityRequiresRedraw && this.originalMapBmp.isReady()) { this.bltPassabilityOverlay(); }
	}
	
	if (Input.isTriggered(SE.Minimap.Menu.MenuKey)) { this.showMapMenuScene(); }
};

Window_Minimap.prototype.updateInput = function()
{
	if (Input.isPressed(SE.Minimap.ManualScrollKeyUp))    { SE.Minimap.Window.manualAddScroll(0, SE.Minimap.ManualScrollspeed); }
	if (Input.isPressed(SE.Minimap.ManualScrollKeyRight)) { SE.Minimap.Window.manualAddScroll(SE.Minimap.ManualScrollspeed, 0); }
	if (Input.isPressed(SE.Minimap.ManualScrollKeyDown))  { SE.Minimap.Window.manualAddScroll(0, SE.Minimap.ManualScrollspeed); }
	if (Input.isPressed(SE.Minimap.ManualScrollKeyLeft))  { SE.Minimap.Window.manualAddScroll(SE.Minimap.ManualScrollspeed, 0); }
};

/*╔═══════════════════════╗
  ║ #MW - Player Location ║
  ╚═══════════════════════╝*/
Window_Minimap.prototype.teleport = function(tp_info)
{
	let direction = $gamePlayer._direction;
	if (tp_info[2] !== 0) { direction = parseInt(tp_info[2]); }

	$gamePlayer.reserveTransfer($gameMap._mapId, tp_info[0], tp_info[1], direction, parseInt(tp_info[3]));
};

Window_Minimap.prototype.playerLocChanged = function()
{
	return this.lastPlayerLoc.x !== $gamePlayer._realX || this.lastPlayerLoc.y !== $gamePlayer._realY;
};

/*╔═════════════════╗
  ║ #MW - Scrolling ║
  ╚═════════════════╝*/
Window_Minimap.prototype.updateMapScroll = function(force)
{
	switch (SE.Minimap.Settings.cameraFocusType)
	{
		case "player":
			if (this.playerLocChanged() || force) // Only update mapscroll if the player changed location. This way manual-scrolling is made possible.
			{
				this.isManualScrolling = false;
				this.scrollToMapObject($gamePlayer._realX, $gamePlayer._realY);
			}
			break;
		case "event":
		{
			this.isManualScrolling = false;
			this.scrollToMapObject(this.cameraFocusObject._realX, this.cameraFocusObject._realY);
			break;
		}
		case "coordinate":
		{
			this.isManualScrolling = false;
			this.scrollToMapObject(this.cameraFocusObject.x, this.cameraFocusObject.y);
			break;
		}
		default:
			throw new Error("Invalid switch-value in updateMapScroll(). Value: " + SE.Minimap.Settings.cameraFocusType);
	}
};

Window_Minimap.prototype.setCameraFollowTarget = function(followType, value)
{
	SE.Minimap.Settings.cameraFocusType = followType; // Must be set before calling updateMapScroll()
	SE.Minimap.Settings.followValue = value;
	switch (followType)
	{
		case "player":
		{
			this.cameraFocusObject = null;
			this.updateMapScroll(true); // refresh the camera to focus on the player. Because he may not be moving when this was called.
			break;
		}
		case "event":
		{
			this.cameraFocusObject = $gameMap.event(parseInt(value));
			if (typeof this.cameraFocusObject === "undefined") { throw "setCameraFollowTarget() invalid event-id: " + value; }
			break;
		}
		case "coordinate":
		{
			if (Object.prototype.toString.call(value) !== "[object Array]") { throw "setCameraFollowTarget() value-param must be an array. Received type: " + typeof value; }
			this.cameraFocusObject = { x:value[0], y:value[1] };
			break;
		}
		default:
			throw new Error("Invalid switch-value in setCameraFollowTarget(). Value: " + followType);
	}
	
};

Window_Minimap.prototype.scrollToMapObject = function(real_x, real_y)
{
	this.setMapScroll(real_x * $gameMap.tileWidth() - (this.drawAreaWidth / 2 * this.mapZoomInverse), real_y * $gameMap.tileHeight() - (this.drawAreaHeight / 2 * this.mapZoomInverse));
};

Window_Minimap.prototype.setMapScroll = function(scroll_x, scroll_y)
{
	const old_x = this.mapScroll.x = scroll_x;
	const source_w = this.drawAreaWidth * this.mapZoomInverse;
	this.mapScroll.x = this.clamp(this.mapScroll.x, 0, this.mapBmp.width - source_w);
	this.mapScroll.adjustment_x = old_x - this.mapScroll.x; // clamp difference
	
	const old_y = this.mapScroll.y = scroll_y;
	const source_h = this.drawAreaHeight * this.mapZoomInverse;
	this.mapScroll.y = this.clamp(this.mapScroll.y, 0, this.mapBmp.height - source_h);
	this.mapScroll.adjustment_y = old_y - this.mapScroll.y; // clamp difference
};

Window_Minimap.prototype.manualSetScroll = function(scroll_x, scroll_y)
{
	this.setMapScroll(scroll_x, scroll_y);
	this.isManualScrolling = true;
};

Window_Minimap.prototype.manualAddScroll = function(scroll_x, scroll_y)
{
	this.setMapScroll(this.mapScroll.x + scroll_x, this.mapScroll.y + scroll_y);
	this.isManualScrolling = true;
};

/*╔═════════════════════╗
  ║ #MW - Window Fading ║
  ╚═════════════════════╝*/
Window_Minimap.prototype.updateFadeOut = function()
{
	if (this.isFadedOut || SE.Minimap.ScreenIsFading) { return; } // Do nothing if the minimap is already completely faded out or if the screen itself is being faded in/out.
	if (this.isFadingOut) {	this.fadeOut(); }
};

Window_Minimap.prototype.fadeOut = function()
{
	this.opacity = this.contentsOpacity -= SE.Minimap.FadeoutSpeed;
	this.isFadedOut = (this.opacity <= 0);
};

Window_Minimap.prototype.resetFade = function()
{
	this.isFadingOut = false;
	this.fadeOutCnt = 0;
	this.opacity = this.contentsOpacity = 255;
	this.isFadedOut = false;
};

Window_Minimap.prototype.fadeOutInstantly = function()
{
	this.opacity = this.contentsOpacity = 0;
	this.isFadedOut = true;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*╔═══════════════════════════════════════════════╗
  ║ #Vehicle Compatibility for Player Blip Bitmap ║
  ╚═══════════════════════════════════════════════╝*/
SE.Minimap.AddAlias("mm_Game_Vehicle_getOnVehicle", Game_Vehicle.prototype.getOn);
Game_Vehicle.prototype.getOn = function()
{
	SE.Alias.mm_Game_Vehicle_getOnVehicle.apply(this, arguments);
	
	if (SE.Minimap.Window)
	{
		const charSprites = SceneManager._scene._spriteset._characterSprites;
		for (let i = charSprites.length - 1; i >= 0; i--)
		{
			if (charSprites[i]._character == this)
			{
				SE.Minimap.Window.vehicleCharSprite = charSprites[i];
				break;
			}
		}
		
		if (SE.Minimap.Window.vehicleCharSprite === null)
		{
			SE.Rep.logError("Can't find vehicle sprite for: ", this);
			throw new Error("ERROR: Couldn't find vehicle sprite.");
		}
	}
};

SE.Minimap.AddAlias("mm_Game_Vehicle_getOffVehicle", Game_Vehicle.prototype.getOff);
Game_Vehicle.prototype.getOff = function()
{
	SE.Alias.mm_Game_Vehicle_getOffVehicle.apply(this, arguments);
	if (SE.Minimap.Window) { SE.Minimap.Window.vehicleCharSprite = null; }
};

/*╔═══════╗
  ║ #Menu ║
  ╚═══════╝*/
// This method is required for compatibility with Yanfly's Main Menu Manager.
Scene_Menu.prototype.commandSEMap = function()
{
	SE.Minimap.Window.pushMapScene();
};

SE.Minimap.AddAlias("mm_Scene_Map_callMenu", Scene_Map.prototype.callMenu);
Scene_Map.prototype.callMenu = function()
{
	if (SE.Minimap.Menu.Enabled) { SE.Minimap.Window.createMenuData(); }
	SE.Alias.mm_Scene_Map_callMenu.apply(this, arguments);
};

Window_Minimap.prototype.createMenuData = function()
{
	this.createMenuBmp();
	this.createMenuMarkers();
};

Window_Minimap.prototype.pushMapScene = function()
{
	if (SE.Minimap.Menu.Enabled)
	{
		this.createMenuData();
		if (SE.Minimap.Menu.Bmp !== null) { SceneManager.push(Scene_MiniMap); }
		else { throw new Error("pushMapScene() was called, the minimap-menu was enabled BUT SE.Minimap.Menu.Bmp equals null?"); }
	}
	else
	{
		throw new Error("pushMapScene() was called but the Minimap (menu) was not enabled.");
	}
};

/*╔═════════════════════════╗
  ║ #Menu - Create Menu Bmp ║
  ╚═════════════════════════╝*/
Window_Minimap.prototype.createMenuBmp = function()
{
	SE.Minimap.Menu.Bmp = new Bitmap(this.mapBmp.width * this.menuZoom, this.mapBmp.height * this.menuZoom);
	
	this.tileInfo = {
			w: $gameMap.tileWidth(), hw: $gameMap.tileWidth() / 2.0, zhw: ($gameMap.tileWidth() / 2.0) * this.menuZoom,
			h: $gameMap.tileHeight(), hh: $gameMap.tileHeight() / 2.0, zhh: ($gameMap.tileHeight() / 2.0) * this.menuZoom
		};
	
	// Draw Map
	const backgroundBmp = (this.menuBG) ? this.menuBG : this.mapBmp;
	SE.Minimap.Menu.Bmp.blt(backgroundBmp, 0, 0, backgroundBmp.width, backgroundBmp.height, 0, 0, SE.Minimap.Menu.Bmp.width, SE.Minimap.Menu.Bmp.height);
	
	// Draw Debug Grid
	if (SE.Minimap.DrawDebugGrid)
	{
		for (let i=0; i < $gameMap.width(); i++)
		{
			for (let j=0; j < $gameMap.height(); j++)
			{
				const debugTileLoc = this.translateLocationMenu(this, i, j, this.tileInfo.w * this.menuZoom, this.tileInfo.h * this.menuZoom);
				SE.Minimap.Menu.Bmp.blt(this.debugGridBmp, 0, 0, this.tileInfo.w, this.tileInfo.h, debugTileLoc.x, debugTileLoc.y, this.tileInfo.w * this.menuZoom, this.tileInfo.h * this.menuZoom);
			}
		}
	}
	
	// Draw POI's
	for (let i = 0; i < this.getAllPOI().length; i++)
	{
		const poi = this.getPOIByIdx(i);
		const poiLoc = this.translateLocationMenu(this, poi.real_x, poi.real_y, poi.destSize.w, poi.destSize.h);
		SE.Minimap.Menu.Bmp.blt(poi.bmp, poi.src.x, poi.src.y, poi.src.w, poi.src.h,
							      poiLoc.x, poiLoc.y, poi.destSize.w, poi.destSize.h);
	}
	
	// Draw Events
	for (let i=0; i < SE.Minimap.Events.length; i++)
	{
		const ev = SE.Minimap.Events[i].event;
		const ev_sprite = SE.Minimap.Events[i].sprite;
		const evMapLoc = this.translateLocationMenu(this, ev._realX, ev._realY, SE.Minimap.Menu.EventRenderSize, SE.Minimap.Menu.EventRenderSize);

		SE.Minimap.Menu.Bmp.blt(ev_sprite._bitmap, ev_sprite._frame.x, ev_sprite._frame.y, ev_sprite._frame.width, ev_sprite._frame.height, evMapLoc.x, evMapLoc.y, SE.Minimap.Menu.EventRenderSize, SE.Minimap.Menu.EventRenderSize);
	}
	
	// Draw Vehicles
	if (SE.Minimap.Settings.renderVehicles) { this.drawVehicles(SE.Minimap.Menu.Bmp, this.translateLocationMenu); }
	
	// Draw fog of war if applicable.
	if (this.fowEnabled) { this.applyFoWSection(SE.Minimap.Menu.Bmp, 0, 0, 0, 0, this.fowCurrentBmp.width / this.mapAspRatInfo.w, this.fowCurrentBmp.height / this.mapAspRatInfo.h); }

	// Draw Player
	if (this.playerBlipEnabled)
	{
		this.drawPlayerBlip(SE.Minimap.Menu.Bmp, this.translateLocationMenu, this.playerInfo.src.x, this.playerInfo.src.y, this.playerInfo.src.width, this.playerInfo.src.height,
							SE.Minimap.Menu.PlayerIconSize, SE.Minimap.Menu.PlayerIconSize);
	}
};

/*╔════════════════════════════╗
  ║ #Menu - Create MenuMarkers ║
  ╚════════════════════════════╝*/
Window_Minimap.prototype.createMenuMarkers = function()
{
	SE.Minimap.Menu.Markers = [];
	
	// Player
	const playerMapLoc = this.translateLocationMenu(this, $gamePlayer._realX, $gamePlayer._realY, SE.Minimap.Menu.PlayerIconSize, SE.Minimap.Menu.PlayerIconSize);
	SE.Minimap.Menu.Markers.push({text:"Player", map_x:playerMapLoc.x, map_y:playerMapLoc.y, w:SE.Minimap.Menu.PlayerIconSize, h:SE.Minimap.Menu.PlayerIconSize, desc:SE.Minimap.Menu.PlayerDesc, tp:null});
	
	// POI's
	for (let i = 0; i < this.getAllPOI().length; i++)
	{
		const poi = this.getPOIByIdx(i);
		const poiLoc = this.translateLocationMenu(this, poi.real_x, poi.real_y, poi.destSize.w, poi.destSize.h);
		
		let tp = poi.tp.slice(0); // slice(0) clones it.
		if (this.allowTeleportation && (poi.tp !== null))
		{
			tp[0] = parseInt(tp[0]) + parseInt(poi.real_x);
			tp[1] = parseInt(tp[1]) + parseInt(poi.real_y);
		}
		
		SE.Minimap.Menu.Markers.push({text:poi.name, map_x:poiLoc.x, map_y:poiLoc.y, w:poi.destSize.w, h:poi.destSize.h, desc:poi.desc, tp:tp});
	}
	
	// Events
	for (let i=0; i < SE.Minimap.Events.length; i++)
	{
		const ev = SE.Minimap.Events[i].event;
		const dataMapEvent = SE.Minimap.dataMapGetEventByID(ev._eventId);
		if (dataMapEvent)
		{
			const evMapLoc = this.translateLocationMenu(this, ev._realX, ev._realY, SE.Minimap.Menu.EventRenderSize, SE.Minimap.Menu.EventRenderSize);
			const desc = ("mm_desc" in ev) ? ev.mm_desc.join(SINGLE_SPACE) : EMPTY_STR;
			
			let tp = null;
			if (this.allowTeleportation && ("mm_tp" in ev))
			{
				tp = ev.mm_tp.slice(0); // slice(0) clones it.
				tp[0] = parseInt(tp[0]) + parseInt(ev._x);
				tp[1] = parseInt(tp[1]) + parseInt(ev._y);
			}

			SE.Minimap.Menu.Markers.push({ text:dataMapEvent.name, map_x:evMapLoc.x, map_y:evMapLoc.y, w:SE.Minimap.Menu.EventRenderSize, h:SE.Minimap.Menu.EventRenderSize, desc:desc, tp:tp });
		}
	}
};

/*╔═══════════════════╗
  ║ #Left Menu Window ║
  ╚═══════════════════╝*/
function Window_MinimapMenuLeft() { this.initialize.apply(this, arguments); }

Window_MinimapMenuLeft.prototype = Object.create(Window_Selectable.prototype);
Window_MinimapMenuLeft.prototype.constructor = Window_MinimapMenuLeft;

Window_MinimapMenuLeft.lastTopRow = 0;
Window_MinimapMenuLeft.lastIndex  = 0;

// Note that these lines below are getters:
Window_MinimapMenuLeft.prototype.windowWidth       = () => SE.Minimap.Menu.WindowWidth_Left;
Window_MinimapMenuLeft.prototype.windowHeight      = () => Graphics.boxHeight;
Window_MinimapMenuLeft.prototype.maxItems          = () => SE.Minimap.Menu.Markers.length;
Window_MinimapMenuLeft.prototype.marker            = function () { return SE.Minimap.Menu.Markers[this.index()]; } // Because of "this.", "super", arguments don't work with ()=> we have to write this differently... Javascript sometimes just sucks (more). See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
Window_MinimapMenuLeft.prototype.isCancelTriggered = () => Window_Selectable.prototype.isCancelTriggered();

Window_MinimapMenuLeft.prototype.initialize = function(x, y)
{
	Window_Selectable.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
	this.refresh();
	this.setTopRow(Window_MinimapMenuLeft.lastTopRow);
	this.select(Window_MinimapMenuLeft.lastIndex);
	this.activate();
};

Window_MinimapMenuLeft.prototype.update = function()
{
	Window_Selectable.prototype.update.call(this);
	if (this._mapWindow) { this._mapWindow.setMarker(this.marker()); }
	if (this.index() !== Window_MinimapMenuLeft.lastIndex)
	{
		Window_MinimapMenuLeft.lastIndex = this.index();
		this.callHandler("index_changed");
	}
	
	if (Input.isTriggered("ok"))
	{
		const marker = this.marker();
		if(marker.tp !== null)
		{
			// Add the teleport location to the minimap and dequeue this scene to return to the previous scene
			SoundManager.playOk();
			SE.Minimap.TP_Dest = marker.tp;
			SceneManager.pop();
		}
	}
	
	if (Input.isTriggered(SE.Minimap.Menu.MenuKey))
	{
		SoundManager.playCancel();
		SceneManager.pop();
	}
};

Window_MinimapMenuLeft.prototype.refresh = function()
{
	this.createContents();
	this.drawAllItems();
};

Window_MinimapMenuLeft.prototype.drawItem = function(index)
{
	const rect = this.itemRectForText(index);
	this.drawText(SE.Minimap.Menu.Markers[index].text, rect.x, rect.y, rect.width);
};

Window_MinimapMenuLeft.prototype.processCancel = function()
{
	Window_Selectable.prototype.processCancel.call(this);
	Window_MinimapMenuLeft.lastTopRow = this.topRow();
	Window_MinimapMenuLeft.lastIndex = this.index();
};

Window_MinimapMenuLeft.prototype.setMapWindow = function(mapWindow)
{
	this._mapWindow = mapWindow;
	this.update();
};

/*╔═══════════════════╗
  ║ #Fog of War (FoW) ║
  ╚═══════════════════╝*/
Window_Minimap.prototype.onFinishOriginalFoWBmpLoad = function()
{
	this.cloneOriginalFoWBmpToCurrent();
	
	this.fowSection_w = this.fowCurrentBmp.width;
	this.fowSection_h = this.fowCurrentBmp.height;
	
	this.finishBmpLoad();
	
	if (this.fowRequiresRefresh)
	{
		this.refreshFoWBmp();
		this.fowRequiresRefresh = false;
	}
};

// 'Clone' the original bitmap over the current one.
Window_Minimap.prototype.cloneOriginalFoWBmpToCurrent = function()
{
	this.fowCurrentBmp = new Bitmap($gameMap.width() * $gameMap.tileWidth(), $gameMap.height() * $gameMap.tileHeight());
	this.fowCurrentBmp.blt(this.fowOriginalBmp, 0, 0, this.fowOriginalBmp.width, this.fowOriginalBmp.height, 0, 0, this.fowCurrentBmp.width, this.fowCurrentBmp.height);
};

Window_Minimap.prototype.applyFoWSection_Wrapper = function(src_x, src_y, src_w, src_h)
{
	this.applyFoWSection(this.contents, SE.Minimap.BorderWidth, SE.Minimap.BorderHeight,
						 src_x, src_y, src_w, src_h);
}

//var test2 = new Bitmap(100,100);
//var test = new Bitmap(256,256);

// Renders the current FoW bmp onto the specified bmp
// src_x and src_y are the UNSCALED x&y source-locations of the this.fowCurrentBmp.
Window_Minimap.prototype.applyFoWSection = function(toThisBmp, borderOffset_x, borderOffset_y, src_x, src_y, src_w, src_h)
{
	let originalPaintOpacity = toThisBmp.paintOpacity;
	toThisBmp.paintOpacity = 255;
	const dest_w = toThisBmp.width - borderOffset_x * 2;
	const dest_h = toThisBmp.height - borderOffset_y * 2;
	
	if (src_x + src_w > this.fowCurrentBmp.width) { src_w -= (src_x + src_w) - this.fowCurrentBmp.width; }
	if (src_y + src_h > this.fowCurrentBmp.height) { src_h -= (src_y + src_h) - this.fowCurrentBmp.height; }
	
	//console.log(this.fowCurrentBmp+" , "+src_x+" , "+ src_y+" , "+ src_w+" , "+ src_h+" , "+ borderOffset_x+" , "+ borderOffset_y+" , "+ dest_w+" , "+ dest_h);
	
	//console.log(toThisBmp.width, toThisBmp.height);
	//toThisBmp.blt(test, src_x, src_y, src_w, src_h, borderOffset_x, borderOffset_y, dest_w, dest_h);
	//toThisBmp.blt(this.fowCurrentBmp, 0, 0, 10, 10, 0, 0, 10, 10); // DOES NOT WORK!
	//test2.blt(toThisBmp, 0, 0, 10, 10, 0, 0, 10, 10);// works
	//test2.blt(toThisBmp, 0, 0, 10, 10, 0, 0, 10, 10);// works
	//toThisBmp.blt(test2, 0, 0, 10, 10, 0, 0, 10, 10); // works

	// Original. This is the line that causes FoW performance issues on maps > 119x119 tiles but this ONLY occurs when returning from the minimap menu into this same map.
	toThisBmp.blt(this.fowCurrentBmp, src_x, src_y, src_w, src_h, borderOffset_x, borderOffset_y, dest_w, dest_h);
	//let test = new Bitmap(7680, 7680);
	//toThisBmp.blt(test, 0, 0, 10, 10, borderOffset_x, borderOffset_y, 10, 10);
	//test.blt(this.fowCurrentBmp, src_x, src_y, src_w, src_h, borderOffset_x, borderOffset_y, dest_w, dest_h);
	toThisBmp.paintOpacity = originalPaintOpacity;
};

// Note: does NOT reset the this.fowCurrentBmp
Window_Minimap.prototype.resetFoWData = function()
{
	SE.Minimap.FoWData[$gameMap._mapId] = {};
	
	// Create a new 2d array: SE.Minimap.FoWData[$gameMap._mapId].tiles[x][y]
	SE.Minimap.FoWData[$gameMap._mapId].tiles = new Array($gameMap.width());	
	const mapHeight = $gameMap.height();
	for (let i=0; i<SE.Minimap.FoWData[$gameMap._mapId].tiles.length; i++)
	{
		SE.Minimap.FoWData[$gameMap._mapId].tiles[i] = new Array(mapHeight);
	}
	
	// Fill the arrays with: false instead of the default undefined.
	// Note that the loop must start with x instead of y because of how the length in the 2nd loop is calculated
	for(let x=0; x<SE.Minimap.FoWData[$gameMap._mapId].tiles.length; x++)
	{
		for(let y=0; y<SE.Minimap.FoWData[$gameMap._mapId].tiles[x].length; y++)
		{
			SE.Minimap.FoWData[$gameMap._mapId].tiles[x][y] = false;
		}
	}
	
	// Create the Completion Data
	this.resetFoWCompletion();
};

Window_Minimap.prototype.resetFoWCompletion = function()
{
	const adjust = ("mm_fow_completion" in $dataMap.meta) ? parseInt($dataMap.meta.mm_fow_completion) : 0;
	const totalTileCnt = $gameMap.width() * $gameMap.height() + adjust;

	SE.Minimap.FoWData[$gameMap._mapId].completion =
	{
		totalTiles:totalTileCnt,
		emptyTileCnt:totalTileCnt,
		completedTileCnt:0,
		completePerc:0.00
	};
};

// Reveal tiles when the player arrived on a new tile
SE.Minimap.AddAlias("mm_Game_Player_updateMove", Game_Player.prototype.updateMove);
Game_Player.prototype.updateMove = function()
{
	SE.Alias.mm_Game_Player_updateMove.apply(this, arguments);
	if (!this.isMoving()) { this.AttemptToUpdateFoW(); }
};

Game_Player.prototype.AttemptToUpdateFoW = function()
{
	if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.updateFoW(); }
};

Window_Minimap.prototype.updateFoW = function()
{
	// Do nothing if the player has no radius and also do nothing if the bitmaps have not yet finished loading
	if ((this.fowRadius < 1) || !this.finishedBmpPreloading) { return; }

	// Reveal the tiles within the player's radius, if not already revealed.
	for (let delta_y = -this.fowRadius + 1; delta_y < this.fowRadius; delta_y++)
	{
		for (let delta_x = -this.fowRadius + 1; delta_x < this.fowRadius; delta_x++)
		{
			if (Math.abs(delta_x) + Math.abs(delta_y) < this.fowRadius) // this if-statement transforms the 'reveal-square' into a 45 degree rotated 'reveal-square'
			{
				this.updateFoWTile(this.clamp($gamePlayer._x + delta_x, 0, $gameMap.width() - 1),  // x
								   this.clamp($gamePlayer._y + delta_y, 0, $gameMap.height() - 1), // y
								   true);
			}
		}
	}
};

Window_Minimap.prototype.updateFoWTile = function(x, y, value)
{
	if (SE.Minimap.FoWData[$gameMap._mapId].tiles[x][y] !== value)
	{
		SE.Minimap.FoWData[$gameMap._mapId].tiles[x][y] = value;
		(value) ? this.fowRevealTileInBmp(x, y) : this.fowHideTileInBmp(x, y);
		
		// Modify completion data
		const completionValue = (value) ? 1 : -1;
		SE.Minimap.FoWData[$gameMap._mapId].completion.emptyTileCnt     -= completionValue;
		SE.Minimap.FoWData[$gameMap._mapId].completion.completedTileCnt += completionValue;
		SE.Minimap.FoWData[$gameMap._mapId].completion.completePerc      = Math.min(1.0, SE.Minimap.FoWData[$gameMap._mapId].completion.completedTileCnt / parseFloat(SE.Minimap.FoWData[$gameMap._mapId].completion.totalTiles));
		if (SE.Minimap.FoWData[$gameMap._mapId].completion.completePerc === 1.0) { this.onFullyRevealedMap(x, y); }
	}
};

Window_Minimap.prototype.fowRevealTileInBmp = function(x, y)
{
	const tile_w = $gameMap.tileWidth();
	const tile_h = $gameMap.tileHeight();
	this.fowCurrentBmp.clearRect(x * tile_w, y * tile_h, tile_w, tile_h);
};

Window_Minimap.prototype.fowHideTileInBmp = function(x, y)
{
	const tile_w = $gameMap.tileWidth();
	const tile_h = $gameMap.tileHeight();
	const dest_x = x * tile_w;
	const dest_y = y * tile_h;
	const zoom_x = this.fowOriginalBmp.width / parseFloat(this.fowCurrentBmp.width);
	const zoom_y = this.fowOriginalBmp.height / parseFloat(this.fowCurrentBmp.height);
	
	this.fowCurrentBmp.blt(this.fowOriginalBmp, dest_x * zoom_x, dest_y * zoom_y, tile_w * zoom_x, tile_h * zoom_y, dest_x, dest_y, tile_w, tile_h);
};

// Recalculates the entire this.fowCurrentBmp from the SE.Minimap.FoWData
Window_Minimap.prototype.refreshFoWBmp = function()
{
	this.cloneOriginalFoWBmpToCurrent();
	for (let y=0; y<$gameMap.height(); y++)
	{
		for (let x=0; x<$gameMap.width(); x++)
		{
			if (SE.Minimap.FoWData[$gameMap._mapId].tiles[x][y]) { this.fowRevealTileInBmp(x, y); }
		}
	}
};

// Reveals OR hides all the tiles between 2 tile-coordinates. Note that the tile-coordinates itself are also included.
Window_Minimap.prototype.fowChangeTilesBetweenCoords = function(x1, y1, x2, y2, value)
{
	for (let y=y1; y<=y2; y++)
	{
		for (let x=x1; x<=x2; x++)
		{
			this.updateFoWTile(x, y, value);
		}
	}
};

Window_Minimap.prototype.getFowCompletion = function(mapId)
{
	if (!mapId) { mapId = $gameMap._mapId; }
	if (!SE.Minimap.FoWData[mapId]) { return 0; }
	return SE.Minimap.FoWData[mapId].completion;
};

Window_Minimap.prototype.fowRevealEntireMap = function()
{
	for(let y=0; y<SE.Minimap.FoWData[$gameMap._mapId].tiles.length; y++)
	{
		for(let x=0; x<SE.Minimap.FoWData[$gameMap._mapId].tiles[y].length; x++)
		{
			SE.Minimap.FoWData[$gameMap._mapId].tiles[x][y] = true;
		}
	}
	
	// Reveal Bitmap
	this.fowCurrentBmp = new Bitmap(this.fowCurrentBmp.width, this.fowCurrentBmp.height);
	
	// Modify completion data
	SE.Minimap.FoWData[$gameMap._mapId].completion.emptyTileCnt     = 0;
	SE.Minimap.FoWData[$gameMap._mapId].completion.completedTileCnt = SE.Minimap.FoWData[$gameMap._mapId].completion.totalTiles;
	SE.Minimap.FoWData[$gameMap._mapId].completion.completePerc     = 1.0;
	this.onFullyRevealedMap($gameMap.width() - 1, $gameMap.height() - 1);
};

Window_Minimap.prototype.fowHideEntireMap = function(revealTilesAroundPlayer)
{
	this.resetFoWData();
	this.cloneOriginalFoWBmpToCurrent();
	if (revealTilesAroundPlayer) { this.updateFoW(); }
};

// This method is empty because this is used as an 'event'.
Window_Minimap.prototype.onFullyRevealedMap = function(x, y) {};

/*╔══════════════════════╗
  ║ #Rendering & Drawing ║
  ╚══════════════════════╝*/
Window_Minimap.prototype.setPlayerBlip = function(filename)
{
	SE.Minimap.Settings.playerBlipFilename = filename;
	this.usePlayerBlipGfx = (filename === ":player");
	if (this.usePlayerBlipGfx) { this.playerBlipBmp = null; }
	else { this.playerBlipBmp = ImageManager.loadMinimap(filename);	}
};

Window_Minimap.prototype.drawPlayerBlip = function(destBmp, translateFunc, src_x, src_y, src_w, src_h, dest_w, dest_h)
{
	const playerMapLoc = translateFunc(this, $gamePlayer._realX, $gamePlayer._realY, dest_w, dest_h);
	if (this.usePlayerBlipGfx)
	{
		destBmp.blt(this.playerInfo.bmp, src_x, src_y, src_w, src_h, playerMapLoc.x, playerMapLoc.y, dest_w, dest_h);
	}
	else
	{
		// Use custom player blip graphic
		if (this.playerBlipBmp.isReady())
		{
			destBmp.blt(this.playerBlipBmp, 0, 0, this.playerBlipBmp.width, this.playerBlipBmp.height, playerMapLoc.x, playerMapLoc.y, dest_w, dest_h);
		}
	}
};

Window_Minimap.prototype.drawMinimap = function()
{
	this.contents.clear();
	
	// BG fill colour, if applicable
	this.contents.fillRect(SE.Minimap.BorderWidth, SE.Minimap.BorderHeight, this.drawAreaWidth, this.drawAreaHeight, SE.Minimap.MapBGFillColor);
	
	switch(SE.Minimap.Settings.mapStyle)
	{
		case "autofit":
			this.drawstyleAutofit();
			break;
		case "scroll":
			this.drawstyleScroll();
			break;	
		default:
			throw new Error("Window_Minimap.prototype.drawMinimap invalid switch value: " + SE.Minimap.Settings.mapStyle);
	}
};

// #Vehicles
// Store the vehicle characterSprite into the vehicle-object.
SE.Minimap.AddAlias("mm_Scene_Map_createSpriteset", Scene_Map.prototype.createSpriteset);
Scene_Map.prototype.createSpriteset = function()
{
	SE.Alias.mm_Scene_Map_createSpriteset.apply(this, arguments);
	
	SE.Minimap.VehicleCharacterSprites = {};
	
	const vehicles = $gameMap._vehicles;
	for (let vehicleIdx=0; vehicleIdx<vehicles.length; vehicleIdx++)
	{
		const vehicle = vehicles[vehicleIdx];
		SE.Minimap.VehicleCharacterSprites[vehicle._type] = this._spriteset.findCharacterSpriteReversed(vehicle);
		
		if (SE.Minimap.VehicleCharacterSprites[vehicle._type] === null) { throw new Error("Vehicle characterSprite can't be null for verhicle:", vehicle.characterName()); }
	}
};

// Render all vehicles that are located on the current active map.
// Note: vehicles are typeof GameVehicle which inherits from GameCharacter. It's not an event and therefore can't be added to the list of events to render. Therefore it requires it's own logic which this function provides.
Window_Minimap.prototype.drawVehicles = function(destBmp, translateFunc)
{	
	const vehicles = $gameMap._vehicles;
	for (let vehicleIdx=0; vehicleIdx<vehicles.length; vehicleIdx++)
	{
		const vehicle = vehicles[vehicleIdx];
		if ((vehicle._mapId === $gameMap._mapId) && !vehicle._driving) // Only render vehicles that are on this map and do not render it if the player is currently driving it.
		{
			if ((vehicle.isBoat() && SE.Minimap.Settings.renderBoat) || (vehicle.isShip() && SE.Minimap.Settings.renderShip) || (vehicle.isAirship() && SE.Minimap.Settings.renderAirship) || SE.Minimap.SettingsalwaysRenderVehicles) // Only render the vehicles that we want rendered
			{
				const charSprite = SE.Minimap.VehicleCharacterSprites[vehicle._type];
				const srcBmp = charSprite._bitmap;
				const srcFrame = charSprite._frame;
				const vehicleLoc = translateFunc(this, vehicle._realX, vehicle._realY, srcFrame.width, srcFrame.height);
				
				if (srcBmp.isReady())
				{
					destBmp.blt(srcBmp, srcFrame.x, srcFrame.y, srcFrame.width, srcFrame.height, vehicleLoc.x, vehicleLoc.y, SE.Minimap.Settings.vehicleRenderSize.x, SE.Minimap.Settings.vehicleRenderSize.y);
				}
			}
		}
	}
};

Window_Minimap.prototype.applyDrawOpacity = function()
{
	this.contents.paintOpacity = this.opacity = SE.Minimap.Window_Opacity;
}

Window_Minimap.prototype.drawstyleAutofit = function()
{
	this.applyDrawOpacity();
	
	const destination_w = this.drawAreaWidth  * this.mapAspRatInfo.w;
	const destination_h = this.drawAreaHeight * this.mapAspRatInfo.h;
	
	// Calculate the aspect ratio offsets
	this.mapAspRatInfo.offset_x = 0.0; // to center the map
	this.mapAspRatInfo.offset_y = 0.0; // to center the map
	if (this.mapAspRatInfo.w < 1.0) { this.mapAspRatInfo.offset_x = (this.drawAreaWidth  - destination_w) / 2.0; }
	if (this.mapAspRatInfo.h < 1.0) { this.mapAspRatInfo.offset_y = (this.drawAreaHeight - destination_h) / 2.0; }
	
	// This variable saves on calculations further down the road during this update
	// w = width, hw=  half width, zhw = zoomed half width
	this.tileInfo = {
			w: $gameMap.tileWidth(), hw: $gameMap.tileWidth() / 2.0, zhw: ($gameMap.tileWidth() / 2.0) * this.mapAspRatInfo.w,
			h: $gameMap.tileHeight(), hh: $gameMap.tileHeight() / 2.0, zhh: ($gameMap.tileHeight() / 2.0) * this.mapAspRatInfo.h
		};
	
	// Draw Map
	this.contents.blt(this.mapBmp, 0, 0, this.mapBmp.width, this.mapBmp.height, SE.Minimap.BorderWidth + this.mapAspRatInfo.offset_x, SE.Minimap.BorderHeight + this.mapAspRatInfo.offset_y, destination_w, destination_h);
		
	// Draw POI's
	for (const poi of this.getAllPOI())
	{
		const poiLoc = this.translateLocationAutofit(this, poi.real_x, poi.real_y, poi.destSize.w, poi.destSize.h);
		this.contents.blt(poi.bmp, poi.src.x, poi.src.y, poi.src.w, poi.src.h,
		                  poiLoc.x, poiLoc.y, poi.destSize.w, poi.destSize.h);
	}
	
	// Draw Events
	for (const eventData of SE.Minimap.Events)
	{
		const ev = eventData.event;
		const ev_sprite = eventData.sprite;
		const evMapLoc = this.translateLocationAutofit(this, ev._realX, ev._realY, SE.Minimap.EventRenderSize, SE.Minimap.EventRenderSize);
		this.contents.blt(ev_sprite._bitmap, ev_sprite._frame.x, ev_sprite._frame.y, ev_sprite._frame.width, ev_sprite._frame.height,
						  evMapLoc.x, evMapLoc.y, SE.Minimap.EventRenderSize, SE.Minimap.EventRenderSize);
	}
	
	// Draw Vehicles
	if (SE.Minimap.Settings.renderVehicles) { this.drawVehicles(this.contents, this.translateLocationAutofit); }
	
	// Draw fog of war
	if (this.fowEnabled) { this.applyFoWSection_Wrapper(0, 0, this.fowCurrentBmp.width / this.mapAspRatInfo.w, this.fowCurrentBmp.height / this.mapAspRatInfo.h); }

	// Debug Grid (if applicable)
	if (SE.Minimap.DrawDebugGrid)
	{
		for (let y=0; y < $gameMap.height(); y++)
		{
			for (let x=0; x < $gameMap.width(); x++)
			{
				const debugTileLoc = this.translateLocationAutofit(this, x, y, this.tileInfo.w * this.mapAspRatInfo.w, this.tileInfo.h * this.mapAspRatInfo.h);
				this.contents.blt(this.debugGridBmp, 0, 0, this.tileInfo.w, this.tileInfo.h, debugTileLoc.x, debugTileLoc.y, this.tileInfo.w * this.mapAspRatInfo.w, this.tileInfo.h * this.mapAspRatInfo.h);
			}
		}
	}

	// Draw Player
	if (this.playerBlipEnabled && this.playerBlink_IsVisible)
	{
		this.drawPlayerBlip(this.contents, this.translateLocationAutofit, this.playerInfo.src.x, this.playerInfo.src.y, this.playerInfo.src.width, this.playerInfo.src.height,
		                    SE.Minimap.PlayerIconWidth, SE.Minimap.PlayerIconHeight);
	}
	
	// Overlay (if applicable)
	if (SE.Minimap.DrawOverlay) { this.drawOverlay(); }
};

Window_Minimap.prototype.drawstyleScroll = function()
{
	this.applyDrawOpacity();
	
	// The minimap is so large it would require a source-map that is bigger. Because of this the entire map fits onto the minimap anyway so might as well switch to autofit instead of displaying a black image
	if (this.mapScroll.x < 0 || this.drawAreaWidth  * this.mapZoomInverse > this.mapBmp.width ||
		this.mapScroll.y < 0 || this.drawAreaHeight * this.mapZoomInverse > this.mapBmp.height)
	{
		this.drawstyleAutofit();
		return;
	}
	
	// This variable saves on calculations further down the road during this update
	// w = width, hw=  half width, zhw = zoomed half width
	this.tileInfo = {
			w: $gameMap.tileWidth(), hw: $gameMap.tileWidth() / 2.0, zhw: ($gameMap.tileWidth() / 2.0) * this.mapZoom,
			h: $gameMap.tileHeight(), hh: $gameMap.tileHeight() / 2.0, zhh: ($gameMap.tileHeight() / 2.0) * this.mapZoom
		};

	// Draw Map
	// const map_src_rect = { x:0.0, y:0.0, w:0.0, h:0.0};
	// map_src_rect.x = this.mapScroll.x;
	// map_src_rect.y = this.mapScroll.y;
	// map_src_rect.w = this.drawAreaWidth * this.mapZoomInverse;
	// map_src_rect.h = this.drawAreaHeight * this.mapZoomInverse;
	// Draw Map
	this.contents.blt(this.mapBmp, this.mapScroll.x, this.mapScroll.y, this.drawAreaWidth * this.mapZoomInverse, this.drawAreaHeight * this.mapZoomInverse, SE.Minimap.BorderWidth, SE.Minimap.BorderHeight, this.drawAreaWidth, this.drawAreaHeight);

	// Draw POI's
	for (const poi of this.getAllPOI())
	{
		const poiLoc = this.translateLocationScroll(this, poi.real_x, poi.real_y, poi.destSize.w, poi.destSize.h);
		this.contents.blt(poi.bmp, poi.src.x, poi.src.y, poi.src.w, poi.src.h,
		                  poiLoc.x, poiLoc.y, poi.destSize.w, poi.destSize.h);
	}

	// Draw Events
	for (const eventData of SE.Minimap.Events)
	{
		const ev = eventData.event;
		const ev_sprite = eventData.sprite;
		const evMapLoc = this.translateLocationScroll(this, ev._realX, ev._realY, SE.Minimap.EventRenderSize, SE.Minimap.EventRenderSize);
		this.contents.blt(ev_sprite._bitmap, ev_sprite._frame.x, ev_sprite._frame.y, ev_sprite._frame.width, ev_sprite._frame.height,
						  evMapLoc.x, evMapLoc.y, SE.Minimap.EventRenderSize, SE.Minimap.EventRenderSize);
	}

	// Draw Vehicles
	if (SE.Minimap.Settings.renderVehicles) { this.drawVehicles(this.contents, this.translateLocationScroll); }
	
	// Draw fog of war
	if (this.fowEnabled) { this.applyFoWSection_Wrapper(this.mapScroll.x, this.mapScroll.y, this.drawAreaWidth * this.mapZoomInverse, this.drawAreaHeight * this.mapZoomInverse); }

	// Debug Grid (if applicable)
	if (SE.Minimap.DrawDebugGrid)
	{
		for (let y=0; y < $gameMap.height(); y++)
		{
			for (let x=0; x < $gameMap.width(); x++)
			{
				const debugTileLoc = this.translateLocationScroll(this, x, y, this.tileInfo.w * this.mapZoom, this.tileInfo.h * this.mapZoom);
				this.contents.blt(this.debugGridBmp, 0, 0, this.tileInfo.w, this.tileInfo.h, debugTileLoc.x, debugTileLoc.y, this.tileInfo.w * this.mapZoom, this.tileInfo.h * this.mapZoom);
			}
		}
	}

	// Draw Player
	if (this.playerBlipEnabled && this.playerBlink_IsVisible)
	{
		this.drawPlayerBlip(this.contents, this.translateLocationScroll, this.playerInfo.src.x, this.playerInfo.src.y, this.playerInfo.src.width, this.playerInfo.src.height,
						    SE.Minimap.PlayerIconWidth, SE.Minimap.PlayerIconHeight);
	}
	
	// Overlay (if applicable)
	if (SE.Minimap.DrawOverlay) { this.drawOverlay(); }
};

Window_Minimap.prototype.drawOverlay = function()
{
	this.contents.blt(this.overlayBmp, 0, 0, this.overlayBmp.width, this.overlayBmp.height, 0, 0, this.width, this.height);
};

/*╔══════════════════════╗
  ║ #Translate functions ║
  ║                      ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║ Important: Because the translate functions are assigned to a variable, the this-keyword will be undefined! Therefore this can not be used and ║
  ║            that's why I used "that" as a parameter :P. Also SE.Minim.Window may be null so it must be a parameter.                            ║
  ║ For more info see: http://stackoverflow.com/questions/4011793/this-is-undefined-in-javascript-class-methods                                   ║
  ╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝*/
// returns {x, y}
Window_Minimap.prototype.translateLocationScroll = function(that, obj_real_x, obj_real_y, obj_w, obj_h)
{
	const obj_x = (obj_real_x * that.tileInfo.w + that.tileInfo.hw) * that.mapZoom - that.mapScroll.x * that.mapZoom - obj_w / 2.0 + SE.Minimap.BorderWidth;
	const obj_y = (obj_real_y * that.tileInfo.h + that.tileInfo.hh) * that.mapZoom - that.mapScroll.y * that.mapZoom - obj_h / 2.0 + SE.Minimap.BorderHeight;
	return {x: obj_x, y: obj_y}; 
};

// returns {x, y}
Window_Minimap.prototype.translateLocationAutofit = function(that, obj_real_x, obj_real_y, obj_w, obj_h)
{
	const obj_x = (obj_real_x * that.tileInfo.w + that.tileInfo.hw) * that.mapAspRatInfo.scaleDelta_x * that.mapAspRatInfo.w - obj_w / 2.0 + that.mapAspRatInfo.offset_x + SE.Minimap.BorderWidth;
	const obj_y = (obj_real_y * that.tileInfo.h + that.tileInfo.hh) * that.mapAspRatInfo.scaleDelta_y * that.mapAspRatInfo.h - obj_h / 2.0 + that.mapAspRatInfo.offset_y + SE.Minimap.BorderHeight;
	return {x: obj_x, y: obj_y};
};

// returns {x, y}
Window_Minimap.prototype.translateLocationMenu = function(that, obj_real_x, obj_real_y, obj_w, obj_h)
{
	const obj_x = (obj_real_x * that.tileInfo.w + that.tileInfo.hw) * that.menuZoom - obj_w / 2.0;
	const obj_y = (obj_real_y * that.tileInfo.h + that.tileInfo.hh) * that.menuZoom - obj_h / 2.0;
	return {x: obj_x, y: obj_y};
};

/*╔══════╗
  ║ #POI ║
  ╚══════╝*/
function MM_POI() { this.initialize.apply(this, arguments); }
// Set Constructor
MM_POI.prototype.constructor = MM_POI;

// Initialization
// real_x & real_y are in tiles
MM_POI.prototype.initialize = function(poi_id, name, desc, real_x, real_y, folderPath, filename, source_x, source_y, source_w, source_h, draw_w, draw_h)
{
  this.id = poi_id;
  this.name = name;
  this.desc = desc;
  this.real_x = real_x;
  this.real_y = real_y;
  this.folderPath = folderPath; // Required for saving&loading
  this.filename = filename; // Required for saving&loading
  this.bmp = ImageManager.loadBitmap(folderPath, filename, 0, false);
  this.src = { x:source_x, y:source_y, w:source_w, h:source_h };
  this.destSize = { w:draw_w, h:draw_h };
  this.tp = null;
};

// Note: Does not include the Bitmap
MM_POI.prototype.makeSaveContents = function()
{
	return 	{ id:this.id, name:this.name, desc:this.desc, real_x:this.real_x, real_y:this.real_y, src:this.src, destSize:this.destSize, folderPath:this.folderPath, filename:this.filename, tp:this.tp };
};

/*╔══════════════════════════════╗
  ║ #Creating the Minimap Window ║
  ╚══════════════════════════════╝*/
SE.Minimap.AddAlias("mm_Scene_Map_createDisplayObjects", Scene_Map.prototype.createDisplayObjects);
Scene_Map.prototype.createDisplayObjects = function()
{
	SE.Alias.mm_Scene_Map_createDisplayObjects.apply(this, arguments);
	SE.Minimap.setup();
};

//----------------------------------------------------------------------------------------------------
// Setup Minimap
// Call this method to create or re-create the minimap, if required. It does only create a minimap
// if it passes all the checks.
// Example: SE.Minimap.setup();
//----------------------------------------------------------------------------------------------------
SE.Minimap.setup = function()
{
	const didMapChange = $gameMap._mapId !== this.LastMapID;
	if (didMapChange)
	{
		if (this.WasLoadedFromSave)
		{
			this.WasLoadedFromSave = false;
		}
		else
		{
			if (this.AutoClearPOI) { this.POI[$gameMap._mapId] = []; }
		}
	}
	
	// Create empty POI array if it's not defined yet for this map
	if (typeof this.POI[$gameMap._mapId] === "undefined") { this.POI[$gameMap._mapId] = []; }

	SceneManager._scene.attemptToCreateMinimap();
	this.LastMapID = $gameMap._mapId;
};

//----------------------------------------------------------------------------------------------------
// Attempt To Create Minimap
//----------------------------------------------------------------------------------------------------
Scene_Map.prototype.attemptToCreateMinimap = function()
{
	let mapName = SE.Minimap.lpad_mapname($gameMap._mapId, "0");
	if ("mm_mapshot" in $dataMap.meta)
	{
		SE.Rep.logDebug("A mapshot-notetag was found:" + $dataMap.meta.mm_mapshot);
		mapName = SE.Minimap.lpad_mapname($dataMap.meta.mm_mapshot, "0");
	}
	
	let createMinimap = false;
	let minimapType = null;
	const hasRequiredItems = this.MinimapHasRequiredItems();
	
	if (SE.Minimap.Window !== null)
	{
		// #Dispose
		// This is required for values like "SE.Minimap.Window.visible" to get 'reset' properly. Otherwise they keep the values from an old map which can lead to nasty bugs.
		this.removeWindow(SE.Minimap.Window); // Required because the Scene_Map still holds a reference to the old minimap, effectively creating 2 or more minimaps if this method creates another one now...
		SE.Minimap.Window = null;
		SE.Minimap.Menu.Enabled = false;
		SE.Minimap.Menu.Bmp = null;
		SE.Minimap.Menu.Markers = [];
	}

	const windowWasVisible = SE.Minimap.Visible;
	if (SE.Minimap.minimapImageExists(mapName))
	{
		if (hasRequiredItems)
		{
			createMinimap = true;
			minimapType = "regular";
		}
	}
	else
	{
		SE.Rep.logDebug("No minimap '" + mapName + "' found for map with map-id: " + $gameMap._mapId);
		
		if (hasRequiredItems)
		{
			if (("mm_generate_worldmap" in $dataMap.meta) || ("mm_generate_overworld" in $dataMap.meta))
			{
				if (SE.Minimap.DebugMode && !$gameMap.isOverworld()) { SE.Rep.logWarning("Current map is NOT an overworld map but the minimap is set to treat it like a regular map."); }
				createMinimap = true;
				minimapType = "generate_overworld";
			} else if ("mm_generate_map" in $dataMap.meta)
			{
				SE.Rep.logDebug("Scene_Map.prototype.attemptToCreateMinimap:\nGenerating map data");
				if (SE.Minimap.DebugMode && $gameMap.isOverworld()) { SE.Rep.logWarning("Current map is an overworld map but the minimap is set to treat it like a regular map."); }
				createMinimap = true;
				minimapType = "generate_map";
			}
		}
	}

	if (createMinimap)
	{
		this.createMinimapWindow(mapName, minimapType);
		if (!windowWasVisible) { SE.Minimap.Window.hide(); } // This is to prevent the minimap from showing itself again after opening a menu or when recreating the minimap while staying on the same map.
		if ("mm_generate_passability_overlay" in $dataMap.meta) { SE.Minimap.Window.setPassabilityOverlay(true); }
	}
	// else
	// {
		//'Dispose'	
		//This is required for values like "SE.Minimap.Window.visible" to get 'reset' properly. Otherwise they keep the values from an old map which can lead to nasty bugs. 
		// SE.Minimap.Window = null;
	// }
};

//----------------------------------------------------------------------------------------------------
// Create Minimap Window
//----------------------------------------------------------------------------------------------------
Scene_Map.prototype.createMinimapWindow = function(mapname, minimapType)
{
	const x = (SE.Minimap.WindowHorizontalAlignment === "right") ? Graphics.width - SE.Minimap.WindowWidth : 0;
	const y = (SE.Minimap.WindowVerticalAlignment === "bottom") ? Graphics.height - SE.Minimap.WindowHeight : 0;

	SE.Minimap.Window = new Window_Minimap(x + SE.Minimap.Window_X, y + SE.Minimap.Window_Y, SE.Minimap.WindowWidth, SE.Minimap.WindowHeight, mapname, minimapType);
	SE.Minimap.Window.resetFade();
	
	// override frameskip (map-specific frameskip)
	if ("mm_frameskip" in $dataMap.meta)
	{
		SE.Minimap.Window.frameSkip = parseInt($dataMap.meta.mm_frameskip);
		SE.Rep.logDebug("Global frameskip: " + SE.Minimap.FrameSkip + " was overriden by the map-specific frameskip of: " + $dataMap.meta.mm_frameskip);
	}

	this.addChildAt(SE.Minimap.Window, 1);

	SE.Rep.logDebug("Scene_Map.prototype.createMinimapWindow:\nFinished creating minimap.");
};

/*╔══════════════════════════╗
  ║ #Required Items Handling ║
  ╚══════════════════════════╝*/
Scene_Map.prototype.MinimapHasRequiredItems = function()
{
	// Check global item
	if (SE.Minimap.GlobalRequiredItem > 0)
	{
		if (!$gameParty.hasItem($dataItems[SE.Minimap.GlobalRequiredItem], false))
		{
			SE.Rep.logDebug("Minimap (or mapshot-notetag) was found but party does not possess the required global item: " + $dataItems[SE.Minimap.GlobalRequiredItem].name);
			return false;
		}
	}
	
	// Check map-specific items
	if ("mm_req_itm" in $dataMap.meta)
	{
		const req_item_ids = $dataMap.meta.mm_req_itm.split(SINGLE_SPACE).filter(Boolean); // .filter(Boolean) removes empty strings from array
		for (let i = 0; i < req_item_ids.length; i++)
		{
			if (!$gameParty.hasItem($dataItems[req_item_ids[i]], false))
			{
				SE.Rep.logDebug("Minimap was found but party does not possess the required map-specific item: " + $dataItems[req_item_ids[i]].name);
				return false;
			}
		}
	}
	
	return true;
};

// Show Map upon gaining the required item
SE.Minimap.AddAlias("mm_Game_Interpreter_command126", Game_Interpreter.prototype.command126);
Game_Interpreter.prototype.command126 = function()
{
    const retVal = SE.Alias.mm_Game_Interpreter_command126.apply(this, arguments);
	
	if ((SE.Minimap.Window === null) && SceneManager._scene.MinimapHasRequiredItems())
	{
		SceneManager._scene.attemptToCreateMinimap(false);
	}
    
	return retVal;
};

/*╔═══════════════════╗
  ║ #Saving & Loading ║
  ╚═══════════════════╝*/
SE.Minimap.AddAlias("mm_DataManager_makeSaveContents", DataManager.makeSaveContents);
DataManager.makeSaveContents = function()
{
	let contents = SE.Alias.mm_DataManager_makeSaveContents.apply(this, arguments);

	contents.minimap = {};
	contents.minimap.poi = {};
	
	// POI
	for (let mapID in SE.Minimap.POI)
	{
		if (SE.Minimap.POI.hasOwnProperty(mapID))
		{
			if(SE.Minimap.POI[mapID].length > 0) { contents.minimap.poi[mapID] = []; }
			for(let poi_idx=0; poi_idx<SE.Minimap.POI[mapID].length; poi_idx++)
			{
				contents.minimap.poi[mapID].push(SE.Minimap.Window.getPOIByIdx(poi_idx).makeSaveContents());
			}
		}
	}
	
	// FoW
	contents.minimap.fowData = SE.Minimap.FoWData;

	// Visible
	contents.minimap.visible = SE.Minimap.Visible;

	// Settings object
	contents.minimap.settings = SE.Minimap.Settings;

	return contents;
};

SE.Minimap.AddAlias("mm_DataManager_extractSaveContents", DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
	SE.Alias.mm_DataManager_extractSaveContents.apply(this, arguments);

	// POI
	SE.Minimap.POI = {};
	for (let mapID in contents.minimap.poi)
	{
		if (contents.minimap.poi.hasOwnProperty(mapID))
		{
			if (contents.minimap.poi[mapID].length > 0) { SE.Minimap.POI[mapID] = []; }
			for (let poi_idx=0; poi_idx<contents.minimap.poi[mapID].length; poi_idx++)
			{
				const poi = contents.minimap.poi[mapID][poi_idx];
				let newPOI = new MM_POI(poi.id, poi.name, poi.desc, poi.real_x, poi.real_y, poi.folderPath, poi.filename, poi.src.x, poi.src.y, poi.src.w, poi.src.h, poi.destSize.w, poi.destSize.h);
				newPOI.tp = poi.tp;
				SE.Minimap.POI[mapID].push(newPOI);
			}
		}
	}
	// Prevent the minimap from autoclearing it's POI's (if AutoClearPOI is enabled) when loading a savegame.
	SE.Minimap.WasLoadedFromSave = true;

	// FoW
	SE.Minimap.FoWData = contents.minimap.fowData;
	
	// Visible
	SE.Minimap.Visible = contents.minimap.visible;

	// Settings object
	SE.Minimap.Settings = contents.minimap.settings;
};

/*╔══════════════════╗
  ║ #Plugin Commands ║
  ║                  ╚═════════════════════════════════════════════════════════════════════════════════════════════════════════╗
  ║ Note: The items are separated by spaces. The command is the first word and any following words are args. args is an array. ║
  ╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝*/
SE.Minimap.AddAlias("mm_Game_Interpreter_pluginCommand", Game_Interpreter.prototype.pluginCommand);
Game_Interpreter.prototype.pluginCommand = function(command, args)
{
	SE.Alias.mm_Game_Interpreter_pluginCommand.apply(this, arguments);
	if (command.toLowerCase() === "minimap") { PluginCommand(command, args); }
};

function PluginCommand(cmd, args)
{
	const arg0 = args[0].toLowerCase();
	if ((SE.Minimap.Window === null) && (arg0 !== "refresh")) { throw new Error("Minimap Plugin Commands can not be used when there is no active minimap. Either create one from a mapshot or generate one automatically"); }
	
	switch(arg0)
	{
		case "hide":
			SE.Minimap.Window.hide();
			break;
		case "show":
			SE.Minimap.Window.show();
			break;
		case "toggle_visibility":
			if (SE.Minimap.Window)
			{
				SE.Minimap.Window.toggle();
			}
			break;
		case "fadeout":
			SE.Minimap.Window.isFadingOut = true;
			break;
		case "fadereset":
			SE.Minimap.Window.resetFade();
			break;
		case "refresh":
			SceneManager._scene.attemptToCreateMinimap(false);
			break;
		case "addpoi": // addpoi id, name, desc, real_x, real_y, bitmap folder, bitmap filename, s_x, s_y, s_w, s_h, draw_w, draw_h
		{
		    SE.Minimap.POI[$gameMap._mapId].push(new MM_POI(args[1], args[2].replace("_", SINGLE_SPACE), EMPTY_STR, parseFloat(args[3]), parseFloat(args[4]), args[5], args[6], parseInt(args[7]), parseInt(args[8]), parseInt(args[9]), parseInt(args[10]), parseInt(args[11]), parseInt(args[12])));
			SceneManager._scene.attemptToCreateMinimap(false);
			break;
		}
		case "deletepoi":
			SE.Minimap.POI[$gameMap._mapId] = SE.Minimap.POI[$gameMap._mapId].filter(function(poi) { return poi.id != args[1]; });
			break;
		case "poidesc":
			SE.Minimap.Window.getPOIByID(parseInt(args[1])).desc = args.join(SINGLE_SPACE).substr(2 + args[0].length + args[1].length);
			break;
		case "poi_tp": // POI_TP <poi_id x_offset, y_offset, direction, fadeType>
			SE.Minimap.Window.getPOIByID(parseInt(args[1])).tp = [parseInt(args[2]), parseInt(args[3]), parseInt(args[4]), parseInt(args[5])];
			break;
		case "refreshevents":
			SE.Minimap.Window.loadEvents();
			break;
		case "increasescroll":
			SE.Minimap.Window.manualAddScroll(parseFloat(args[1]), parseFloat(args[2]));
			break;
		case "setscroll":
			SE.Minimap.Window.manualSetScroll(parseFloat(args[1]), parseFloat(args[2]));
			break;
		case "generate_passability_overlay":
		case "gen_pass_ov":
			SE.Minimap.setPassabilityOverlay(args[1].toLowerCase() == "true");
			break;
		case "showmapmenu":
			SE.Minimap.Window.showMapMenuScene();
			break;
		case "setplayerblip":
			SE.Minimap.Window.setPlayerBlip(args[1]);
			break;
		case "setmapstyle":
			SE.Minimap.Window.mapStyle = args[1].toLowerCase();
			break;
		case "setfollowtarget":
		case "setcamera":
		{
			const followType = args[1].toLowerCase();
			if (followType === "coordinate")
			{
				SE.Minimap.Window.setCameraFollowTarget(followType, [parseInt(args[2]), parseInt(args[3])]);
			}
			else
			{
				SE.Minimap.Window.setCameraFollowTarget(followType, args[2]);
			}
			break;
		}
		case "fowshowtile":
			if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.updateFoWTile(parseInt(args[1]), parseInt(args[2]), true); }
			break;
		case "fowhidetile":
			if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.updateFoWTile(parseInt(args[1]), parseInt(args[2]), false); }
			break;
		case "fowrevealtiles":
			if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.fowChangeTilesBetweenCoords(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]), parseInt(args[4]), true); }
			break;
		case "fowhidetiles":
			if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.fowChangeTilesBetweenCoords(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]), parseInt(args[4]), false); }
			break;
		case "fowchangetiles":
			if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.fowChangeTilesBetweenCoords(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]), parseInt(args[4]), (args[5].toLowerCase() === "true")); }
			break;
		case "fowrevealall":
			if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.fowRevealEntireMap(); }
			break;
		case "fowreset":
		case "fowhideall":
		{
			const showTilesAroundPlayer = (typeof args[1] === "undefined") ? true : (args[1].toLowerCase() === "true");
			if (SE.Minimap.Window && SE.Minimap.Window.fowEnabled) { SE.Minimap.Window.fowHideEntireMap(showTilesAroundPlayer); }
			break;
		}
		case "rendervehicle":
			switch(args[1].toLowerCase())
			{
				case "all":
					SE.Minimap.Window.renderVehicles = args[2].toLowerCase() === "true";
					break;
				case "boat":
					SE.Minimap.Window.renderBoat = args[2].toLowerCase() === "true";
					break;
				case "ship":
					SE.Minimap.Window.renderShip = args[2].toLowerCase() === "true";
					break;
				case "airship":
					SE.Minimap.Window.renderAirship = args[2].toLowerCase() === "true";
					break;
				case "forceall":
					SE.Minimap.Window.alwaysRenderVehicles = args[2].toLowerCase() === "true";
					break;
				default:
					throw new Error("Unknown parameter for 'Minimap RenderVehicle': " + args[1]);
			}
			break;
		default:
			throw new Error("Minimap, unknown Plugin Command: " + args[0]);
	}
}

/*╔═════════════════╗
  ║ #Map Menu Scene ║
  ║                 ╚═════════════════════════╗
  ║ Note: Must be placed outside of the })(); ║
  ╚═══════════════════════════════════════════╝*/
function Scene_MiniMap() { this.initialize.apply(this, arguments); }

Scene_MiniMap.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MiniMap.prototype.constructor = Scene_MiniMap;

Scene_MiniMap.prototype.initialize = function()
{
    Scene_MenuBase.prototype.initialize.call(this);
	SoundManager.playOk();
};

Scene_MiniMap.prototype.create = function()
{
    Scene_MenuBase.prototype.create.call(this);
    this.createLeftWindow();
    this.createMapSectionWindow();
    this.createMapHelpWindow();
	this.refreshHelpWindow();
};

Scene_MiniMap.prototype.createLeftWindow = function()
{
    this._window_left = new Window_MinimapMenuLeft(0, 0);
    this._window_left.setHandler("ok",     this.onRangeOk.bind(this));
    this._window_left.setHandler("cancel", this.popScene.bind(this));
	this._window_left.setHandler("index_changed", this.index_changed.bind(this));
    this.addWindow(this._window_left);
};

Scene_MiniMap.prototype.createMapSectionWindow = function()
{
    const wx = this._window_left.width;
    const ww = Graphics.boxWidth - wx;
    this._mapSectionWindow = new Window_MapSection(wx, 0, ww);
    this._mapSectionWindow.setHandler("cancel", this.onEditCancel.bind(this));
    this._window_left.setMapWindow(this._mapSectionWindow);
    this.addWindow(this._mapSectionWindow);
};

Scene_MiniMap.prototype.createMapHelpWindow = function()
{
    this._mapHelpWindow = new Window_Base(this._mapSectionWindow.x, this._mapSectionWindow.height, this._mapSectionWindow.width, Graphics.boxHeight - this._mapSectionWindow.height);
    this.addWindow(this._mapHelpWindow);
};

Scene_MiniMap.prototype.index_changed = function()
{
    this.refreshHelpWindow();
};

Scene_MiniMap.prototype.onRangeOk = function()
{
    this._mapSectionWindow.activate();
    this._mapSectionWindow.select(0);
    this.refreshHelpWindow();
};

Scene_MiniMap.prototype.onEditCancel = function()
{
    this._window_left.activate();
    this._mapSectionWindow.deselect();
    this.refreshHelpWindow();
};

Scene_MiniMap.prototype.refreshHelpWindow = function()
{
    this._mapHelpWindow.contents.clear();
    this._mapHelpWindow.drawTextEx(this.helpText(), 4, 0);
};

Scene_MiniMap.prototype.helpText = function()
{
	const marker = this._window_left.marker();
	const tp_text = (marker.tp === null) ? EMPTY_STR : "\nTeleports you to: " + marker.tp[0] + "," + marker.tp[1];
	return this._window_left.marker().desc + tp_text;
};

/*╔═════════════════════╗
  ║ #Map Section Window ║
  ╚═════════════════════╝*/
function Window_MapSection() { this.initialize.apply(this, arguments); }

Window_MapSection.prototype = Object.create(Window_Selectable.prototype);
Window_MapSection.prototype.constructor = Window_MapSection;

Window_MapSection.prototype.maxItems = () => 0;

Window_MapSection.prototype.initialize = function(x, y, width)
{
    const height = SE.Minimap.Menu.WindowHeight_MapSection;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._marker = 1;
	this.mapScroll = {x:0, y:0};
	this.mapZoom = 1.0;
	this.centerLoc = {x:width / 2.0, y: height / 2.0};
    this.refresh();
};

// Hide the cursor
Window_MapSection.prototype.updateCursor = function()
{
	this.setCursorRect(0, 0, 0, 0);
};

Window_MapSection.prototype.refresh = function()
{
    this.contents.clear();
	this.drawMap();
};

// Prevent anything from being drawn in the base-class
Window_MapSection.prototype.drawAllItems = function(){};

Window_MapSection.prototype.drawMap = function()
{
	this.contents.blt(SE.Minimap.Menu.Bmp, 0, 0, SE.Minimap.Menu.Bmp.width, SE.Minimap.Menu.Bmp.height, this.mapScroll.x, this.mapScroll.y, SE.Minimap.Menu.Bmp.width * this.mapZoom, SE.Minimap.Menu.Bmp.height * this.mapZoom);
};

Window_MapSection.prototype.centerOnMarker = function(marker)
{
	this.mapScroll.x = this.centerLoc.x - marker.map_x - marker.w / 2.0;
	this.mapScroll.y = this.centerLoc.y - marker.map_y - marker.h / 2.0;
	this.refresh();
};

Window_MapSection.prototype.setMarker = function(marker)
{
    if (this._marker !== marker)
	{
        this._marker = marker;
		this.centerOnMarker(marker);
    }
};

Window_MapSection.prototype.update = function()
{
    Window_Selectable.prototype.update.call(this);
    if (this.active) {
		if (Input.isPressed("up")) { this.mapScroll.y += 10; this.refresh(); }
		if (Input.isPressed("right")) { this.mapScroll.x -= 10; this.refresh(); }
		if (Input.isPressed("down")) { this.mapScroll.y -= 10; this.refresh(); }
		if (Input.isPressed("left")) { this.mapScroll.x += 10; this.refresh(); }
		if (Input.isPressed(SE.Minimap.Menu.ManualScrollKey_Reset)) { this.mapScroll.x = 0; this.mapScroll.y = 0; this.refresh(); }
		
		if (Input.isPressed(SE.Minimap.Menu.ManualZoomKey_In))
		{
			this.mapZoom += 0.05;
			if (this.mapZoom > SE.Minimap.Menu.ManualZoom_Max) { this.mapZoom = SE.Minimap.Menu.ManualZoom_Max; }
			this.refresh();
		}
		if (Input.isPressed(SE.Minimap.Menu.ManualZoomKey_Out))
		{
			this.mapZoom -= 0.05;
			if (this.mapZoom < SE.Minimap.Menu.ManualZoom_Min) { this.mapZoom = SE.Minimap.Menu.ManualZoom_Min; }
			this.refresh();
		}
		if  (Input.isPressed(SE.Minimap.Menu.ManualZoomKey_Reset)) { this.mapZoom = 1.0; this.refresh(); }
    }
};

/*╔════════════════╗
  ║ #Miscellaneous ║
  ╚════════════════╝*/
//----------------------------------------------------------------------------------------------------
// Scene_Base: Remove Window
//----------------------------------------------------------------------------------------------------
// Omg why does RPG Maker not have this method by default...
Scene_Base.prototype.removeWindow = function(window)
{
	const index = this.children.indexOf(window);
	if (index > -1) { this.children.splice(index, 1); }
};
/*╔═════════════╗
  ║ End of File ║
  ╚═════════════╝*/