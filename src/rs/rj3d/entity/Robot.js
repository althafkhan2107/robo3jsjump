/**
 * @author  raizensoft.com
 */
define(function () {
	"use strict";
	const MODEL_SCALE = 325;
	const GRAVITY = 50;
	const JUMP_VALUE = 35;
	const SHIFT_DELTA = 1.75;
	const PLATFORM_WIDTH = 320;

	Robot.prototype = Object.create(THREE.Group.prototype);
	Robot.prototype.constructor = Robot;

	var clipNames = ["Death", "Jump", "Running"];

	/**
	 * Robot class
	 * @class Robot
	 * @constructor
	 */
	function Robot(pb) {
		this.pb = pb;
		this.am = this.pb.am;
		this.init();
	}

	/**
	 * Init ball component
	 * @method init
	 */
	Robot.prototype.init = function () {
		THREE.Group.prototype.constructor.call(this);

		var d = this.pb.dopt;
		var am = this.am;
		var model = (this.model = am.Robot);

		// Save parameters
		this.colors = d.robotColors;

		// Robot model
		this.add(model);
		this.mixer = new THREE.AnimationMixer(this.model);

		// Bounding Box
		const w = 200,
			h = 350,
			t = 150;
		const bound = (this.bound = new THREE.Mesh(
			new THREE.BoxBufferGeometry(w, h, t),
			new THREE.MeshBasicMaterial({ color: 0xffcc00, wireframe: true })
		));
		bound.position.y = h * 0.5;
		bound.visible = false;
		this.add(bound);
		this.width = w;
		this.height = h;
		this.thickness = t;

		// Reset all variables
		this.reset();
	};

	/**
	 * Set robot color
	 * @method setColor
	 */
	Robot.prototype.setColor = function (color) {
		var model = this.model;
		var bodyColor = new THREE.Color(color);
		var eyesColor = new THREE.Color(0x333333);
		var handColor = new THREE.Color(0xfbb03b);
		var c0 = bodyColor.clone().add(new THREE.Color(0x333333));

		/** Update part color **/
		model.traverse(function (o) {
			if (o.isMesh) {
				// Rim
				if (
					o.name == "Object_0001_4" ||
					o.name == "Object_0001_14" ||
					o.name == "Object_0001" ||
					o.name == "Object_0001_11" ||
					o.name == "Object_0001_10"
				) {
					// console.log("here inside color IF");
					// o.material.color = c0;
				}
				// Eyes
				// else if (o.name == "Head_4") {
				// 	console.log("here inside color IF ELSE");
				// 	// o.material.color = eyesColor;
				// }
				else if(o.name == "Mesh007" || o.name == "Mesh007_1" || o.name == "Mesh007_2" || o.name == "Circle"
				 || o.name == "Mesh004"){
					// console.log("here inside color IF ELSE");
					// o.material.color = null;

				}
				// Body
				else {
					//this maps to material name from 3D model
					// console.log("here inside color ELSE",o.name);
					// o.material.color = bodyColor;
					// o.material.color = eyesColor;
					o.material.color = c0;

				}

				o.material.needsUpdate = true;
			}
		});
	};

	/**
	 * Switch color id
	 */
	Robot.prototype.switchColor = function (colorId) {
		this.colorId = colorId;
		const color = this.pb.dopt.robotColors[colorId];
		this.setColor(color);
	};

	/**
	 * Play a clip name
	 * @method play
	 */
	Robot.prototype.play = function (name) {
		if (this.currentAction) this.currentAction.fadeOut(0.5);

		var clip = THREE.AnimationClip.findByName(this.am.Robot_Animations, name);
		var action = this.mixer.clipAction(clip);
		this.currentAction = action;

		action.clampWhenFinished = true;
		action.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
	};

	/**
	 * Play death animation
	 */
	Robot.prototype.playDeath = function () {
		anime.remove(this.rotation);
		this.playOnce("Death");
	};

	/**
	 * Play animation once
	 * @method playOnce
	 */
	Robot.prototype.playOnce = function (name) {
		if (this.currentAction) this.currentAction.fadeOut(0.5);

		var clip = THREE.AnimationClip.findByName(this.am.Robot_Animations, name);
		var action = this.mixer.clipAction(clip);
		this.currentAction = action;

		action.clampWhenFinished = true;
		action
			.reset()
			.setLoop(THREE.LoopOnce, 1)
			.setEffectiveTimeScale(1)
			.setEffectiveWeight(1)
			.play();
	};

	/**
	 * Jump up
	 */
	Robot.prototype.jump = function () {
		// Play sound effect
		if (this.am.powerup.isPlaying) this.am.powerup.stop();
		this.am.powerup.play();

		this.vy = JUMP_VALUE * this.pb.dopt.jumpSpeed;
		this.playOnce("Jump");

		anime.remove(this.rotation);
		const angle = this.rotation.y;
		anime({
			targets: this.rotation,
			y: angle,
			easing: "easeOutQuad",
			duration: 1000,
		});
	};

	/**
	 * Shift Robot by fix amound
	 */
	Robot.prototype.shift = function (delta) {
		this.position.x = this.startX + delta * SHIFT_DELTA;
	};

	/**
	 * Save current X position
	 */
	Robot.prototype.saveX = function () {
		this.startX = this.position.x;
	};

	// /**
	//  * Play a random clips
	//  * @method robotRandom
	//  */
	// Robot.prototype.playRandom = function() {

	//   var name = clipNames[Math.floor(Math.random() * clipNames.length)];
	//   this.play(name);
	// };

	/**
	 * Reset color
	 * @method reset
	 */
	Robot.prototype.reset = function () {
		this.switchColor(3);
		this.angle = 0;
		this.position.set(0, 0, this.pb.dopt.robotZ);
		this.rotation.y = 0;
		this.model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE);
		this.vx = this.vy = 0;
		this.ax = 0;
		this.ay = -GRAVITY * this.pb.dopt.gravityScale;
		this.startX = 0;
		this.maxLevel = 0;
	};

	/**
	 * Update Robot status
	 * @method update
	 */
	Robot.prototype.update = function (delta) {
		if (this.mixer) this.mixer.update(delta);
		const d = this.pb.dopt;
		const dist = d.platformDistance;

		// Update spatial variables
		this.vy += this.ay * delta;
		this.position.y += this.vy;

		if (this.vy < 0) {
			const level = Math.floor(this.position.y / dist);

			if (level < this.maxLevel) {
				this.vy = 0;
				this.position.y = (level + 1) * dist;

				// Calculate column
				const col = Math.floor(this.position.x / PLATFORM_WIDTH) + 2;
				this.pb.robotLand(level, col);
			}
			if (this.maxLevel < level) this.maxLevel = level;
		}
	};

	return Robot;
});
