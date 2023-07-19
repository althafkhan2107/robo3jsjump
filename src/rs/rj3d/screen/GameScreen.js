
/**
 * @author  raizensoft.com
 */
define([
  'rs/utils/BrowserUtil',
  'rs/game/ImagePanel',
  'rs/rj3d/ui/TimerButton',
  'rs/rj3d/ui/HelpPanel',
  'rs/rj3d/ui/LevelPanel',
  'rs/rj3d/ui/TrophyPanel',
  'rs/rj3d/ui/GameOverPanel',
  'rs/rj3d/ui/GameScreenButtonBar',
  'rs/rj3d/ui/GameScreenWonBar',
  'rs/rj3d/ui/GameScreenLoseBar',
  'rs/rj3d/ui/GameScreenHeader',
  'rs/rj3d/Game3d'],
  function(
    BrowserUtil,
    ImagePanel,
    TimerButton,
    HelpPanel,
    LevelPanel,
    TrophyPanel,
    GameOverPanel,
    GameScreenButtonBar,
    GameScreenWonBar,
    GameScreenLoseBar,
    GameScreenHeader,
    Game3d) {

    "use strict";

    /**
     * main Game screen
     * @class GameScreen
     * @constructor
     */
    function GameScreen(rj3d, config) {

      this.rj3d = rj3d;
      this.dopt = rj3d.defaultOptions;
      this.am = rj3d.assetManager;
      this.config = rj3d.config;
      this.init();
    }

    /**
     * Init game screen components
     * @method init
     */
    GameScreen.prototype.init = function() {

      // Root element
      var gs = this;
      var el = this.el = document.createElement('div');
      el.className = 'rs-gscreen';
      el.style.width = el.style.height = '100%';
      el.style.display = 'none';

      // Setup level data
      var level = this.config.data.level;
      this.levels = level;

      // Setup panels
      this.initPanel();

      // Setup animation
      this.initAnimation();

      // Header
      this.header = new GameScreenHeader(this);
      el.appendChild(this.header.el);
      
      // ButtonBar
      this.bbar = new GameScreenButtonBar(this);
      el.appendChild(this.bbar.el);

      // Wonbar
      this.wbar = new GameScreenWonBar(this);
      el.appendChild(this.wbar.el);

      // Lose bar
      this.lbar = new GameScreenLoseBar(this);
      el.appendChild(this.lbar.el);

      // Game3d
      this.game3d = new Game3d(this);
      el.appendChild(this.game3d.el);

      // Initial parameters
      this.currentLevel = 0;
    };

    /**
     * Init game panels
     * @method initPanel
     */
    GameScreen.prototype.initPanel = function() {

      var gs = this;

      // Image panel
      this.imagePanel = new ImagePanel(this.applyNewLevel.bind(this));

      // Trophy panel
      this.trophyPanel = new TrophyPanel(this);

      // Gameover panel
      this.gopanel = new GameOverPanel(this);

      // Level panel
      this.levelPanel = new LevelPanel(this);

      // Help Panel
      if (this.rj3d.homeScreen )
        this.hpanel = this.rj3d.homeScreen.hpanel;
      else
        this.hpanel = new HelpPanel(function() {
          gs.game3d.restoreLastState();
        });
    };

    /**
     * Init animation
     * @method initAnimation
     */
    GameScreen.prototype.initAnimation = function() {

    };

    /**
     * Load a level index
     * @method loadLevel
     */
    GameScreen.prototype.loadLevel = function(index) {

      var gs = this;

      // Hide current panels
      this.wbar.hide();
      this.lbar.hide();
      this.levelPanel.hide();
      this.trophyPanel.hide();
      this.gopanel.hide();

      this.currentLevel = index;

      // Show active bar
      this.showButtonBar();

      // Show preloader
      this.rj3d.showPreloader();

      function onLoadCallback () {

        gs.rj3d.hidePreloader();
        gs.reset();
        gs.header.levelBtn.setScore(0);
      }
      this.game3d.loadLevel(onLoadCallback);
    };

    /**
     * Replay current level
     * @method replay
     */
    GameScreen.prototype.replayLevel = function() {
      this.loadLevel(this.currentLevel);
    };

    /**
     * Load next level
     * @method nextLevel
     */
    GameScreen.prototype.nextLevel = function() {

      // Hide current board
      var index = this.currentLevel + 1;

      // Back to level 0
      if (index == this.levels.length)
        index = 0;
      this.loadLevel(index);
    };

    /**
     * Unlock the next level
     * @method unlockNextLevel
     */
    GameScreen.prototype.unlockNextLevel = function() {

      var index = this.currentLevel + 1;

      // Back to level 0
      if (index < this.levels.length) {
        this.rj3d.pref.saveUnlock(index);
      }
    };

    /**
     * Reset meta component
     * @method reset
     */
    GameScreen.prototype.reset = function() {
      this.header.hbar.reset();
    };

    /**
     * Show game screen
     * @method show
     */
    GameScreen.prototype.show = function(level) {

      // Force resizing
      this.applyNewLevel();
      //this.imagePanel.show('assets/graphics/tutor.png');
    };

    /**
     * New level
     * @method applyNewLevel
     */
    GameScreen.prototype.applyNewLevel = function() {

      this.el.appendChild(this.game3d.el);
      this.rj3d.root.appendChild(this.el);
      this.transitionIn();
      this.rj3d.resize();
      this.game3d.startRendering();
      this.loadLevel(0);
    };

    /**
     * Hide game screen
     * @method hide
     */
    GameScreen.prototype.hide = function() {

      this.rj3d.root.removeChild(this.el);
      this.game3d.stopRendering();
    };

    /**
     * Show game won bar
     * @method showWonBar
     */
    GameScreen.prototype.showWonBar = function() {

      this.bbar.hide();
      var wbar = this.wbar;
      setTimeout(function() {
        wbar.show("LEVEL PASSED");
      }, 400);
    };

    /**
     * Show game lose bar
     * @method showLoseBar
     */
    GameScreen.prototype.showLoseBar = function() {

      this.bbar.hide();
      var lbar = this.lbar;
      setTimeout(function() {
        lbar.show("GAME OVER");
      }, 400);
    };

    /**
     * Set health bar value
     * @method setHealthBar
     */
    GameScreen.prototype.setHealthBar = function(val) {
      this.header.hbar.setValue(val);
    };

    /**
     * Show button bar
     * @method showButtonBar
     */
    GameScreen.prototype.showButtonBar = function() {

      this.wbar.hide();
      var bbar = this.bbar;
      setTimeout(function() {
        bbar.show();
      }, 400);
    };

    /**
     * Get game score
     */
    GameScreen.prototype.getScore = function() {
      return this.game3d.container.gameBoard.currentScore;
    };

    /**
     * Transition in
     * @method transitionIn
     */
    GameScreen.prototype.transitionIn = function() {
      this.el.style.display = 'block';
    };

    /**
     * Transition out
     * @method transitionOut
     */
    GameScreen.prototype.transitionOut = function() {
      this.el.style.display = 'block';
    };

    /**
     * Resizing handler
     * @method resize
     */
    GameScreen.prototype.resize = function(rw, rh) {

      var d = this.rj3d.defaultOptions;

      // Determine current breakpoints
      var bp = BrowserUtil.bp;
      var s = ['XS', 'SM', 'MD', 'LG', 'XL', 'XXL', 'X3L', 'X4L', 'X5L'];
      for (var i = s.length - 1 ; i >=0; i --)
        if (rw >= bp[s[i]]) break;

      this.game3d.resize(rw, rh, s[i]);
    };

    /**
     * Dispose resources
     * @method dispose
     */
    GameScreen.prototype.dispose = function() {

    };

    return GameScreen;

  });
