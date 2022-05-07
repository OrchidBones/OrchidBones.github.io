"use strict";
// THIS SCRIPT IS DEPRECATED AND NO LONGER WORKS WITH THE LATEST VERSION OF RMMV. PLEASE USE YANFLY'S INSTEAD NOW:
// http://www.yanfly.moe/wiki/Undead_(MV_Plugin_Tips_%26_Tricks)
/*:
╔════════════════╗
║ Plugin Manager ║
╚════════════════╝
/*:
 * @plugindesc v1.10 - Undead Damage Plugin. Allows heals to damage undead-characters and (optionally) vice versa.
 * @author Squirting Elephant
   ╔════════════╗
   ║ Parameters ║
   ╚════════════╝
 * @param UndeadState_ID
 * @text Undead State ID
 * @desc ID of the undead-state in the database. Use the value -1 to disable the undead state. This state is purely for other plugins and effects.
 * @type number
 * @min -1
 * @default -1
 *
 * @help
 *--------------------------------------
 * Notetags
 *--------------------------------------
 * The following notetag can be placed in the Actors, Enemies and Classes note-fields in order to mark them as undead:
 * <is_undead>
 *
 * The following notetag can be placed in the skills and item note-fields:
 * <invert_for_undead>
 * Placing this notetag in that field will turn healing into damage and damage into healing (for undead). This only applies to items&skills tagged with this notetag.
 *
 *--------------------------------------
 * Dev Notes
 *--------------------------------------
 * You can check if an actor/enemy is an undead either by checking for the undeadState or through: $gameActors._data[actorId].isUndead
 *
 *--------------------------------------
 * Aliases created for:
 *--------------------------------------
 * * Game_Action.prototype.executeHpDamage()
 * * Game_Action.prototype.hasItemAnyValidEffects()
 * * Game_Action.prototype.itemEffectRecoverHp()
 * * Game_Actor.prototype.changeClass()
 * * Game_Actor.prototype.setup()
 * * Game_Battler.prototype.isStateAddable()
 * * Game_BattlerBase.prototype.clearStates()
 * * Game_Enemy.prototype.setup()
 * 
 *--------------------------------------
 * Version History
 *--------------------------------------
 * v1.10 (28 September 2019)
 * - Updated this plugin for the latest version of RMMV.
 *
 * v1.00 (21 December 2015)
 * - First release
 */

/*╔═══════════════════════╗
  ║ Plugin Initialization ║
  ╚═══════════════════════╝*/
var Imported = Imported || {};
Imported.SE_UndeadDamage = { name: 'SE_UndeadDamage', version: 1.10, author: 'Squirting Elephant', date:'2019-09-28'};
var SE = SE || {};
SE.UndeadDamage = SE.UndeadDamage || {};

/*╔════════════╗
  ║ Parameters ║
  ╚════════════╝*/
SE.Params = SE.Params || {};

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
  
	SE.Params.UndeadDamage = PluginManager.parameters('SE_UndeadDamage');
	for (var key in SE.Params.UndeadDamage) { SE.Params.UndeadDamage[key] = SE.Params.UndeadDamage[key].replace('\r', ''); } // Because: fix stupid RMMV bug (https://forums.rpgmakerweb.com/index.php?threads/parameter-string-does-not-equal-string.113697/)
	SE.Params.UndeadDamage = parseParameters(JSON.stringify(SE.Params.UndeadDamage));
  
	SE.UndeadDamage.StateID = SE.Params.UndeadDamage.UndeadState_ID;

/*╔═══════════╗
  ║ Utilities ║
  ╚═══════════╝*/
	SE.UndeadDamage.SetUndeadState = function(target)
	{
		if (SE.UndeadDamage.StateID != -1) { (target.isUndead) ? target.addState(SE.UndeadDamage.StateID) : target.removeState(SE.UndeadDamage.StateID); }
	};

