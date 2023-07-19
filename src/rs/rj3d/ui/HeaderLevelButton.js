
/**
 * @author  raizensoft.com
 */
define(
  function() {

    "use strict";

    /**
     * HeaderLevelButton component
     * @class HeaderLevelButton
     * @constructor
     */
    function HeaderLevelButton(gh, title) {

      this.title = title;
      this.gh = gh;
      this.init();
    }

    /**
     * Init the button
     * @method init
     */
    HeaderLevelButton.prototype.init = function() {

      var el = this.el = document.createElement('div');
      el.className = 'rs-rj3d-levelbtn';

      // Label
      this.label = document.createElement('span');
      this.label.className = 'levelbtn-label';
      el.appendChild(this.label);
      this.setScore(0);
    };

    /**
     * Set current level label
     * @method setLevel
     */
    HeaderLevelButton.prototype.setScore = function(score) {
      this.label.innerHTML = 'Score: ' + score;
    };

    return HeaderLevelButton;
  });
