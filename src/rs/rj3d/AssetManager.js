
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    var SOUNDS_PATH = 'assets/sounds';
    var GRAPHICS_PATH = 'assets/graphics';
    var MODEL_PATH = 'assets/model';

    /**
     * Central asset manager objec
     * @class AssetManager
     * @constructor
     */
    function AssetManager(rj3d) {

      this.rj3d = rj3d;
      this.init();
    }

    /**
     * Init sub components
     * @method init
     */
    AssetManager.prototype.init = function() {

      // Init LoadingManager
      var lm = this.loadingManager = new THREE.LoadingManager();

      var am = this;
      lm.onLoad = function() {

        am.loaded = true;
        console.log('Assets loaded');

        if (am.onLoad)
          am.onLoad.call(am);
      };

      lm.onProgress = function(url, loaded, total) {
        if (am.onProgress)
          am.onProgress.call(am, url, loaded, total);
      };

      this.soundOn = true;
      this.loaded = false;
    };

    /**
     * Start loading assets
     * @method load
     */
    AssetManager.prototype.load = function() {

      this.loadAudio();
      this.loadTextures();
      this.loadModel();
      this.loadImages();
    };

    /**
     * Load images assets
     */
    AssetManager.prototype.loadImages = function() {
      
      var am = this;
      var loader = new THREE.ImageLoader(am.loadingManager);
      var list = [];

      function loadCompleteHandler (img) {

        // Extract resource name
        var name = img.src.split('/').pop().split('.').shift();

        // Assign to AssetManager
        am[name] = img;
      }

      for (var i = 0; i < list.length; i++) {

        var path = list[i];
        loader.load(GRAPHICS_PATH + '/' + path, loadCompleteHandler);
      }
    };

    /**
     * Load audio facility
     * @method loadAudio
     */
    AssetManager.prototype.loadAudio = function() {

      var am = this;

      // Audio 
      var listener = new THREE.AudioListener();

      function loadAudio (src, callback) {

        var au = new THREE.Audio(listener);
        var audioLoader = new THREE.AudioLoader(am.loadingManager);
        audioLoader.load(src, function(buffer) {
          au.setBuffer(buffer);
          if (callback)
            callback.call(am);
        });
        return au;
      }

      // Background
      if (this.rj3d.config.general.useBackgroundMusic)
        this.bgSound = loadAudio(SOUNDS_PATH + '/bg.mp3', function() {
          this.bgSound.setLoop(true);
          this.bgSound.setVolume(0.5);
        });

      // Button sound
      this.btnClick = loadAudio(SOUNDS_PATH + '/btnClick.mp3');

      // Hit coin
      this.hitcoin = loadAudio(SOUNDS_PATH + '/hitcoin.mp3');

      // Power up
      this.powerup = loadAudio(SOUNDS_PATH + '/powerup.mp3');

      // Lose tune
      this.losetune = loadAudio(SOUNDS_PATH + '/losetune.mp3');

      // Win tune
      this.wintune = loadAudio(SOUNDS_PATH + '/wintune.mp3');
    };

    /**
     * Load game models
     * @method loadModel
     */
    AssetManager.prototype.loadModel = function() {

      var am = this;
      var ml = new THREE.GLTFLoader(am.loadingManager);
      var list = ['Robot', 'Cloud1', 'Cloud2', 'Cloud4', 'MovingPlatform_Long','pumpkin'];

      function loadModel (name) {
        const fileName = MODEL_PATH + '/' + name + '.glb';
        console.log('fileName', fileName)
        ml.load(fileName, function(gltf) {

          var model = gltf.scene;
          am[name] = model;
          am[name + '_Animations'] = gltf.animations;

          // Fix color
          model.traverse(function(o) {

            if (o.isMesh && o.material && o.material.map) {
              o.material.map.encoding = THREE.LinearEncoding;
            }
          });
        });
      }

      for (var i = 0; i < list.length; i++) {
        loadModel(list[i]);
      }
    };

    /**
     * Load app textures
     * @method loadTextures
     */
    AssetManager.prototype.loadTextures = function() {

      var d = this.rj3d.defaultOptions;
      var am = this;

      // Firework textures
      var fwl = new THREE.TextureLoader(am.loadingManager);
      fwl.load(GRAPHICS_PATH + '/' + 'lensflare.png', function(tex) {
        am.fwTexture = tex;
      });

      // Other textures
      var loader = new THREE.TextureLoader(am.loadingManager);
      var list = ['shadow.png',  'grass.jpg','halloweenbg.jpg'];

      for (var i = 0; i < list.length; i++) {

        var path = list[i];
        loader.load(GRAPHICS_PATH + '/' + path, function(texture) {

          var name = texture.image.src.split('/').pop().split('.').shift();
          am[name] = texture;
        });
      }
    };

    /**
     * Toggle sound
     * @method toggleSound
     */
    AssetManager.prototype.toggleSound = function() {

      this.soundOn = !this.soundOn;

      if (this.soundOn) {

        if (this.bgSound) this.bgSound.setVolume(0.5);
        this.btnClick.setVolume(1);
        this.losetune.setVolume(1);
        this.hitcoin.setVolume(1);
        this.wintune.setVolume(1);
        this.powerup.setVolume(1);
      }
      else {
        if (this.bgSound) this.bgSound.setVolume(0);
        this.btnClick.setVolume(0);
        this.losetune.setVolume(0);
        this.wintune.setVolume(0);
        this.hitcoin.setVolume(0);
        this.powerup.setVolume(0);
      }
    };

    return AssetManager;

  });
