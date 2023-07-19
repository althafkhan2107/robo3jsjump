
/**
 * @author  raizensoft.com
 */
define([
  'rs/rj3d/entity/Platform'
],
  function(Platform) {

    "use strict";

    var DEFAULT_ITEMS = 2;

    /**
     * Pool of object
     * @class PlatformPool
     * @constructor
     */
    function PlatformPool(pb) {

      this.pb = pb;
      this.init();
    }

    /**
     * Init the pool
     * @method init
     */
    PlatformPool.prototype.init = function() {

      this.pool = [];
      var pb = this.pb;

      for (var i = 0; i < DEFAULT_ITEMS; i++) {

        var p = new Platform(this.pb);
        this.pool.push(p);
      }
    };

    /**
     * Return a new piece
     * @method obtain
     */
    PlatformPool.prototype.obtain = function() {

      if (this.pool.length > 0) {

        var p = this.pool.pop();
        p.reset();
        return p;
      }
      else {
        var p = new Platform(this.pb);
        p.reset();
        return p;
      }
    };

    /**
     * Free pool object
     * @method free
     */
    PlatformPool.prototype.free = function(p) {
      this.pool.push(p);
    };

    return PlatformPool;

  });
