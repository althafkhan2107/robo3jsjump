
/**
 * @author  raizensoft.com
 */
define([
  'rs/game3d/MotionParticles',
  'rs/rj3d/entity/CloudPool',
  'rs/rj3d/entity/PlatformPool',
  'rs/rj3d/entity/Robot'],

  function(
    MotionParticles,
    CloudPool,
    PlatformPool,
    Robot) {

    "use strict";

    GameBoard.prototype = Object.create(THREE.Group.prototype);
    GameBoard.prototype.constructor = GameBoard; 

    /*
     * GameBoard class
     * @class GameBoard
     * @constructor
     */
    function GameBoard(g3d) {

      this.g3d = g3d;
      this.am = g3d.am;
      this.dopt = g3d.dopt;
      this.init();
    }

    /**
     * Build puzzle board
     * @method init
     */
    GameBoard.prototype.init = function() {

      THREE.Group.prototype.constructor.call(this);

      // Build scene
      this.buildScene();
    };

    /**
     * Build scene
     * @method buildScene
     */
    GameBoard.prototype.buildScene = function() {

      // Robot
      const rb = this.robot = new Robot(this);
      this.add(rb);

      // Pool object
      this.ppool = new PlatformPool(this);
      this.ppieces = [];

      // Cloud pool
      this.cpool = new CloudPool(this);
      this.cpieces = [];

      // Motion particles
      this.mp = new MotionParticles();
      rb.add(this.mp);
    };

    /**
     * Prepare new levels
     * @method updatePieces
     */
    GameBoard.prototype.prepareBoard = function(callback) {

      var pb = this;
      var am = this.am;
      var d = this.dopt;

      // Reset entity 
      this.resetMatch();

      // Platform tracking
      this.track = [];

      // Free up pool object
      for (let i = 0; i < this.ppieces.length; i++) {

        const p = this.ppieces[i];
        this.remove(p);
        this.ppool.free(p);
      }
      this.ppieces.splice(0);

      for (let i = 0; i < this.cpieces.length; i++) {

        const c = this.cpieces[i];
        this.remove(c);
        this.cpool.free(c);
      }
      this.cpieces.splice(0);

      const interval = d.switchInterval;

      // Genrate default levels
      for (let i = 0; i < 20; i++) {
        this.generate(i, (i % interval === 0));
      }

      // Trigger callback
      if (callback)
        callback.call(pb.g3d);

      pb.visible = true;
    }

    /**
     * Generate next level
     */
    GameBoard.prototype.generate = function(level, isSingle) {

      const colors = [0, 1, 2, 3];
      const distance = this.dopt.platformDistance;
      
      function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }
      shuffleArray(colors);

      if (isSingle) {
        if (this.lastColor === colors[0])
          this.lastColor = colors[1];
        else
          this.lastColor = colors[0];
      }
      
      // Platform
      this.track[level] = [];
      for (let i = 0; i < 4; i++) {

        const p = this.ppool.obtain();
        if (isSingle) {
          p.switchColor(this.lastColor);
        }
        else
          p.switchColor(colors[i]);
        p.place(level, i);
        p.isSingle = isSingle;
        this.track[level][i] = p;
        this.add(p);
        this.ppieces.push(p);
      }

      // Cloud
      const cloud = this.cpool.obtain();
      cloud.position.y = distance * (level + 1) + Math.random() * distance;
      cloud.position.x = Math.random() * 1000 - 500;
      this.add(cloud);
      this.cpieces.push(cloud);
    };

    var pointVector = new THREE.Vector3();

    /**
     * Process robot landing
     */
    GameBoard.prototype.robotLand = function(level, col) {
      
      if (col < 0 || col > 3) {
        this.robot.playDeath();
        this.g3d.setLoseState();
        return;
      }
      this.robot.jump();
      if (this.track[level]) {

        const p = this.track[level][col];
        p.visible = false;
        if (p.isSingle) {
          this.robot.switchColor(p.colorId);
          this.am.hitcoin.play();
        }
        else {

          if (p.colorId === this.robot.colorId) {

            this.currentScore += 4;
            this.g3d.gs.header.levelBtn.setScore(this.currentScore);

            // Coin counter
            this.robot.getWorldPosition(pointVector);
            pointVector.project(this.g3d.camera);
            var hw = this.g3d.width * 0.5;
            var hh = this.g3d.height * 0.5;
            var xp = pointVector.x * hw + hw;
            var yp = -pointVector.y * hh + hh - 20;
            this.g3d.cc.show(xp, yp, this.currentScore);
          }
          else {
            this.robot.playDeath();
            this.g3d.setLoseState();
          }
        }

        // New levels
        if (this.track[level + 2] === undefined) {

          console.log('Generate new levels');
          const interval = this.dopt.switchInterval;
          for (let i = 0; i < 20; i++) {
            this.generate(i + level + 2, ((i + level + 2) % interval === 0));
          }
        }
      }
    };

    /**
     * Reset match
     * @method resetMatch
     */
    GameBoard.prototype.resetMatch = function() {

      // Reset game objects
      this.robot.reset();
      this.robot.play('Running');
      this.currentScore = 0;
      this.lastColor = -1;
      this.mp.visible = false;
    };

    /**
     * Update
     * @method update
     */
    GameBoard.prototype.update = function(delta) {

      var d = this.dopt;
      this.robot.update(delta);
      this.mp.update(delta);
    };

    return GameBoard;

  });
