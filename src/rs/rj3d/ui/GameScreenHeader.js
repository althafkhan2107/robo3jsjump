
/**
 * @author  raizensoft.com
 */
define([
  'rs/rj3d/ui/HeartBar',
  'rs/rj3d/ui/HeaderTimeButton',
  'rs/rj3d/ui/HeaderLevelButton'
],
  function(
    HeartBar,
    HeaderTimeButton,
    HeaderLevelButton) {

    "use strict";

    /**
     * GameScreenHeader component
     * @class GameScreenHeader
     * @constructor
     */
    function GameScreenHeader(gs) {

      this.gs = gs;
      this.init();
    }

    /**
     * Build header components
     * @method init
     */
    GameScreenHeader.prototype.init = function() {

      // Root container
      var el = this.el = document.createElement('div');
      el.className = 'rs-rj3d-gameheader';

      this.levelBtn = new HeaderLevelButton(this);
      el.appendChild(this.levelBtn.el);

      // Health bar
      this.hbar = new HeartBar(this.gs);
      //el.appendChild(this.hbar.el);
    };

    /**
     * Return client size dimension
     * @method getClientSize
     */
    GameScreenHeader.prototype.getClientSize = function() {
      return [this.el.clientWidth, this.el.clientHeight];
    };

    /**
     * Show the header
     * @method show
     */
    GameScreenHeader.prototype.show = function() {

      anime({
        targets:this.el,
        top:4,
        easing:'easeOutQuint',
        duration:800
      });
    };

    /**
     * Hide the header
     * @method hide
     */
    GameScreenHeader.prototype.hide = function() {

      anime({
        targets:this.el,
        top:-60,
        easing:'easeOutQuint',
        duration:800
      });
    };

    return GameScreenHeader;

  });

