
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * Preferences
     * @class Preferences
     * @constructor
     */
    function Preferences(config, dataString) {

      this.dataString = dataString;
      this.config = config;
      this.init(dataString);
    }

    /**
     * Init preferences
     * @method init
     */
    Preferences.prototype.init = function(dataString) {

      if (dataString == null) {
        this.data = {
          name:'RobotJump',
          bestScore:0,
          unlocked:[]
        };
        this.save();
      }
      else {
        this.data = JSON.parse(dataString);
      }
    };

    /**
     * Save new data to local storage
     * @method save
     */
    Preferences.prototype.save = function() {
      if (this.data != null)
        localStorage.setItem("RobotJump", JSON.stringify(this.data));
    };

    /**
     * Return unlocked status
     * @method isUnlocked
     */
    Preferences.prototype.isUnlocked = function(index) {

      if (index == 0) return true;
      if (this.data.unlocked[index] !== 1) return false;
      return true;
    };

    /**
     * Save unlock id to local storage
     * @method saveUnlock
     */
    Preferences.prototype.saveUnlock = function(index) {

      var ul = this.data.unlocked;
      ul[index] = 1;
      this.save();
    };

    return Preferences;

  });

