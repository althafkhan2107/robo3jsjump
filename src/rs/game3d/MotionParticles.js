/**
 * @author  raizensoft.com
 */
define(function () {
	"use strict";

	MotionParticles.prototype = Object.create(THREE.Group.prototype);
	MotionParticles.prototype.constructor = MotionParticles;

	/**
	 * MotionParticles object
	 * @class MotionParticles
	 * @constructor
	 */
	function MotionParticles(config) {
		this.config = Object.assign(
			{
				numParticles: 10,
				size: 100,
				gravity: 50,
			},
			config
		);
		this.init();
	}

	/**
	 * Init
	 */
	MotionParticles.prototype.init = function () {
		THREE.Group.prototype.constructor.call(this);

		const c = this.config;

		// Setup points
		const p = (this.points = new THREE.Points());
		this.add(p);

		p.geometry = new THREE.Geometry();
		const v = p.geometry.vertices;

		for (let i = 0; i < c.numParticles; i++) {
			const pi = new THREE.Vector3();
			pi.delay = i * 0.25;
			pi.delayCount = 0;
			pi.vy = 0;
			pi.z = Math.random() * 50 - 25;
			pi.x = Math.random() * 100 - 50;
			v.push(pi);
		}
		p.geometry.verticesNeedUpdate = true;

		const tex = new THREE.TextureLoader().load("assets/graphics/lensflare.png");
		const material = new THREE.PointsMaterial({
			size: c.size,
			color: 0xffffff,
			opacity: 1,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			map: tex,
		});
		p.material = material;
		p.material.needsUpdate = true;
		for (let i = 0; i < 500; i++) this.update(0.01);
	};

	/**
	 * Update particles
	 */
	MotionParticles.prototype.update = function (delta) {
		const v = this.points.geometry.vertices;
		const c = this.config;
		for (let i = 0; i < v.length; i++) {
			const p = v[i];
			p.delayCount += delta;
			if (p.delayCount < p.delay) continue;
			p.vy += -delta * c.gravity;
			p.y += p.vy;
			if (p.y < -500) {
				p.y = 0;
				p.vy = 0;
				p.x = Math.random() * 100 - 50;
			}
		}
		this.points.geometry.verticesNeedUpdate = true;
	};

	return MotionParticles;
});
