
/**
 * @author  raizensoft.com
 */
define([
  'rs/rj3d/ui/HomeScreenHeader',
  'rs/rj3d/ui/HomeScreenMenu',
  'rs/rj3d/ui/HelpPanel',
  'rs/rj3d/ui/CreditPanel'
  ],
  function(
    HomeScreenHeader,
    HomeScreenMenu, 
    HelpPanel, 
    CreditPanel) {

    "use strict";

    var SHOW_DELAY = 1500;

    /**
     * Game home screen
     * @class HomeScreen
     * @constructor
     */
    function HomeScreen(rj3d) {

      this.rj3d = rj3d;
      this.loaded = false;
      this.config = rj3d.config;
      this.init();
    }

    /**
     * Setup home screen components
     * @method init
     */
    HomeScreen.prototype.init = function() {

      var hs = this;
      var el = this.el = document.createElement('div');
      el.className = 'rs-hscreen';
      el.style.width = el.style.height = '100%';
      el.style.display = 'none';

      // Header 
      this.header = new HomeScreenHeader(this);

      // Menu
      this.menu = new HomeScreenMenu(this);
      
      // Panel
      this.hpanel = new HelpPanel();

      // Credit
      this.cpanel = new CreditPanel(this.rj3d);
    };

    /**
     * Load assets
     * @method load
     */
    HomeScreen.prototype.load = function() {

      this.el.style.display = 'block';
      this.el.appendChild(this.header.el);
      this.header.center();

      // AssetManager callbacks
      var am = this.rj3d.assetManager;
      var hs = this;
      var header = this.header;
      var menu = this.menu;

      am.onLoad = function() {

        setTimeout(function() {

          am.showDelay = true;

          header.moveTop();

          // Show menu
          hs.el.appendChild(menu.el);
          menu.show();

          // Play background music
          if (am.bgSound) am.bgSound.play();

        }, SHOW_DELAY);
      };

      am.onProgress = function(url, loaded, total) {
        hs.header.setProgress(loaded/total * 100);
      }
      this.rj3d.assetManager.load();
    };

    /**
     * Perform transition in
     * @method transitionIn
     */
    HomeScreen.prototype.transitionIn = function() {

      this.el.style.display = 'block';
      anime({
        targets:this.el,
        translateY:0,
        easing:'easeOutQuint',
        opacity:1,
        duration:1200
      });
    };

    /**
     * Perform transition out
     * @method transitionOut
     */
    HomeScreen.prototype.transitionOut = function() {

      var el = this.el;
      anime({
        targets:this.el,
        translateY:-400,
        easing:'easeOutQuint',
        opacity:0,
        duration:1200,
        complete:function() {
          el.style.display = 'none';
        }
      });
    };

    /**
     * Show screen
     * @method show
     */
    HomeScreen.prototype.show = function() {

      this.rj3d.root.appendChild(this.el);
      if (!this.rj3d.assetManager.loaded) {
        this.load();
        return;
      }
      this.transitionIn();
    };

    /**
     * Hide screen
     * @method hide
     */
    HomeScreen.prototype.hide = function() {

      this.rj3d.root.removeChild(this.el);
      this.transitionOut();
    };

    /**
     * Start new game
     * @method startNewGame
     */
    HomeScreen.prototype.startNewGame = function() {
      this.rj3d.setGameScreen();
    };

    /**
     * Show setting panel
     * @method showSetting
     */
    HomeScreen.prototype.showSetting = function() {
      this.spanel.show();
    };

    /**
     * Show help panel
     * @method showHelp
     */
    HomeScreen.prototype.showHelp = function() {
      this.hpanel.show();
    };

    /**
     * Show credit panel
     * @method showCredit
     */
    HomeScreen.prototype.showCredit = function() {
      this.cpanel.show();
    };

    /**
     * Resize screen handler
     * @method resize
     */
    HomeScreen.prototype.resize = function(rw, rh) {

      //var theScale = this.rj3d.defaultOptions.gameScale;
      //this.el.style.transform = `scale(${theScale})`;
    };

    return HomeScreen;
  });
