(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular', 'pikaday'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('angular'), require('pikaday'));
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.angular, root.Pikaday);
  }
}(this, function (angular, Pikaday) {

  angular.module('pikaday', [])
    .provider('pikadayConfig', function pikadayProviderFn() {

      // Create provider with getter and setter methods, allows setting of global configs

      var config = {};

      this.$get = function() {
        return config;
      };

      this.setConfig = function setConfig(configs) {
        config = configs;
      };
    })
    .directive('pikaday', ['pikadayConfig', '$timeout', pikadayDirectiveFn]);

  function pikadayDirectiveFn(pikadayConfig, $timeout) {

    return {

      restrict: 'A',
      scope: {
        model: '=pikaday',
        modelFormat: '@?',
        onSelect: '&',
        onOpen: '&',
        onClose: '&',
        onDraw: '&',
        disableDayFn: '&',
        pickerObject: '=?'
      },
      link: function (scope, elem, attrs) {

        // Init config Object

        var config = { field: elem[0], onSelect: function () {
          setTimeout(function(){
            scope.$apply();
          });
        }};

        // Decorate config with globals

        angular.forEach(pikadayConfig, function (value, key) {
          config[key] = value;
        });

        // Decorate/Overide config with inline attributes

        angular.forEach(attrs.$attr, function (dashAttr) {
          var attr = attrs.$normalize(dashAttr); // normalize = ToCamelCase()
          applyConfig(attr, attrs[attr]);
        });

        function applyConfig (attr, value) {
          switch (attr) {

            // Booleans, Integers & Arrays

            case "setDefaultDate":
            case "bound":
            case "reposition":
            case "disableWeekends":
            case "showWeekNumber":
            case "isRTL":
            case "showMonthAfterYear":
            case "firstDay":
            case "yearRange":
            case "numberOfMonths":
            case "mainCalendar":

              config[attr] = scope.$eval(value);
              break;

            // Functions

            case "onOpen":
            case "onClose":
            case "onDraw":
            case "disableDayFn":

              config[attr] = function (date) {
                setTimeout(function(){
                  scope.$apply();
                });
                return scope[attr]({ pikaday: this, date: date });
              };
              break;

            // Strings

            case "format":
            case "viewFormat":
            case "position":
            case "theme":
            case "yearSuffix":
              if (attr === 'viewFormat') attr = 'format';
              config[attr] = value;
              break;

            // Dates

            case "minDate":
            case "maxDate":
            case "defaultDate":

              config[attr] = new Date(value);
              break;

            // Elements

            case "trigger":
            case "container":

              config[attr] = document.getElementById(value);
              break;

            // Translations

            case "i18n":

              config[attr] = pikadayConfig.locales[value];

          }
        }

        function getModelFormat() {
          return scope.modelFormat || attrs.viewFormat || attrs.format;
        }

        // instantiate pikaday with config, bind to scope, add destroy event callback
        var picker;

        config.onSelect = function(date) {
          scope.$apply(function() {
            // First update the model value
            scope.model = picker.getMoment().format(getModelFormat());

            // And after Angular has had time to apply the model value to the original source as well,
            // run the onSelect handlers.
            $timeout(function() {
              if (attrs.onSelect) {
                scope.onSelect({pikaday: picker, date: date});
              }
            });
          });
        };

        picker = new Pikaday(config);

        watcher = scope.$watch('model', function(newVal) {
          if (! newVal) return;
          picker.setMoment(moment(newVal, getModelFormat()), true);
        });

        scope.$on('$destroy', function () {
          watcher();
          picker.destroy();
        });

        if (scope.pickerObject) {
          scope.pickerObject = picker;
        }
      }
    };
  }

}));
