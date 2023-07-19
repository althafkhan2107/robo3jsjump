
/**
 * @author  raizensoft.com
 */
define([
  'rs/rj3d/entity/Cloud'
],
  function(Cloud) {

    "use strict";

    var DEFAULT_ITEMS = 2;

    /**
     * Pool of object
     * @class CloudPool
     * @constructor
     */
    function CloudPool(pb) {

      this.pb = pb;
      this.init();
    }

    /**
     * Init the pool
     * @method init
     */
    CloudPool.prototype.init = function() {

      this.pool = [];
      var pb = this.pb;

      for (var i = 0; i < DEFAULT_ITEMS; i++) {

        var p = new Cloud(this.pb);
        this.pool.push(p);
      }
    };

    /**
     * Return a new piece
     * @method obtain
     */
    CloudPool.prototype.obtain = function() {

      if (this.pool.length > 0) {

        var p = this.pool.pop();
        p.reset();
        return p;
      }
      else {
        var p = new Cloud(this.pb);
        p.reset();
        return p;
      }
    };

    /**
     * Free pool object
     * @method free
     */
    CloudPool.prototype.free = function(p) {
      this.pool.push(p);
    };

    return CloudPool;

  });
