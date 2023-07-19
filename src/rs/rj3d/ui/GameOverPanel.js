
/**
 * @author  raizensoft.com
 */
define([
  'rs/game/BasePanel',
  'rs/rj3d/ui/GameButton'
],
  function(BasePanel, GameButton) {

    "use strict";

    var SCALE = 0.85;

    GameOverPanel.prototype = Object.create(BasePanel.prototype);
    GameOverPanel.prototype.constructor = GameOverPanel; 

    /**
     * A panel showing image
     * @class GameOverPanel
     * @constructor
     */
    function GameOverPanel(gs) {

      this.gs = gs;
      this.am = gs.rj3d.assetManager;
      BasePanel.prototype.constructor.call(this, 400, 500);
    }

    /**
     * Init image panel
     * @method init
     */
    GameOverPanel.prototype.init = function() {

      BasePanel.prototype.init.call(this);
      var el = this.el;
      el.classList.add('rs-trophy-panel');
      el.style.width = el.style.height = '90%';

      // Title
      this.title = document.createElement('h1');
      this.title.className = 'trophy-level-title';
      this.title.innerHTML = 'Level Up';

      // Meta info container
      var met = this.meta = document.createElement('div');
      met.className = 'meta-container';
      el.appendChild(met);

      var panelText = this.panelText = document.createElement('span');
      panelText.innerHTML = "Your Score: ";
      met.appendChild(panelText);

      // Trophy element
      var tc = document.createElement('div');
      tc.className = 'trophy-container';

      var trophy = document.createElement('img');
      trophy.src = 'assets/graphics/sad_robot.png';
      trophy.draggable = false;
      tc.appendChild(trophy);
      el.appendChild(tc);

      var bc = this.btnContainer = document.createElement('div');
      bc.className = 'trophy-button-container';
      el.appendChild(bc);

      // Replay button
      this.replayBtn = new GameButton('icon-undo', this.doReplay.bind(this));
      this.replayBtn.addClass('rs-rj3d-mainbutton-extra');
      bc.appendChild(this.replayBtn.el);

      // Hide close button
      this.closeBtn.style.display = 'none';
    };

    /**
     * Show panel
     * @method show
     */
    GameOverPanel.prototype.show = function() {

      document.body.appendChild(this.ol);
      document.body.appendChild(this.el);
      const scale = 1;
      anime.remove(this.el);
      anime({
        targets:this.el,
        opacity:[0, 1],
        translateX:'-50%',
        translateY:'-50%',
        //rotateX:[90, 0],
        scale:[0, scale],
        duration:800,
        easing:'easeOutQuint'
      });
      this.panelText.innerHTML = 'Your Score: ' + this.gs.getScore();
    };

    /**
     * Hide panel
     * @method hide
     */
    GameOverPanel.prototype.hide = function() {
      BasePanel.prototype.hide.call(this);
    };

    /**
     * Replay current level
     * @method doReplay
     */
    GameOverPanel.prototype.doReplay = function() {

      this.am.btnClick.play();
      this.gs.replayLevel();
    };

    return GameOverPanel;
  });
