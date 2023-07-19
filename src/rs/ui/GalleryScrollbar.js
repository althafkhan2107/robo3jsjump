
/**
 * @author  raizensoft.com
 */
define([
  'rs/utils/ObjectUtil',
  'rs/utils/BrowserUtil',
  'rs/utils/MouseUtil'
],
  function(ObjectUtil, BrowserUtil, MouseUtil) {

    "use strict";

    var pf = BrowserUtil.getPrefix();
    var mdown, mup, mmove;

    /**
     * Gallery Scrollbar
     * @class GalleryScrollbar
     * @constructor
     */
    function GalleryScrollbar(opt, callback) {

      // Default options
      this.dopt = {
        barWidth:300,
        minScrubberWidth:50,
        steps:5,
        barHeight:18,
        roundCorner:16,
        borderColor:'#999'
      };
      ObjectUtil.merge(opt, this.dopt);

      this.callback = callback;
      this._value = 0;

      // Determine event types
      if (BrowserUtil.isMobile()) {
        mdown = 'touchstart';
        mup = 'touchend';
        mmove = 'touchmove';
      }
      else {
        mdown = 'mousedown';
        mup = 'mouseup';
        mmove = 'mousemove';
      }
      this.build();
    }

    /**
     * Build the scrollbar
     * @method opt
     */
    GalleryScrollbar.prototype.build = function() {

      var dopt = this.dopt;
      this.width = dopt.barWidth;
      this._steps = dopt.steps;

      // Root element
      var el = this.el = document.createElement('div');
      el.className = 'rs-ui-gsbar';
      el.style.height = dopt.barHeight + 'px';
      el.style.borderRadius = dopt.roundCorner + 'px';
     
      // Bar
      var bar = document.createElement('div');
      bar.style.height = dopt.barHeight + 'px';
      el.appendChild(bar);
      this.bar = bar;
      calBarWidth(this, dopt.barWidth);

      // Scrubber
      var sc = document.createElement('span');
      sc.style.height = dopt.barHeight + 'px';
      sc.style.borderRadius = dopt.roundCorner + 'px';
      this.sc = sc;
      el.appendChild(sc);
      calScrubberWidth(this, dopt.steps);

      // Scrubber event handler
      var originX, originVal;
      var gsb = this;

      function mouseMoveHandler(e) {

        //e.preventDefault(); //Intervention warning
        var clientX;
        if (e.changedTouches)
          clientX = e.changedTouches[0].clientX;
        else
          clientX = e.clientX;

        var r = (clientX - originX) / (gsb.width - sc.width); 
        gsb.value = originVal + r;
      }

      function mouseUpHandler(e) {

        document.body.style[pf + 'UserSelect'] = 'auto';
        window.removeEventListener(mmove, mouseMoveHandler);
        window.removeEventListener(mup, mouseUpHandler);
      }

      sc.addEventListener(mdown, function (e) {

        // Disable userselect
        e.preventDefault();
        var clientX;
        if (e.touches)
          clientX = e.touches[0].clientX;
        else
          clientX = e.clientX;
        var r = (clientX - originX) / (gsb.width - sc.width); 
        document.body.style[pf + 'UserSelect'] = 'none';
        originX = clientX;
        originVal = gsb.value;
        window.addEventListener(mmove, mouseMoveHandler);
        window.addEventListener(mup, mouseUpHandler);
      });

      // Bar event handler
      bar.addEventListener('click', function(e) {

        var val = ((e.offsetX - sc.width * 0.5) / (gsb.width - sc.width));
        val = (val > 1) ? 1 : ((val < 0) ? 0 : val);
        gsb.value = val;
      });
    };

    function calScrubberWidth (gsb, steps) {

      var sc = gsb.sc;
      var w = Math.floor(gsb.width / steps);
      if (w < gsb.dopt.minScrubberWidth)
        w = gsb.dopt.minScrubberWidth;
      sc.width = w;
      sc.style.width = sc.width + 'px';
    }

    function calBarWidth (gsb, width) {

      var bar = gsb.bar;
      gsb.el.style.width = bar.style.width = width + 'px';
    }

    Object.defineProperties(GalleryScrollbar.prototype, {

      /**
       * Bar width
       * @property barWidth
       * @type Number
       */
      'barWidth':{
      
        get:function() { return this._barWidth; },
        set:function(value) {

          this._barWidth = this.width = value;
          calBarWidth(this, value);
          calScrubberWidth(this, this.steps);
        }
      },

      /**
       * Scrollbar steps
       * @property steps
       * @type Number
       */
      'steps':{
      
        get:function() { return this._steps; },
        set:function(value) {

          this._steps = value;
          calScrubberWidth(this, value);
          // Reset position
          this.value = 0;
        }
      },

      'value':{
        get:function () {
          return this._value;
        },
        set:function (val) {

          this.applyValue(val);

          if (typeof val === "number" && val >= 0 && val <= 1) 
            // Invoke callback
            if (this.callback) this.callback.call(this, val);
        }
      }
    });

    /**
     * Apply value without involking callback
     * @method applyValue
     *
     */
    GalleryScrollbar.prototype.applyValue = function(val) {

      if (typeof val === "number" && val >= 0 && val <= 1) {

        this._value = val;
        this.sc.style.left = (this.width - this.sc.width) * val + 'px';
      }
    };

    return GalleryScrollbar;

  });
