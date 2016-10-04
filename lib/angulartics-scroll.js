/**
 * @license Angulartics
 * (c) 2013 Luis Farzati http://angulartics.github.io/angulartics
 * License: MIT
 */

(function (window, angular) {
'use strict';

/**
 * @ngdoc overview
 * @name angulartics.scroll
 * Provides an implementation of Waypoints (http://imakewebthings.com/waypoints)
 * for use as a valid DOM event in analytics-on.
 */
angular.module('angulartics.scroll', ['angulartics'])
.factory('$waypoint', function () {
  return function(options) {
    return new Waypoint(options);
  };
})
.directive('analyticsOn', ['$analytics', '$waypoint', '$document', function ($analytics, $waypoint, $document) {
  function isProperty (name) {
    return name.substr(0, 8) === 'scrollby';
  }
  function cast (value) {
    if (value === '' || value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else {
      return value;
    }
  }

  return {
    restrict: 'A',
    priority: 5,
    scope: false,
    link: function ($scope, $element, $attrs) {
      if ($attrs.analyticsOn !== 'scrollby') return;

      var properties = {
        handler: function () {
          $element.triggerHandler('scrollby');
          if (this.options.triggeronce) {
            this.destroy();
          }
        },
        element: $element[0],
        continuous: false,
        triggeronce: true
      };
      angular.forEach($attrs.$attr, function (attr, name) {
        var key, value;

        if (isProperty(attr)) {
          key = name.slice(8,9).toLowerCase()+name.slice(9);

          if (key === 'context') {
            value = $document[0].querySelector($attrs[name]);
          } else {
            value = cast($attrs[name]);
          }

          properties[key] = value;
        }
      });

      $waypoint(properties);
    }
  };
}]);
})(window, window.angular);
