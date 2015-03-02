define([], function () {

  'use strict';

  var originalDefine = define,
    modulesRegistry = {},
    utility = {
      isFunction: function (it) {
        return Object.prototype.toString.call(it) === '[object Function]';
      },

      isArray: function (it) {
        return Object.prototype.toString.call(it) === '[object Array]';
      },

      isNumber: function (it) {
        return Object.prototype.toString.call(it) === '[object Number]';
      }
    },

    createWrappedCallback = function (originalCallback, originalDeps) {
      if (!utility.isFunction(originalCallback)) {
        return originalCallback;
      }

      return function () {
        // module object is available as the last argument after 'module'
        // explicitly pushed to dependencies list
        var moduleObj = arguments[arguments.length - 1];
        if (!moduleObj) {
          return originalCallback.apply(this, arguments);
        }
        modulesRegistry[moduleObj.id] = {
          depNames: originalDeps,
          depModules: Array.prototype.slice.call(arguments, 0),
          factory: originalCallback
        };
        return originalCallback.apply(this, arguments);
      };
    },

    defineOverride = function (name, deps, callback) {
      // standard requirejs params handling
      if (typeof name !== 'string') {
        callback = deps;
        deps = name;
        name = null;
      }

      if (!utility.isArray(deps)) {
        callback = deps;
        deps = [];
      }

      var wrappedCallback = createWrappedCallback(callback, deps),
        defineArgs = [];
      deps.push('module');

      if (name) {
        defineArgs.push(name);
      }
      defineArgs.push(deps);
      defineArgs.push(wrappedCallback);
      return originalDefine.apply(this, defineArgs);
    },

    _buildArgsArrayInt = function(moduleObj, dependencyOverrides, depth) {
      var args = [],
        index;
      for (index = 0; index < moduleObj.depNames.length; index++) {
        var key = moduleObj.depNames[index],
          mod = modulesRegistry[key],
          override = dependencyOverrides[key];
        if (!override) {
          if (depth !== 1 && !!mod) {
            override = mod.factory.apply(this, _buildArgsArrayInt(mod, dependencyOverrides, depth - 1));
          } else {
            override = moduleObj.depModules[index];
          }
        }
        args.push(override || moduleObj.depModules[index]);
      }
      return args;
    },

    buildArgsArray = function (moduleObj, dependencyOverrides) {
      dependencyOverrides = dependencyOverrides || {};
      var isOverridesArray = utility.isArray(dependencyOverrides),
        $maxDepth = utility.isNumber(dependencyOverrides.$maxDepth) ? dependencyOverrides.$maxDepth : 1;

      return _buildArgsArrayInt(moduleObj, dependencyOverrides, $maxDepth);
    },

    plugin = {
      load: function (name, req, onload, config) {

        require([name], function () {
          var module = modulesRegistry[name];
          if (!module) {
            throw new Error('Module "' + name + '" is not registered.' +
              ' Please ensure that rinject plugin is loaded before any modules you try to resolve');
          }
          var factory = function (dependencyOverrides) {
            var args = buildArgsArray(module, dependencyOverrides);
            return module.factory.apply(this, args);
          };

          onload(factory);
        });
      }
    };

  // replace global define with override
  define = defineOverride;
  define.amd = originalDefine.amd;

  return plugin;

});
