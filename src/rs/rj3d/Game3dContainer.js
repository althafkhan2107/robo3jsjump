
/**
 * @author  raizensoft.com
 */
define([
  'rs/rj3d/GameBoard'], 

  function(
    GameBoard) {

    "use strict";

    Game3dContainer.prototype = Object.create(THREE.Group.prototype);
    Game3dContainer.prototype.constructor = Game3dContainer; 

    /**
     * Generic and root container for all 3d game items
     * @class Game3dContainer
     * @constructor
     */
    function Game3dContainer(g3d) {

      // References to Gallery3D
      this.g3d = g3d;
      this.init();
    }

    /**
     * Init the container
     * @method init
     */
    Game3dContainer.prototype.init = function() {

      // Call parent constructor
      THREE.Group.prototype.constructor.call(this);

      //  Add GameBoard component
      this.gameBoard = new GameBoard(this.g3d);
      this.add(this.gameBoard);
    };

    /**
     * Show puzzle board with transitioning effect
     * @method transitionIn
     */
    Game3dContainer.prototype.show = function() {

      this.visible = false;
      const g3c = this;

      setTimeout(function() {
        g3c.visible = true;
      }, 140);
    };

    /**
     * Set losing state
     * @method setLoseState
     */
    Game3dContainer.prototype.setLoseState = function() {

      anime.remove(this.rotation);
      anime({
        targets:this.rotation,
        x:-Math.PI / 3,
        easing:'easeOutQuint',
        duration:800
      });

      var tZ = this.position.z - 100;
      anime.remove(this.position);
      anime({
        targets:this.position,
        z:tZ,
        easing:'easeOutQuint',
        duration:800
      });
    };
    
    return Game3dContainer;

  });
