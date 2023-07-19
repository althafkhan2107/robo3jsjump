
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    const MODEL_SCALE = 40;
    const UNIT_LENGTH = 8;
    const TOTAL_COLUMNS = 4;

    Platform.prototype = Object.create(THREE.Group.prototype);
    Platform.prototype.constructor = Platform;

    /**
     * Platform game object
     * @class Platform
     * @constructor
     */
    function Platform(pb) {

      this.pb = pb;
      this.am = pb.am;
      this.init();
    }

    /**
     * Init game object
     */
    Platform.prototype.init = function() {
      
      THREE.Group.prototype.constructor.call(this);

      var model = this.model = THREE.SkeletonUtils.clone(this.am.MovingPlatform_Long);
      model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
      this.model.position.y = -45;
      this.add(model);

      const p = this;
      model.traverse(o => {
        if (o.isMesh && o.material) {
          o.material = o.material.clone();
          p[o.material.name] = o.material;
        }
      });
    };

    /**
     * Set platform color
     */
    Platform.prototype.setColor = function(color) {

      this.Color.color.set(color);
      this.DarkColor.color.set(this.Color.color.addScalar(-0.01));
    };

    /**
     * description
     */
    Platform.prototype.switchColor = function(colorId) {
      
      this.colorId = colorId;
      const color = this.pb.dopt.platformColors[colorId];
      this.setColor(color);
    };

    /**
     * Place platform at target ti, tj
     */
    Platform.prototype.place = function(ti, tj) {
      
      const d = this.pb.dopt;
      const oX = -(MODEL_SCALE * UNIT_LENGTH * (TOTAL_COLUMNS - 1)) * 0.5;
      //const oX = 0;
      this.position.x = oX + tj * (MODEL_SCALE * UNIT_LENGTH);
      this.position.y = (ti + 1) * d.platformDistance;
      this.position.z = d.robotZ;
    };

    /**
     * Bounce platform
     */
    Platform.prototype.bounce = function() {
      
      anime.remove(this.position);
      anime({
        targets:this.position,
        keyframes:[
          {y:-10},
        ],
        duration:1000
      });
    };

    /**
     * Fade platform
     */
    Platform.prototype.setOpacity = function(value) {
      
      this.Color.opacity = this.DarkColor.opacity = value;
      this.Color.needsUpdate = this.DarkColor.needsUpdate = true;
    };

    /**
     * Reset game object
     */
    Platform.prototype.reset = function() {

      this.position.set(0, 0, 0);
      this.visible = true;
      this.isSingle = false;
    };

    return Platform;

  });
