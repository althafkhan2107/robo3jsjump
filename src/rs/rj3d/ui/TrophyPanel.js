
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

    TrophyPanel.prototype = Object.create(BasePanel.prototype);
    TrophyPanel.prototype.constructor = TrophyPanel; 

    /**
     * A panel showing image
     * @class TrophyPanel
     * @constructor
     */
    function TrophyPanel(gs) {

      this.gs = gs;
      this.am = gs.rj3d.assetManager;
      this.currentScore = 0;
      BasePanel.prototype.constructor.call(this, 400, 500);
    }

    /**
     * Init image panel
     * @method init
     */
    TrophyPanel.prototype.init = function() {

      BasePanel.prototype.init.call(this);
      var el = this.el;
      el.classList.add('rs-trophy-panel');

      // Title
      this.title = document.createElement('h1');
      this.title.className = 'trophy-level-title';
      this.title.innerHTML = 'Level Up';

      // Meta info container
      var met = this.meta = document.createElement('div');
      met.className = 'meta-container';
      el.appendChild(met);

      var timeLeft = this.timeLeft = document.createElement('span');
      timeLeft.innerHTML = 'Time Left: 0';
      met.appendChild(timeLeft);

      var score = this.score = document.createElement('span');
      score.innerHTML = 'Your Score: 0';
      met.appendChild(score);
      
      // Trophy element
      var tc = document.createElement('div');
      tc.className = 'trophy-container';

      var trophy = document.createElement('img');
      trophy.src = 'assets/graphics/trophy.jpg';
      trophy.draggable = false;
      tc.appendChild(trophy);
      el.appendChild(tc);

      var lvl = document.createElement('span');
      lvl.className = 'level-label';
      lvl.innerHTML = 1;
      //tc.appendChild(lvl);
      this.lvl = lvl;

      var bc = this.btnContainer = document.createElement('div');
      bc.className = 'trophy-button-container';
      el.appendChild(bc);

      // Replay button
      this.replayBtn = new GameButton('icon-undo', this.doReplay.bind(this));
      this.replayBtn.addClass('rs-rj3d-mainbutton-extra');
      bc.appendChild(this.replayBtn.el);

      // Next icon
      this.nextBtn = new GameButton('icon-nextlevel', this.doNext.bind(this));
      this.nextBtn.addClass('rs-rj3d-mainbutton-extra');
      bc.appendChild(this.nextBtn.el);

      // Hide close button
      this.closeBtn.style.display = 'none';
    };

    /**
     * Show panel
     * @method show
     */
    TrophyPanel.prototype.show = function() {

      document.body.appendChild(this.ol);
      document.body.appendChild(this.el);
      const scale = this.gs.dopt.gameScale;
      anime.remove(this.el);
      anime({
        targets:this.el,
        opacity:[0, 1],
        translateX:'-50%',
        translateY:'-50%',
        scale:[0, scale],
        duration:800,
        easing:'easeOutQuint'
      });
    };

    /**
     * Hide panel
     * @method hide
     */
    TrophyPanel.prototype.hide = function() {
      BasePanel.prototype.hide.call(this);
    };

    /**
     * Replay current level
     * @method doReplay
     */
    TrophyPanel.prototype.doReplay = function() {

      this.am.btnClick.play();
      this.gs.replayLevel();
    };

    /**
     * Next level
     * @method doNext
     */
    TrophyPanel.prototype.doNext = function() {

      this.am.btnClick.play();
      this.gs.nextLevel();
    };

    /**
     * Set trophy values
     * @method setValues
     */
    TrophyPanel.prototype.setValues = function(timeLeft, score) {

      this.timeLeft.innerHTML = 'Time Left: ' + timeLeft; 
      this.score.innerHTML = 'Your Score: ' + score;
    };

    /**
     * Count score
     */
    TrophyPanel.prototype.countScore = function(timeLeft) {
      
      var tp = this;
      this.gs.am.coincount.play();
      clearTimeout(this.countId);

      function countTick() {

        timeLeft--;
        tp.currentScore++;
        tp.setValues(timeLeft, tp.currentScore);
        if (timeLeft > 0) 
          setTimeout(countTick, 40);
        else {
          if (tp.gs.am.coincount.isPlaying)
            tp.gs.am.coincount.stop();
        }
      }
      countTick();
    };

    return TrophyPanel;
  });
