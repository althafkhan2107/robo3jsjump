
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * LevelScreen class
     * @class LevelScreen
     * @constructor
     */
    function LevelScreen(rj3d, config) {

      this.rj3d = rj3d;
      this.config = rj3d.config;
      this.init();
    }

    /**
     * Init screen
     * @method init
     */
    LevelScreen.prototype.init = function() {
      
      var el = this.el = document.createElement('div');
      el.className = 'rs-lscreen';
      el.style.width = el.style.height = '100%';
      el.style.display = 'none';
      this.rj3d.root.appendChild(el);
    };

    /**
     * Show screen
     * @method show
     */
    LevelScreen.prototype.show = function() {

    };

    /**
     * Hide screen
     * @method hide
     */
    LevelScreen.prototype.hide = function() {

    };

    /**
     * Resizing handler
     * @method resize
     */
    LevelScreen.prototype.resize = function() {

    };

    return LevelScreen;

  });
