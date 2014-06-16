var App = {};

var requestAnimationFrameWrapper = function(wrappee) {
  return (window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.requestAnimationFrame ||
          function(callback) {
            return window.setTimeout(callback, 1000 / 60);
          })(wrappee);
};


(function() {
  function f(sel) {
    this.hasError = false;
    this.selQuery = sel;
    this.element = document.querySelectorAll.call(document, sel);
    if(this.element.length === 1) this.element = this.element[0];
    if(this.element.length === 0) {
      this.element = false;
      this.hasError = true;
    }
  }

  f.prototype.css = function(attrName, styleValue) {
    if(typeof attrName === 'object' && typeof styleValue === 'undefined') {
      for(var property in attrName) {

         this.element.style[property] = attrName[property];
      }
      return this;
    }
    this.element.style[attrName] = styleValue;
    return this;
  };

  f.prototype.addClass = function(className) {
    if(this.element.getAttribute('class').indexOf(className) !== -1) return false;
    this.element.setAttribute('class', this.element.getAttribute('class') + ' ' + className);
  };

  f.prototype.removeClass = function(className) {
    if(this.element.getAttribute('class').indexOf(className) === -1) return false;
    var currentClass = this.element.getAttribute('class');
    this.element.setAttribute('class', currentClass.replace(className, ''));
  };

  f.prototype.show = function() {
    this.removeClass('is-hidden');
  };

  f.prototype.hide = function() {
    this.addClass('is-hidden');
  };

  function $(a) {
    return new f(a);
  }

  $.helper = function(el) {

  };

  window.$ = $;
})();

(function(app) {

  var $viewport = $('.viewport');
  var $water = $('.water');
  var $avatar = $('.avatar');

  var currentData = {
    alpha: 0,
    beta: 0,
    gamma: 0
  };

  app.init = function() {

    app.updateViewport();

    $avatar.css('transform-style', 'preserve-3d')
           .css('-webkit-transform-style', 'preserve-3d');
    $water.css('transform-style', 'preserve-3d')
           .css('-webkit-transform-style', 'preserve-3d');

  };

  app.getBrowserSizes = function() {
    return (typeof( window.innerWidth ) === 'number' ) ? [window.innerWidth, window.innerHeight] : [document.documentElement.clientWidth, document.documentElement.clientHeight];
  };

  app.updateViewport = function() {
    $viewport.css({
      width: app.getBrowserSizes[0]+'px',
      height: app.getBrowserSizes[1]+'px'
    });
  };

  app.updateAnimation = function() {

    if(currentData.beta >= -22 && currentData.beta <= 38) {
      $avatar.css('-webkit-transform', 'rotate(' + currentData.alpha + 'deg)');
      $avatar.css('transform', 'rotate(' + currentData.alpha + 'deg)');

      console.log('show avatar');
      $avatar.show();
      $water.hide();
    } else {

      $water.css('-webkit-transform', 'rotate(' + currentData.gamma + 'deg)');
      $water.css('transform', 'rotate(' + currentData.gamma + 'deg)');
      console.log('show water');
      $avatar.hide();
      $water.show();
    }
  };

  app.updateData = function(alpha, beta, gamma) {
    currentData.alpha = alpha;
    currentData.beta  = beta;
    currentData.gamma = gamma;
    app.updateAnimation();
  };

  app.deviceOrientationListener = function(event) {
    var action;
    action = function() {
      app.updateData(
        Math.round(event.alpha),
        Math.round(event.beta),
        Math.round(-event.gamma/Math.PI)
      );
    };
    requestAnimationFrameWrapper(action);
  };

})(App);

window.App = App;

window.addEventListener("deviceorientation", App.deviceOrientationListener);
document.addEventListener("DOMContentLoaded", App.init);
