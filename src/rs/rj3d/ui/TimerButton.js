
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * TimerButton object
     * @class TimerButton
     * @constructor
     */
    function TimerButton(gs) {

      this.gs = gs;
      this.am = gs.am;
      this.init();
    }

    /**
     * Init
     */
    TimerButton.prototype.init = function() {

      var el = this.el = document.createElement('div');
      el.className = 'rs-timer-button';
      el.style.backgroundImage = `url('${this.am.TimerButton.src}')`;

      var num = this.num = document.createElement('div');
      num.className = 'rs-timer-num';
      num.innerHTML = 99;
      el.appendChild(num);
    };

    /**
     * Start countdown
     */
    TimerButton.prototype.start = function(startValue, cb) {
      
      var tb = this;
      this.isPausing = false;
      startValue = startValue || 60;
      this.cb = cb;
      this.currentValue = startValue;
      this.num.innerHTML = startValue;
      clearTimeout(this.timerId);

      function tick () {

        if (!tb.isPausing) tb.currentValue--;
        tb.num.innerHTML = tb.currentValue;
        if (tb.currentValue > 0)
          tb.timerId = setTimeout(tick, 1000);
        else {
          if (cb) cb.call(tb);
        }
      }
      tick();
    };

    /**
     * Set pausing state
     */
    TimerButton.prototype.setPausing = function(flag) {
      this.isPausing = flag;
    };

    /**
     * Stop counting down
     */
    TimerButton.prototype.stop = function() {

      clearTimeout(this.timerId);
      this.isPausing = false;
    };

    return TimerButton;

  });
