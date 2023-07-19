
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * Coin counter
     * @class CoinCounter
     * @constructor
     */
    function CoinCounter() {
      this.init();
    }

    /**
     * Init component
     * @method init
     */
    CoinCounter.prototype.init = function() {

      var el = this.el = document.createElement('div');
      el.className = 'coin-counter';
      document.body.appendChild(el);
    };

    /**
     * Show the counter
     * @method show
     */
    CoinCounter.prototype.show = function(x, y, score) {

      this.el.innerHTML = "&plus; " + 4;
      var s = this.el.style;
      s.display = 'block';
      s.top = y + 'px';
      s.left = x + 'px';
      var cc = this;

      anime({
        targets:this.el,
        top:y - 100,
        opacity:[1, 0],
        easing:'easeOutQuad',
        duration:1200,
        complete:function() {
          cc.hide();
        }
      });
    };

    /**
     * Hide the counter
     * @method hide
     */
    CoinCounter.prototype.hide = function() {
      this.el.style.display = 'none';
    };

    return CoinCounter;

  });