/*╔════════════╗
  ║ Game Actor ║
  ╚════════════╝*/
	var SEA_Game_Actor_Setup = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId)
	{
		SEA_Game_Actor_Setup.apply(this, arguments);
		this.setUndead();
	}; 

	// This alias is required to prevent RM from clearing the undead-state after they have been set in the Actor.setup()
	var SEA_Game_BattlerBase_ClearStates = Game_BattlerBase.prototype.clearStates;
	Game_BattlerBase.prototype.clearStates = function()
	{
		if (!this._states)
		{
			SEA_Game_BattlerBase_ClearStates.apply(this, arguments);
		}
		else
		{
			var addUndeadStateAgain = false;
			if (this._states.indexOf(SE.UndeadDamage.StateID) > -1) { addUndeadStateAgain = true; }
			SEA_Game_BattlerBase_ClearStates.apply(this, arguments);
			if (addUndeadStateAgain) { this.addState(SE.UndeadDamage.StateID); }
		}
	};

	// This alias is required because the undead state must be added even when a character is dead,  the undead state should never be resisted, etc.
	var SEA_Game_Battler_IsStateAddable = Game_Battler.prototype.isStateAddable;
	Game_Battler.prototype.isStateAddable = function(stateId)
	{
		return (stateId == SE.UndeadDamage.StateID) || SEA_Game_Battler_IsStateAddable.apply(this, arguments);
	};

	Game_Actor.prototype.setUndead = function()
	{
		(('is_undead' in $dataActors[this._actorId].meta) || ('is_undead' in $dataClasses[this._classId].meta)) ? this.isUndead = true : this.isUndead = false;
		SE.UndeadDamage.SetUndeadState(this);
	};

	// Re-rest the undead-state if the actor's class changes. Because the undead-state could have originated from the actor's class.
	var SEA_Game_Actor_ChangeClass = Game_Actor.prototype.changeClass;
	Game_Actor.prototype.changeClass = function(classId, keepExp)
	{
		SEA_Game_Actor_ChangeClass.apply(this, arguments);
		this.setUndead();
	};

/*╔════════════╗
  ║ Game Enemy ║
  ╚════════════╝*/
	var SEA_Game_Enemy_Setup = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function(enemyId, x, y)
	{
		SEA_Game_Enemy_Setup.apply(this, arguments);
		this.setUndead();
	};

	// Note that unlike the Game_Actor.prototype.setUndead(), this method isn't required to delete the undead state if it's not an undead because enemies can't change class
	Game_Enemy.prototype.setUndead = function()
	{
		('is_undead' in $dataEnemies[this._enemyId].meta) ? this.isUndead = true : this.isUndead = false;
		SE.UndeadDamage.SetUndeadState(this);
	};

/*╔═════════════╗
  ║ Game Action ║
  ╚═════════════╝*/
	var SEA_Game_Action_ExecuteHpDamage = Game_Action.prototype.executeHpDamage;
	Game_Action.prototype.executeHpDamage = function(target, value)
	{
		if (target.isUndead && (('invert_for_undead' in this.item().meta))) { value *= -1; }
		SEA_Game_Action_ExecuteHpDamage.call(this, target, value);
	};

	var SEA_Game_Action_ItemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
	Game_Action.prototype.itemEffectRecoverHp = function(target, effect)
	{
		var newEffect = JsonEx.makeDeepCopy(effect);
		if (target.isUndead && ('invert_for_undead' in this.item().meta))
		{
			newEffect.value1 *= -1;
			newEffect.value2 *= -1;
		}

		SEA_Game_Action_ItemEffectRecoverHp.call(this, target, newEffect);	
	};

	// Make sure that tagged healing-potions and healing-skills can be used on undead-characters which have full hp
	var SEA_Game_Action_HasItemAnyValidEffects = Game_Action.prototype.hasItemAnyValidEffects;
	Game_Action.prototype.hasItemAnyValidEffects = function(target)
	{
		var item = this.item(); // cloning is not required because these items are new objects and are not the database itself. // var item = JsonEx.makeDeepCopy(this.item());
		if (target.isUndead && ('invert_for_undead' in item.meta)) //target.isStateAffected(SE.UndeadDamage.StateID)
		{
			if (item.effects.some(function (effect) { return effect.code == Game_Action.EFFECT_RECOVER_HP; } ) || item.damage.type == 3) // 3 == HP Recover
			{
				return true;
			}
		}
		
		return SEA_Game_Action_HasItemAnyValidEffects.apply(this, arguments);
	};

})();
/*╔═════════════╗
  ║ End of File ║
  ╚═════════════╝*/