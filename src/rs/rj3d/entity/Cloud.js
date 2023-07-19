/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    const MODEL_SCALE = 100;

    Cloud.prototype = Object.create(THREE.Group.prototype);
    Cloud.prototype.constructor = Cloud;

    /**
     * Cloud game objet
     * @class Cloud
     * @constructor
     */
    function Cloud(pb) {

      this.pb = pb;
      this.init();
    }

    /**
     * Init
     */
    Cloud.prototype.init = function() {
      
      THREE.Group.prototype.constructor.call(this);

      const clouds = ['pumpkin', 'pumpkin', 'pumpkin'];
      // const pumpkin =['pumpkin'];
      const pick = clouds[Math.floor(Math.random() * clouds.length)];
      var model = this.model = THREE.SkeletonUtils.clone(this.pb.am[pick]);
      model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE,MODEL_SCALE);
      // var pmodel = this.model = THREE.SkeletonUtils.clone(this.pb.am[pick]);
      // this.add(pmodel);
      this.add(model);
      this.reset();
    };

    /**
     * Reset cloud
     */
    Cloud.prototype.reset = function() {
      this.position.z = this.pb.dopt.robotZ - Math.random() * 500 - 1000;
    };

    return Cloud;

  });
