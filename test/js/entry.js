
// Setup baseUrl for source folder and library paths
requirejs.config({
  baseUrl:"../src/",
  paths:{
    libs:"../libs/"
  }
});

require(['rs/rj3d/RobotJump', 'libs/domReady'], 

  function(RobotJump, domReady) {

    "use strict";

    domReady(function() {

      var el = document.querySelector('.rs-rj3d');
      var rj3d = new RobotJump(el);
      window.rj3d = rj3d;
    });
  });
