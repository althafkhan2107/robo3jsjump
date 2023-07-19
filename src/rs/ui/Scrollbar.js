
/**
 * A simple scrollbar component
 * @author raizensoft.com
 */
define([
  'rs/utils/ObjectUtil',
  'rs/utils/BrowserUtil'
],
  function (ObjectUtil, BrowserUtil) {

  "use strict";

  var BAR_HEIGHT = 1;
  var SC_SIZE = 12;
  var NB_SIZE = 30;
  var me;

  function Scrollbar(opt, callback) {

    me = BrowserUtil.getMouseTouchEvents();

    // Retrieve initial width or apply default value
    this.dopt = {
      value:0,
      offset:0,
      width:100,
      range:50,
      fixed:0,
      unit:''
    };
    ObjectUtil.merge(opt, this.dopt);

    // Initial values
    this.width = this.dopt.width;
    this.range = this.dopt.range;
    this.unit = this.dopt.unit;
    this._value = 0;
    this._enabled = true;
    this.callback = callback;
    this.build();
  }

  /**
   * Build component
   * @private
   */
  Scrollbar.prototype.build = function() {

    var sb = this;

    // Main element
    var el = document.createElement('div');
    el.className = 'rs-ui-scrollbar';
    el.style.position = 'relative';
    el.style.width = this.width + 'px';
    el.style.height = SC_SIZE + 'px';
    this.el = el;

    // Bar
    var bar = document.createElement('div');
    bar.style.width = this.width + 'px';
    bar.style.height = BAR_HEIGHT + 'px';
    bar.style.position = 'absolute';
    bar.style.top = (SC_SIZE - BAR_HEIGHT) * 0.5 + 'px';
    el.appendChild(bar);
    this.bar = bar;

    // Value box
    var nb = document.createElement('span');
    var nbs = nb.style;
    nbs.display = 'block';
    nbs.fontSize = '12px';
    nbs.position = 'absolute';
    nbs.left = sb.width + 14 + 'px';
    nbs.MozUserSelect = nbs.MsUserSelect = nbs.WebkitUserSelect = 'none';
    nb.innerHTML = 0 + " " + this.unit;
    this.nb = nb;
    el.appendChild(nb);

    // Scrubber
    var sc = document.createElement('span');
    sc.className = 'rs-ui-scrollbar-scrubber';
    sc.style.position = 'absolute';
    sc.style.display = 'block';
    sc.style.width = SC_SIZE + 'px';
    sc.style.height = SC_SIZE + 'px';
    sc.style.borderRadius = SC_SIZE * 2 + 'px';
    sc.style.cursor = 'pointer';
    this.sc = sc;
    el.appendChild(sc);

    // Scrubber event
    var originX, originVal;

    function mouseMoveHandler(e) {

      var r;
      if (e.clientX == undefined) {
        r = (e.changedTouches[0].clientX - originX) / sb.width; 
      }
      else
      r = (e.clientX - originX) / sb.width;
      sb.value = originVal + r;
    }

    function mouseUpHandler(e) {

      window.removeEventListener(me.mmove, mouseMoveHandler);
      window.removeEventListener(me.mup, mouseUpHandler);
    }

    sc.addEventListener(me.mdown, function (e) {

      if (!sb.enabled) return;
      if (e.clientX == undefined)
        originX = e.touches[0].clientX;
      else
        originX = e.clientX;

      originVal = sb.value;
      window.addEventListener(me.mmove, mouseMoveHandler);
      window.addEventListener(me.mup, mouseUpHandler);
    });

    // Apply initial value
    this.applyValue(this.dopt.value);
  };

  /**
   * Apply value without invoking callback
   * @method applyValue
   */
  Scrollbar.prototype.applyValue = function(val) {

    if (typeof val === "number" && val >= 0 && val <= 1) {

      this._value = val;
      this.sc.style.left = this.width * val + 'px';
      this.nb.innerHTML = (val * this.range - this.dopt.offset).toFixed(this.dopt.fixed) + " " + this.unit;
    }
  };

  Object.defineProperties(Scrollbar.prototype, {

    /**
     * Set enabled or disabled scrollbar
     * @property enabled
     * @type type
     */
    'enabled':{
    
      get:function() { return this._enabled; },
      set:function(value) {

        this._enabled = value;
        if (value) {
          this.el.style.opacity = 1;
        }
        else {
          this.el.style.opacity = 0.25;
        }
      }
    },
    'valRange':{
      get:function() {
        return this._value * this.dopt.range - this.dopt.offset;
      }
    },
    'fvalRange':{
      get:function() {
        return (this._value * this.range - this.dopt.offset).toFixed(this.dopt.fixed);
      }
    },
    'rvalRange':{
      get:function() {
        return Math.round(this.valRange)
      }
    },
    'value':{
      get:function () {
        return this._value;
      },
      set:function (val) {

        this.applyValue(val);
        if (typeof val === "number" && val >= 0 && val <= 1) 
          this.callback.call(this, val, this.valRange);
      }
    }
  });

  return Scrollbar;

});

