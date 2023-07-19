
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * ResultItem
     * @class ResultItem
     * @constructor
     */
    function ResultItem(value) {
      this.init(value);
    }

    /**
     * Init
     */
    ResultItem.prototype.init = function(value) {

      var el = this.el = document.createElement('div');
      el.className = 'rs-result-item';
      el.innerHTML = value;
      this.setRandomBackground();

      function itemDown(e) {
        el.style.transform = 'scale(0.85)';
      }

      function itemUp(e) {
        el.style.transform = 'scale(1)';
      }

      el.addEventListener('pointerdown', itemDown);
      el.addEventListener('pointerup', itemUp);
    };

    /**
     * Set item value
     */
    ResultItem.prototype.setValue = function(value) {

      this.value = value;
      this.el.innerHTML = value;
    };

    /**
     * Set background
     */
    ResultItem.prototype.setBackground = function(color) {
      
      var st = 'url("assets/graphics/game-icons/' + color + 'Orb.svg")';
      this.el.style.background = st;
    };

    /**
     * Set random background orb
     */
    ResultItem.prototype.setRandomBackground = function() {
      
      const c = ['Red', 'Yellow', 'Green'];
      const p = c[Math.floor(Math.random() * c.length)];
      this.setBackground(p);
    };

    /**
     * Reset item
     */
    ResultItem.prototype.reset = function() {
      
    };

    return ResultItem;

  });
