/**
 * @author  raizensoft.com
 */
define([
	"rs/three/BaseApp",
	"rs/utils/ObjectUtil",
	"rs/utils/BrowserUtil",
	"rs/game3d/Firework3DSet",
	"rs/rj3d/CoinCounter",
	"rs/rj3d/Game3dContainer",
], function (
	BaseApp,
	ObjectUtil,
	BrowserUtil,
	Firework3DSet,
	CoinCounter,
	Game3dContainer
) {
	"use strict";

	const CAM_Z = 2500;

	Game3d.prototype = Object.create(BaseApp.prototype);
	Game3d.prototype.constructor = Game3d;

	var Game3dState = {
		RUNNING: 0,
		WON: 1,
		LOSE: 2,
		PAUSE: 3,
		READY: 4,
	};

	/**
	 * Main game components
	 * @class Game3d
	 * @constructor
	 */
	function Game3d(gs) {
		this.gs = gs;
		this.config = gs.config;
		this.rj3d = gs.rj3d;
		this.dopt = this.rj3d.defaultOptions;
		this.am = this.rj3d.assetManager;

		// Default temporary dimension
		var w = 500,
			h = 300;
		BaseApp.prototype.constructor.call(this, w, h);
		this.setCameraMatchProjection();

		// Default cursor
		this.defaultCursor = "auto";

		// Build basic threejs components
		this.buildScene();
		//this.enableOrbitControl();

		this.initMouseDrag();
	}

	/**
	 * Enable orbit controls
	 * @method enableOrbitControl
	 */
	Game3d.prototype.enableOrbitControl = function () {
		this.controls = new OrbitControls(this.camera, this.el);
		this.controls.enableDamping = true;
	};

	/**
	 * Build scene
	 * @method buildScene
	 */
	Game3d.prototype.buildScene = function () {
		const am = this.am;

		// Parent container of all 3d items
		this.container = new Game3dContainer(this);

		// Clock utility
		this.clock = new THREE.Clock();

		// Coin counter
		this.cc = new CoinCounter();
		document.body.appendChild(this.cc.el);

		// Add game container to main scene
		var scene = this.scene;
		scene.add(this.container);
		 scene.background = new THREE.Color().set(0x233426);
		//scene.background = new THREE.FogExp2(0x0400bf, 0.001);
		scene.fog = new THREE.Fog(scene.background, 1, 5000);
		// scene.fog = new THREE.Fog(scene.background, 1, 4000);

		// Sky and ground
		this.buildSkyAndGround();
		// this.buildBg();
		// Setup raycasting
		this._setUpRaycaster();

		// Force resizing upon building scene
		this.resizeHandler();
	};

	/**
	 * @method buildSkyAndGround
	 */
	Game3d.prototype.buildSkyAndGround = function () {
		var scene = this.scene;
		var am = this.am;

		// Add light
		var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
		//hemiLight.color.setHSL( 0.6, 1, 0.6 );
		//hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set(0, 500, 0);
		scene.add(hemiLight);

		// Directional light
		var dirLight = new THREE.DirectionalLight(0xffffff, 1);
		//dirLight.color.setHSL( 0.1, 1, 0.95 );
		dirLight.position.set(0, 3, 1);
		dirLight.position.multiplyScalar(100);
		scene.add(dirLight);

		// Ground
		const groundTexture = this.am.grass;
		groundTexture.encoding = THREE.LinearEncoding;
		groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
		groundTexture.repeat.set(5, 5);
		groundTexture.anisotropy = 16;

		var groundGeo = new THREE.PlaneBufferGeometry(4000, 4000);
		var groundMat = new THREE.MeshBasicMaterial({ map: groundTexture });

		var ground = new THREE.Mesh(groundGeo, groundMat);
		ground.isGround = true;
		ground.position.y = -5;
		ground.rotation.x = -Math.PI / 2;
		scene.add(ground);
	};

	// setup new vg image for game
	Game3d.prototype.buildBg = function () {
		// Load the background texture
		var scene = this.scene;
		var am = this.am;

		var bgtexture = this.am.halloweenbg;
		var backgroundMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2, 0),
			new THREE.MeshBasicMaterial({
				map: bgtexture
			}));

		backgroundMesh .material.depthTest = false;
		backgroundMesh .material.depthWrite = false;

		var groundGeo = new THREE.PlaneBufferGeometry(4000, 4000);
		var groundMat = new THREE.MeshBasicMaterial({ map: backgroundMesh });
		// var ground = new THREE.Mesh(groundGeo, groundMat);
		backgroundMesh.position.y = 5;
		scene.add(backgroundMesh);


	}


	/**
	 * Setup raycasting
	 * @method _setUpRaycaster
	 * @private
	 */
	Game3d.prototype._setUpRaycaster = function () {
		var camera = this.camera;
		var raycaster = this.raycaster;
		var container = this.scene;
		var el = this.el;

		var g3d = this;
		var pb = this.container.gameBoard;
		var me = BrowserUtil.getMouseTouchEvents();

		function doRaycast(e) {
			var oX, oY;
			if (e.touches) {
				oX = e.touches[0].clientX;
				oY = e.touches[0].clientY;
			} else if (e.changedTouches) {
				oX = e.changedTouches[0].clientX;
				oY = e.changedTouches[0].clientY;
			} else {
				oX = e.offsetX;
				oY = e.offsetY;
			}
			var mouse = {
				x: (oX / g3d.width) * 2 - 1,
				y: -(oY / g3d.height) * 2 + 1,
			};
			raycaster.setFromCamera(mouse, camera);

			// Compute intersections
			var intersects = raycaster.intersectObjects(container.children, true);

			for (var i = 0; i < intersects.length; i++) {
				var item = intersects[i].object;

				// Hit test for ground and pest object
				if (e.type == "pointerdown") {
				}

				// Mouse over out handler
				if (e.type == "pointermove") {
					g3d.isHover = true;
				}
				break;

				/*
          - object : intersected object (THREE.Mesh)
          - distance : distance from camera to intersection (number)
          - face : intersected face (THREE.Face3)
          - faceIndex : intersected face index (number)
          - point : intersection point (THREE.Vector3)
          - uv : intersection point in the object's UV coordinates (THREE.Vector2)
          */
			}

			// Mouseout
			if (intersects.length == 0 && e.type == "pointermove") {
				g3d.isHover = false;
				//el.style.cursor = 'grab';
			}
		}

		// Mouse click, over, out
		el.addEventListener("pointerdown", doRaycast);
		//el.addEventListener('pointermove', doRaycast);
	};

	/**
	 * Init mouse dragging function
	 * @method initMouseDrag
	 */
	Game3d.prototype.initMouseDrag = function () {
		const mdown = "pointerdown",
			mmove = "pointermove",
			mup = "pointerup";
		const el = this.el;
		const g3d = this,
			container = this.container,
			gb = this.container.gameBoard;
		var oX, clientX;

		function mouseDownHandler(e) {
			if (!g3d.isRunningState()) return;
			g3d.isDragging = true;
			if (e.touches) {
				clientX = e.touches[0].clientX;
			} else {
				clientX = e.clientX;
			}
			oX = clientX;
			el.addEventListener(mmove, mouseMoveHandler);
			el.addEventListener(mup, mouseUpHandler);
			window.addEventListener(mmove, mouseMoveHandler);
			window.addEventListener(mup, mouseUpHandler);
			//gb.robot.jump();
		}

		function mouseMoveHandler(e) {
			if (!g3d.isRunningState()) return;
			if (e.changedTouches) {
				clientX = e.changedTouches[0].clientX;
			} else {
				clientX = e.clientX;
			}
			const delta = clientX - oX;
			gb.robot.shift(delta);
		}

		function mouseUpHandler(e) {
			gb.robot.saveX();
			g3d.isDragging = false;
			el.removeEventListener(mmove, mouseMoveHandler);
			el.removeEventListener(mup, mouseUpHandler);
			window.removeEventListener(mmove, mouseMoveHandler);
			window.removeEventListener(mup, mouseUpHandler);
		}

		el.addEventListener(mdown, mouseDownHandler);
		this.disableDragEvent = mouseUpHandler;
	};

	/**
	 * Load level
	 * @method loadLevel
	 */
	Game3d.prototype.loadLevel = function (callback) {
		this.rj3d.inTransition = true;

		const g3d = this;
		const cam = this.camera;

		this.container.visible = false;
		this.setReadyState();

		this.container.gameBoard.prepareBoard(function () {
			g3d.container.show();

			anime.remove(cam.position);
			anime({
				targets: cam.position,
				z: [0, CAM_Z],
				delay: 100,
				easing: "easeOutQuad",
				duration: 2000,
				complete: function () {
					g3d.setRunningState();
					g3d.container.gameBoard.mp.visible = true;
				},
			});

			// Apply transition in
			callback.call(g3d);
		});
	};

	/**
	 * Override _renderRequest
	 * @method _renderRequest
	 */
	Game3d.prototype._renderRequest = function () {
		BaseApp.prototype._renderRequest.call(this);

		const rb = this.container.gameBoard.robot;
		var delta = this.clock.getDelta();
		if (delta > 0.2) return;

		if (this.state == Game3dState.LOSE) {
			rb.mixer.update(delta);
			return;
		}

		if (this.controls) this.controls.update();

		// Update game board
		if (this.isRunningState()) {
			this.container.gameBoard.update(delta);
		}
		if (this.isReadyState()) rb.mixer.update(delta);
		this.camera.position.y = rb.position.y + 500;
	};

	/**
	 * Set current state to running
	 * @method setRunningState
	 */
	Game3d.prototype.setRunningState = function () {
		this.state = Game3dState.RUNNING;
		this.inTransition = false;
		this.gs.header.show();
	};

	/**
	 * Test running state
	 * @method isRunningState
	 */
	Game3d.prototype.isRunningState = function () {
		return this.state == Game3dState.RUNNING;
	};

	/**
	 * Return pause state
	 * @method isPauseState
	 */
	Game3d.prototype.isPauseState = function () {
		return this.state == Game3dState.PAUSE;
	};

	/**
	 * Set pause state
	 * @method setPauseState
	 */
	Game3d.prototype.setPauseState = function () {
		this.lastState = this.state;
		this.state = Game3dState.PAUSE;
	};

	/**
	 * Toggle pause state
	 * @method togglePauseState
	 */
	Game3d.prototype.togglePauseState = function () {
		if (this.isPauseState()) this.restoreLastState();
		else this.setPauseState();
	};

	/**
	 * Restore last state
	 * @method restoreLastState
	 */
	Game3d.prototype.restoreLastState = function () {
		this.state = this.lastState;
	};

	/**
	 * Set current state to be ready
	 * @method setReadyState
	 */
	Game3d.prototype.setReadyState = function () {
		this.state = Game3dState.READY;
	};

	/**
	 * Ready state
	 * @method isReadyState
	 */
	Game3d.prototype.isReadyState = function () {
		return this.state == Game3dState.READY;
	};

	/**
	 * Set current state to won
	 * @method setWonState
	 */
	Game3d.prototype.setWonState = function () {
		if (this.state !== Game3dState.RUNNING) return;

		// Stop timer
		this.state = Game3dState.WON;
		this.inTransition = true;

		// Setup UI
		this.gs.header.hide();
		this.gs.showWonBar();
		this.am.wintune.play();

		// Unlock next level
		this.gs.unlockNextLevel();
	};

	/**
	 * Set lose state
	 * @method setLoseState
	 */
	Game3d.prototype.setLoseState = function () {
		this.state = Game3dState.LOSE;
		this.inTransition = true;

		// Setup UI
		this.gs.header.hide();
		this.gs.showLoseBar();
		this.am.losetune.play();

		// Reset coin counter
		this.cc.coin = 0;
	};

	/**
	 * Resize game
	 * @method resize
	 */
	Game3d.prototype.resize = function (rw, rh, bp) {
		this.width = rw;
		this.height = rh;
		this.camera.aspect = rw / rh;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(rw, rh);
		this.resizeHandler();
		this.fitCamera();
		if (bp) this.resizeBreakpoint(bp);
	};

	/**
	 * description
	 */
	Game3d.prototype.resizeBreakpoint = function (bp) {
		var con = this.container;
		if (
			bp == "LG" ||
			bp == "XL" ||
			bp == "XXL" ||
			bp == "X3L" ||
			bp == "X4L" ||
			bp == "X5L"
		) {
			con.position.z = 0;
			return;
		}

		switch (bp) {
			case "MD":
				con.position.z = -300;
				break;

			case "SM":
				con.position.z = -500;
				break;

			case "XS":
				con.position.z = -1000;
				break;
		}
		console.log(bp, con.position.z);
	};

	/**
	 * Get container Z position based on current game dimension
	 */
	Game3d.prototype.getContainerZ = function () {};

	/**
	 * Override resizeHandler
	 * @method resizeHandler
	 */
	Game3d.prototype.resizeHandler = function (e) {
		BaseApp.prototype.resizeHandler.call(this);
		this.setCameraMatchProjection();
	};

	/**
	 * Fit camera position
	 */
	Game3d.prototype.fitCamera = function () {
		var d = this.dopt;
		var cam = this.camera;
		cam.position.y = 500;
		//cam.rotation.x = -Math.PI * 30 / 180;
		cam.position.z = CAM_Z;
	};

	/**
	 * Show this element
	 * @method show
	 */
	Game3d.prototype.show = function () {
		this.el.style.display = "block";
	};

	/**
	 * Hide this element
	 * @method hide
	 */
	Game3d.prototype.hide = function () {
		this.el.style.display = "none";
	};

	/**
	 * Destroy the game component and save resoureces
	 * @method destroy
	 */
	Game3d.prototype.destroy = function () {};

	return Game3d;
});
