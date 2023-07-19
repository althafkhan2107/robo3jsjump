
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    const BAR_WIDTH = 80;
    const BAR_HEIGHT = 6;

    /**
     * MiniHealthBar
     * @class MiniHealthBar
     * @constructor
     */
    function MiniHealthBar(maxHealth) {

      this.maxHealth = this.currentHealth = maxHealth;
      this.init();
    }

    /**
     * Init components
     * @method init
     */
    MiniHealthBar.prototype.init = function() {
      
      var el = this.el = document.createElement('div');
      el.className = 'rs-mini-healthbar';
      el.style.width = BAR_WIDTH + 'px';
      el.style.height = BAR_HEIGHT + 'px';
      el.style.marginLeft = -BAR_WIDTH * 0.5 + 'px';
      
      var bar = this.bar = document.createElement('div');
      bar.className = 'inner-bar';
      bar.style.height = BAR_HEIGHT + 'px';
      el.appendChild(bar);
    };

    /**
     * Set bar value
     * @method setValue
     */
    MiniHealthBar.prototype.setValue = function(value) {
      this.bar.style.width = (value * 100) + '%';
    };

    /**
     * Show mini healthbar
     * @method show
     */
    MiniHealthBar.prototype.show = function(x, y) {
      
      var s = this.el.style;
      s.display = 'block';
      s.transform = 'translate(' + x + 'px, ' + y + 'px)';
      document.body.appendChild(this.el);
    };

    /**
     * Hide minibar
     */
    MiniHealthBar.prototype.hide = function() {
      this.el.style.display = 'none';
    };

    /**
     * Decrease current health
     */
    MiniHealthBar.prototype.decrease = function() {

      if (this.currentHealth > 0) this.currentHealth--;
      this.setValue(this.currentHealth / this.maxHealth);
      return this.currentHealth;
    };

    /**
     * Reset health bar
     */
    MiniHealthBar.prototype.reset = function() {

      this.currentHealth = this.maxHealth;
      this.setValue(1);
    };

    return MiniHealthBar;

  });
