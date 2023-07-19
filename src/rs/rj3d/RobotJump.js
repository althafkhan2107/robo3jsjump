/**
 * @author  raizensoft.com
 */
define([
	"rs/rj3d/Preferences",
	"rs/rj3d/AssetManager",
	"rs/rj3d/screen/HomeScreen",
	"rs/rj3d/screen/GameScreen",
	"rs/ui/RingPreloader",
	"rs/utils/ObjectUtil",
	"rs/utils/BrowserUtil",
], function (
	Preferences,
	AssetManager,
	HomeScreen,
	GameScreen,
	RingPreloader,
	ObjectUtil,
	BrowserUtil
) {
	"use strict";

	const ASPECT_RATIO = 16 / 9;
	const RESIZE_TIMEOUT = 200;
	const CONFIG_PATH = "config.json";

	var pf = BrowserUtil.getPrefix();
	var mdown, mup, mmove;

	function RobotJump(input, options) {
		// Load main config.json
		this.loadConfig();

		// Mobile setup
		this.isMobile = BrowserUtil.isMobile();

		if (this.isMobile) {
			mdown = "touchstart";
			mup = "touchend";
			mmove = "touchmove";
		} else {
			mdown = "mousedown";
			mup = "mouseup";
			mmove = "mousemove";
		}

		this.mevents = {
			mdown: mdown,
			mup: mup,
			mmove: mmove,
		};

		// Init default options
		this.defaultOptions = {
			naturalWidth: 1280,
			naturalHeight: 720,
			gameScale: 1,
			camZ: 2500,
			robotZ: 1000,
			robotColors: [0xe0b500, 0x0056d6, 0xff2929, 0xeeeeee],
			platformColors: [0xe0b500, 0x0056d6, 0xff2929, 0xeeeeee],
		};

		options = options || {};
		ObjectUtil.merge(options, this.defaultOptions);

		// Setup root reference
		this.root = input;
		BrowserUtil.css(this.root, {
			position: "relative",
			display: "block",
			overflow: "hidden",
		});

		// Setup gallery resize handler
		var rj3d = this;
		window.addEventListener("resize", function (e) {
			rj3d.resize();
		});

		// Set up background music on mobile devices
		document.body.addEventListener("click", function (e) {
			//var bgSound = rj3d.assetManager.bgSound;
			//bgSound.context.resume();
			//if (bgSound && !bgSound.isPlaying)
			//bgSound.play();
			//}
		});
	}

	/**
	 * Load configurations
	 * @method loadConfig
	 */
	RobotJump.prototype.loadConfig = function () {
		// Load main config.json
		var rj3d = this;
		var req = new XMLHttpRequest();
		req.addEventListener("load", function (e) {
			var result = JSON.parse(this.response);
			rj3d.config = result;
			ObjectUtil.merge(rj3d.config.data, rj3d.defaultOptions);
			rj3d.initComponents();
		});
		req.open("GET", CONFIG_PATH);
		req.send();
	};

	/**
	 * Init compponents
	 * @method initComponent
	 */
	RobotJump.prototype.initComponents = function () {
		var rj3d = this;
		var dopt = this.defaultOptions;
		var config = this.config;

		// Preferences
		this.initPreferences();

		// Preloader
		this.initPreloader();

		// Default screen
		this.activeScreen = null;

		// Asset managers
		this.assetManager = new AssetManager(this);

		if (window.location.search.includes("bypass")) {
			this.assetManager.onLoad = function () {
				rj3d.setGameScreen();
			};
			this.assetManager.load();
		}
		// Home Screen as default screen
		else this.setHomeScreen();

		// Force resize on intialization
		setTimeout(function () {
			rj3d.resize();
		}, RESIZE_TIMEOUT);
	};

	/**
	 * Initialize preferences
	 * @method initPreferences
	 */
	RobotJump.prototype.initPreferences = function () {
		this.pref = new Preferences(this.config, localStorage.getItem("RobotJump"));
	};

	/**
	 * Init preloader component
	 * @method initPreloader
	 */
	RobotJump.prototype.initPreloader = function () {
		var rp = new RingPreloader({ borderColor: "#ccc" });
		var el = rp.el;
		this.preloader = el;
		el.style.top = "50%";
	};

	/**
	 * Show preloader
	 * @method showPreloader
	 */
	RobotJump.prototype.showPreloader = function () {
		this.root.appendChild(this.preloader);
	};

	/**
	 * Hide preloader
	 * @method hidePreloader
	 */
	RobotJump.prototype.hidePreloader = function () {
		if (this.root.contains(this.preloader))
			this.root.removeChild(this.preloader);
	};

	/**
	 * Shortcut to root element addEventListener method
	 * @method addEventListener
	 */
	RobotJump.prototype.addEventListener = function (event, listener) {
		this.root.addEventListener(event, listener);
	};

	/**
	 * Set active screen
	 * @method setScreen
	 */
	RobotJump.prototype.setScreen = function (screen) {
		if (this.activeScreen) {
			this.activeScreen.hide();
		}
		this.activeScreen = screen;
		screen.show();
	};

	/**
	 * Set active game screen
	 * @method setGameScreen
	 */
	RobotJump.prototype.setGameScreen = function () {
		if (!this.gameScreen) {
			this.gameScreen = new GameScreen(this);
		}
		this.setScreen(this.gameScreen);
	};

	/**
	 * Set home screen as active screen
	 * @method setHomeScreen
	 */
	RobotJump.prototype.setHomeScreen = function () {
		if (!this.homeScreen) this.homeScreen = new HomeScreen(this);
		this.setScreen(this.homeScreen);
	};

	/**
	 * Set hero screen
	 */
	RobotJump.prototype.setHeroScreen = function () {
		if (!this.gameScreen) {
			this.gameScreen = new GameScreen(this);
		}
		if (!this.heroScreen) this.heroScreen = new HeroScreen(this.gameScreen);
		this.setScreen(this.heroScreen);
	};

	/**
	 * Dispose resources
	 * @method dispose
	 */
	RobotJump.prototype.dispose = function () {};

	/**
	 * Resize handler
	 * @method resize
	 */
	RobotJump.prototype.resize = function () {
		var d = this.getAppDimension();
		var rw = d[0],
			rh = d[1];
		if (this.activeScreen) this.activeScreen.resize(rw, rh);
	};

	/**
	 * Return current app dimension
	 * @method getAppDimension
	 */
	RobotJump.prototype.getAppDimension = function () {
		var cs = BrowserUtil.computeStyle;
		var bo = cs(this.root, "borderTopWidth");
		var rw = cs(this.root, "width") - 2 * bo;
		var rh = cs(this.root, "height") - 2 * bo;
		this.defaultOptions.gameScale = rw / this.defaultOptions.naturalWidth;
		return [rw, rh];
	};

	return RobotJump;
});
