
/**
 * @author  raizensoft.com
 */
define([
  'rs/rj3d/ui/GameButton'
],
  function(GameButton) {

    "use strict";

    /**
     * GameScreenButtonBar class
     * @class GameScreenButtonBar
     * @constructor
     */
    function GameScreenButtonBar(gs) {

      this.gs = gs;
      this.init();
    }

    /**
     * Init the buttons
     * @method init
     */
    GameScreenButtonBar.prototype.init = function() {

      // Root container
      var el = this.el = document.createElement('div');
      el.className = 'rs-rj3d-gamebuttonbar';

      var am = this.gs.rj3d.assetManager;

      // Game mode button
      this.modeBtn = new GameButton('icon-mode', this.newGame.bind(this));
      this.modeBtn.addClass('rs-rj3d-mainbutton-extra');
      el.appendChild(this.modeBtn.el);

      this.levelBtn = new GameButton('icon-stack', this.showGameLevels.bind(this));
      this.levelBtn.addClass('rs-rj3d-mainbutton-extra');
      //el.appendChild(this.levelBtn.el);

      // Info Button
      this.infoBtn = new GameButton('icon-info', this.showHelp.bind(this));
      //el.appendChild(this.infoBtn.el);

      // Home Button
      this.homeBtn = new GameButton('icon-home', this.showHome.bind(this));
      el.appendChild(this.homeBtn.el);

      // Sound button
      this.soundBtn = new GameButton('icon-sound-on', this.toggleSound.bind(this));
      this.soundBtn.isOn = true;
      el.appendChild(this.soundBtn.el);
    };

    /**
     * Show button bar
     * @method show
     */
    GameScreenButtonBar.prototype.show = function() {

      anime({
        targets:this.el,
        right:20,
        easing:'easeOutQuint',
        duration:800
      });
    };

    /**
     * Hide button bar
     * @method hide
     */
    GameScreenButtonBar.prototype.hide = function() {

      anime({
        targets:this.el,
        right:-50,
        easing:'easeOutQuint',
        duration:800
      });
    };

    /**
     * Show category
     * @method newGame
     */
    GameScreenButtonBar.prototype.newGame = function(e) {

      var am = this.gs.rj3d.assetManager;
      am.btnClick.play();
      this.gs.loadLevel();
    };

    /**
     * Show levels selector
     * @method showGameLevels
     */
    GameScreenButtonBar.prototype.showGameLevels = function() {

      var am = this.gs.rj3d.assetManager;
      am.btnClick.play();
      this.gs.levelPanel.show();
    };

    /**
     * Show home page
     * @method showHome
     */
    GameScreenButtonBar.prototype.showHome = function(e) {

      var am = this.gs.rj3d.assetManager;
      am.btnClick.play();
      this.gs.rj3d.setHomeScreen();
    };

    /**
     * Show help panel
     * @method showHelp
     */
    GameScreenButtonBar.prototype.showHelp = function(e) {

      var am = this.gs.rj3d.assetManager;
      am.btnClick.play();
      this.gs.hpanel.show();
      this.gs.game3d.setPauseState();
    };

    /**
     * Toggle sound on/off
     * @method toggleSound
     */
    GameScreenButtonBar.prototype.toggleSound = function() {

      var am = this.gs.rj3d.assetManager;
      var btn = this.soundBtn;
      btn.isOn = !this.soundBtn.isOn;
      if (btn.isOn) {
        btn.removeClass('icon-sound-off');
        btn.addClass('icon-sound-on');
        am.btnClick.play();
      }
      else {
        btn.removeClass('icon-sound-on');
        btn.addClass('icon-sound-off');
      }
      am.toggleSound();
    };

    /**
     * Return client width and height
     * @method getClientSize
     */
    GameScreenButtonBar.prototype.getClientSize = function() {
      return [this.el.clientWidth, this.el.clientHeight];
    };

    return GameScreenButtonBar;

  });
