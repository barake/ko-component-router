(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["knockout"], factory);
	else if(typeof exports === 'object')
		exports["ko-component-router"] = factory(require("knockout"));
	else
		root["ko-component-router"] = factory(root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ko = __webpack_require__(1);
	var router = __webpack_require__(2);
	__webpack_require__(14);

	ko.components.register('ko-component-router', {
	  synchronous: true,
	  viewModel: router,
	  template: '<div data-bind=\'if: ctx.component\'>\n      <div data-bind=\'component: {\n        name: ctx.component,\n        params: ctx\n      }\'></div>\n    </div>'
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ko = __webpack_require__(1);
	var Context = __webpack_require__(3);
	var Route = __webpack_require__(11);

	var clickEvent = 'undefined' !== typeof document && document.ontouchstart ? 'touchstart' : 'click';

	var Router = (function () {
	  function Router(el, bindingCtx, _ref) {
	    var routes = _ref.routes;
	    var _ref$base = _ref.base;
	    var base = _ref$base === undefined ? '' : _ref$base;
	    var _ref$hashbang = _ref.hashbang;
	    var hashbang = _ref$hashbang === undefined ? false : _ref$hashbang;
	    var _ref$inTransition = _ref.inTransition;
	    var inTransition = _ref$inTransition === undefined ? noop : _ref$inTransition;
	    var _ref$outTransition = _ref.outTransition;
	    var outTransition = _ref$outTransition === undefined ? noop : _ref$outTransition;
	    var _ref$persistState = _ref.persistState;
	    var persistState = _ref$persistState === undefined ? false : _ref$persistState;
	    var _ref$persistQuery = _ref.persistQuery;
	    var persistQuery = _ref$persistQuery === undefined ? false : _ref$persistQuery;

	    _classCallCheck(this, Router);

	    var parentRouterCtx = bindingCtx.$parentContext && bindingCtx.$parentContext.$router;
	    var dispatch = true;
	    if (parentRouterCtx) {
	      base = parentRouterCtx.config.base + (parentRouterCtx.config.hashbang ? '/#!' : '') + parentRouterCtx.pathname();
	      dispatch = parentRouterCtx.path() !== parentRouterCtx.canonicalPath();
	      this.isRoot = false;
	    } else {
	      this.isRoot = true;
	    }

	    this.onpopstate = this.onpopstate.bind(this);
	    this.onclick = this.onclick.bind(this);

	    window.addEventListener('popstate', this.onpopstate, false);
	    document.addEventListener(clickEvent, this.onclick, false);

	    for (var route in routes) {
	      routes[route] = new Route(route, routes[route]);
	    }

	    this.config = {
	      el: el,
	      base: base,
	      hashbang: hashbang,
	      routes: routes,
	      inTransition: inTransition,
	      outTransition: outTransition,
	      persistState: persistState,
	      persistQuery: persistQuery
	    };

	    this.ctx = bindingCtx.$router = new Context(this.config);

	    if (this.isRoot) {
	      if (bindingCtx.$root) {
	        bindingCtx.$root.$router = this.ctx;
	      }
	    } else {
	      this.ctx.$parent = parentRouterCtx;
	      parentRouterCtx.$child = this.ctx;
	    }

	    if (dispatch) {
	      var url = this.config.hashbang && ~location.hash.indexOf('#!') ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;

	      this.dispatch(url);
	    }
	  }

	  _createClass(Router, [{
	    key: 'dispatch',
	    value: function dispatch(path, state) {
	      if (path.indexOf(this.config.base) === 0) {
	        path = path.replace(this.config.base, '') || '/';
	      }

	      return this.ctx.update(path, state, false, false);
	    }
	  }, {
	    key: 'onpopstate',
	    value: function onpopstate(e) {
	      var guid = this.ctx.config.depth + this.ctx.pathname();
	      this.dispatch(location.pathname + location.search + location.hash, (e.state || {})[guid]);
	    }
	  }, {
	    key: 'onclick',
	    value: function onclick(e) {
	      if (1 !== which(e) || e.metaKey || e.ctrlKey || e.shiftKey) {
	        return;
	      }

	      // ensure link
	      var el = e.target;
	      while (el && 'A' !== el.nodeName) {
	        el = el.parentNode;
	      }
	      if (!el || 'A' !== el.nodeName) {
	        return;
	      }

	      var isDownload = el.hasAttribute('download');
	      var hasOtherTarget = el.hasAttribute('target');
	      var hasExternalRel = el.getAttribute('rel') === 'external';
	      var isMailto = ~(el.getAttribute('href') || '').indexOf('mailto:');
	      var isCrossOrigin = !sameOrigin(el.href);
	      var isEmptyHash = el.getAttribute('href') === '#';

	      if (isDownload || hasOtherTarget || hasExternalRel || isMailto || isCrossOrigin || isEmptyHash) {
	        return;
	      }

	      // rebuild path
	      var path = el.pathname + el.search + (el.hash || '');

	      // same page
	      var orig = path;
	      var base = this.config.base.replace('/#!', '');
	      if (path.indexOf(base) === 0) {
	        path = path.substr(base.length);
	      }

	      if (this.config.hashbang) {
	        path = path.replace('#!', '');
	      }

	      if (this.config.base && orig === path) {
	        return;
	      }

	      if (this.dispatch(path)) {
	        e.preventDefault();
	        e.stopPropagation();
	        e.stopImmediatePropagation();
	      }
	    }
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      document.removeEventListener(clickEvent, this.onclick, false);
	      window.removeEventListener('popstate', this.onpopstate, false);
	    }
	  }]);

	  return Router;
	})();

	module.exports = {
	  createViewModel: function createViewModel(routerParams, componentInfo) {
	    var el = componentInfo.element;
	    var bindingCtx = ko.contextFor(el);
	    return new Router(el, bindingCtx, ko.toJS(routerParams));
	  }
	};

	function which(e) {
	  e = e || window.event;
	  return null === e.which ? e.button : e.which;
	}

	function noop() {}

	function sameOrigin(href) {
	  var origin = location.protocol + '//' + location.hostname;
	  if (location.port) origin += ':' + location.port;
	  return href && 0 === href.indexOf(origin);
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ko = __webpack_require__(1);
	var queryFactory = __webpack_require__(4).factory;
	var stateFactory = __webpack_require__(10).factory;
	var utils = __webpack_require__(9);

	var depth = 0;

	var Context = (function () {
	  function Context(config) {
	    _classCallCheck(this, Context);

	    this.config = config;
	    this.config.depth = depth++;

	    this.route = ko.observable('');
	    this.component = ko.observable();
	    this.canonicalPath = ko.observable('');
	    this.path = ko.observable('');
	    this.pathname = ko.observable('');
	    this.hash = ko.observable('');
	    this.params = {};
	    this.query = queryFactory(this);
	    this.state = stateFactory(this);
	  }

	  _createClass(Context, [{
	    key: 'update',
	    value: function update(origUrl) {
	      var state = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	      var push = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	      var query = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	      var url = origUrl.replace(this.config.base, '').replace('/#!', '');

	      var route = this.getRouteForUrl(url);
	      var sameRoute = route === this.route();
	      var firstRun = this.route() === '';

	      if (!route) {
	        if (this.isRoot) {
	          return false;
	        } else {
	          var _$parent;

	          return (_$parent = this.$parent).update.apply(_$parent, arguments);
	        }
	      }

	      var fromCtx = ko.toJS({
	        route: this.route,
	        path: this.path,
	        pathname: this.pathname,
	        canonicalPath: this.canonicalPath,
	        hash: this.hash,
	        state: this.state,
	        params: this.params,
	        query: this.query.getAll(false, this.pathname())
	      });

	      var _route$parse = route.parse(url);

	      var _route$parse2 = _slicedToArray(_route$parse, 6);

	      var path = _route$parse2[0];
	      var params = _route$parse2[1];
	      var hash = _route$parse2[2];
	      var pathname = _route$parse2[3];
	      var querystring = _route$parse2[4];
	      var childPath = _route$parse2[5];

	      if (query) {
	        this.query.update(query, pathname);
	      } else if (!this.config.persistQuery) {
	        this.query.updateFromString(querystring);
	      }

	      query = this.query.getAll(false, pathname);

	      if (!sameRoute && !firstRun) {
	        this.reload();
	      }

	      var canonicalPath = this.getCanonicalPath(pathname, childPath, hash);

	      var toCtx = {
	        route: route,
	        path: path,
	        pathname: pathname,
	        canonicalPath: canonicalPath,
	        hash: hash,
	        params: params,
	        query: query
	      };

	      if (state === false && sameRoute) {
	        utils.merge(toCtx, { state: fromCtx.state }, false);
	      } else if (!this.config.persistState && state) {
	        toCtx.state = {};
	        utils.merge(toCtx.state, state, false, true);
	      }

	      utils.merge(this, toCtx, true);

	      if (this.config.persistState) {
	        toCtx.state = this.state();
	      }

	      history[push ? 'pushState' : 'replaceState'](history.state, document.title, '' === canonicalPath ? this.config.base : canonicalPath);

	      if (!sameRoute) {
	        this.config.outTransition(this.config.el, fromCtx, toCtx, complete.bind(this));

	        if (this.config.outTransition.length !== 4) {
	          complete.call(this);
	        }
	      } else if (this.$child) {
	        this.$child.update(childPath, {}, false, {});
	      }

	      function complete() {
	        var _this = this;

	        this.component(route.component);
	        window.requestAnimationFrame(function () {
	          return _this.config.inTransition(_this.config.el, fromCtx, toCtx);
	        });
	      }

	      return true;
	    }
	  }, {
	    key: 'getCanonicalPath',
	    value: function getCanonicalPath(pathname) {
	      var childPath = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	      var hash = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

	      var base = this.config.base;
	      var hashbang = this.config.hashbang;
	      var querystring = this.query.getFullQueryString();

	      if (pathname[pathname.length - 1] === '/' && childPath[0] === '/') {
	        childPath = childPath.substring(1);
	      }

	      return '' + base + (hashbang ? '/#!' : '') + pathname + childPath + (querystring ? '?' + querystring : '') + (hash ? '#' + hash : '');
	    }
	  }, {
	    key: 'getRouteForUrl',
	    value: function getRouteForUrl(url) {
	      var pathname = url.split('#')[0].split('?')[0];

	      var matchingRouteWithFewestDynamicSegments = undefined;
	      var fewestMatchingSegments = Infinity;

	      for (var rn in this.config.routes) {
	        var r = this.config.routes[rn];
	        if (r.matches(pathname)) {
	          if (r._keys.length === 0) {
	            return r;
	          } else if (r._keys.length < fewestMatchingSegments) {
	            fewestMatchingSegments = r._keys.length;
	            matchingRouteWithFewestDynamicSegments = r;
	          }
	          return r;
	        }
	      }

	      return matchingRouteWithFewestDynamicSegments;
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      if (this.$child) {
	        this.$child.destroy();
	        delete this.$child;
	      }

	      this.query.dispose();
	      this.state.dispose();

	      depth--;
	    }
	  }, {
	    key: 'reload',
	    value: function reload() {
	      if (this.$child) {
	        this.$child.destroy();
	        delete this.$child;
	      }

	      this.query.reload();
	      this.state.reload();
	    }
	  }]);

	  return Context;
	})();

	module.exports = Context;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ko = __webpack_require__(1);
	var qs = __webpack_require__(5);
	var utils = __webpack_require__(9);

	var qsParams = {};
	var trigger = ko.observable(true);
	var cache = {};
	var pendingWriteOp = undefined;

	var Query = (function () {
	  function Query(ctx) {
	    _classCallCheck(this, Query);

	    this.ctx = ctx;

	    this.get = this.get.bind(this);
	    this.clear = this.clear.bind(this);
	    this.update = this.update.bind(this);
	  }

	  _createClass(Query, [{
	    key: 'get',
	    value: function get(prop, defaultVal) {
	      var query = this;
	      var ctx = this.ctx;
	      var guid = this.ctx.config.depth + ctx.pathname();

	      if (!cache[guid]) {
	        cache[guid] = {};
	      }

	      if (!cache[guid][prop]) {
	        cache[guid][prop] = {
	          defaultVal: defaultVal,
	          value: ko.pureComputed({
	            read: function read() {
	              trigger();

	              if (qsParams && qsParams[guid] && qsParams[guid][prop]) {
	                return qsParams[guid][prop];
	              }

	              return defaultVal;
	            },
	            write: function write(v) {
	              utils.merge(qsParams, _defineProperty({}, guid, _defineProperty({}, prop, v)), false);

	              if (pendingWriteOp) {
	                window.cancelAnimationFrame(pendingWriteOp);
	              }

	              pendingWriteOp = window.requestAnimationFrame(function () {
	                ctx.update(location.pathname + location.hash, ctx.state(), false, query.getNonDefaultParams()[guid]);
	                trigger(!trigger());
	              });
	            }
	          })
	        };
	      }

	      return cache[guid][prop].value;
	    }
	  }, {
	    key: 'getAll',
	    value: function getAll() {
	      var asObservable = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var pathname = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.pathname() : arguments[1];

	      var guid = this.ctx.config.depth + pathname;
	      return asObservable ? ko.pureComputed({
	        read: function read() {
	          trigger();
	          return this.getAll();
	        },
	        write: function write(q) {
	          for (var pn in q) {
	            this.get(pn)(q[pn]);
	          }
	        }
	      }, this) : ko.toJS(qsParams[guid]) || {};
	    }
	  }, {
	    key: 'setDefaults',
	    value: function setDefaults(q) {
	      for (var pn in q) {
	        this.get(pn, q[pn]);
	      }
	    }
	  }, {
	    key: 'clear',
	    value: function clear(pathname) {
	      if (typeof pathname !== 'string') {
	        pathname = this.ctx.pathname();
	      }
	      var guid = this.ctx.config.depth + pathname;
	      for (var pn in cache[guid]) {
	        var p = cache[guid][pn];
	        p.value(p.defaultVal);
	      }
	    }
	  }, {
	    key: 'reload',
	    value: function reload() {
	      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var guid = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.config.depth + this.ctx.pathname() : arguments[1];

	      if (!this.ctx.config.persistQuery || force) {
	        for (var p in qsParams[guid]) {
	          if (cache[guid] && cache[guid][p]) {
	            cache[guid][p].value.dispose();
	          }
	        }
	        delete qsParams[guid];
	        delete cache[guid];
	      }
	    }
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      for (var guid in qsParams) {
	        if (guid.indexOf(this.ctx.config.depth) === 0) {
	          this.reload(true, guid);
	        }
	      }
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	      var pathname = arguments.length <= 1 || arguments[1] === undefined ? this.ctx.pathname() : arguments[1];

	      var guid = this.ctx.config.depth + pathname;
	      utils.merge(qsParams, _defineProperty({}, guid, query), false);
	      trigger(!trigger());
	    }
	  }, {
	    key: 'updateFromString',
	    value: function updateFromString(str) {
	      var queries = qs.parse(str);
	      utils.merge(qsParams, queries, false, true);
	      trigger(!trigger());
	    }
	  }, {
	    key: 'getNonDefaultParams',
	    value: function getNonDefaultParams() {
	      var nonDefaultParams = {};
	      for (var id in qsParams) {
	        if (!cache[id]) {
	          nonDefaultParams[id] = qsParams[id];
	        } else {
	          nonDefaultParams[id] = {};
	          for (var pn in qsParams[id]) {
	            var p = qsParams[id][pn];
	            var d = cache[id][pn].defaultVal;
	            if (typeof p !== 'undefined' && p !== d) {
	              nonDefaultParams[id][pn] = p;
	            }
	          }
	        }
	      }

	      return nonDefaultParams;
	    }
	  }, {
	    key: 'getFullQueryString',
	    value: function getFullQueryString() {
	      return qs.stringify(this.getNonDefaultParams());
	    }
	  }]);

	  return Query;
	})();

	module.exports = {
	  factory: function factory(ctx) {
	    return new Query(ctx);
	  }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules

	var Stringify = __webpack_require__(6);
	var Parse = __webpack_require__(8);


	// Declare internals

	var internals = {};


	module.exports = {
	    stringify: Stringify,
	    parse: Parse
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules

	var Utils = __webpack_require__(7);


	// Declare internals

	var internals = {
	    delimiter: '&',
	    arrayPrefixGenerators: {
	        brackets: function (prefix, key) {

	            return prefix + '[]';
	        },
	        indices: function (prefix, key) {

	            return prefix + '[' + key + ']';
	        },
	        repeat: function (prefix, key) {

	            return prefix;
	        }
	    },
	    strictNullHandling: false
	};


	internals.stringify = function (obj, prefix, generateArrayPrefix, strictNullHandling, filter) {

	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    }
	    else if (Utils.isBuffer(obj)) {
	        obj = obj.toString();
	    }
	    else if (obj instanceof Date) {
	        obj = obj.toISOString();
	    }
	    else if (obj === null) {
	        if (strictNullHandling) {
	            return Utils.encode(prefix);
	        }

	        obj = '';
	    }

	    if (typeof obj === 'string' ||
	        typeof obj === 'number' ||
	        typeof obj === 'boolean') {

	        return [Utils.encode(prefix) + '=' + Utils.encode(obj)];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys = Array.isArray(filter) ? filter : Object.keys(obj);
	    for (var i = 0, il = objKeys.length; i < il; ++i) {
	        var key = objKeys[i];

	        if (Array.isArray(obj)) {
	            values = values.concat(internals.stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, filter));
	        }
	        else {
	            values = values.concat(internals.stringify(obj[key], prefix + '[' + key + ']', generateArrayPrefix, strictNullHandling, filter));
	        }
	    }

	    return values;
	};


	module.exports = function (obj, options) {

	    options = options || {};
	    var delimiter = typeof options.delimiter === 'undefined' ? internals.delimiter : options.delimiter;
	    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : internals.strictNullHandling;
	    var objKeys;
	    var filter;
	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    }
	    else if (Array.isArray(options.filter)) {
	        objKeys = filter = options.filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' ||
	        obj === null) {

	        return '';
	    }

	    var arrayFormat;
	    if (options.arrayFormat in internals.arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    }
	    else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    }
	    else {
	        arrayFormat = 'indices';
	    }

	    var generateArrayPrefix = internals.arrayPrefixGenerators[arrayFormat];

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }
	    for (var i = 0, il = objKeys.length; i < il; ++i) {
	        var key = objKeys[i];
	        keys = keys.concat(internals.stringify(obj[key], key, generateArrayPrefix, strictNullHandling, filter));
	    }

	    return keys.join(delimiter);
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	// Load modules


	// Declare internals

	var internals = {};
	internals.hexTable = new Array(256);
	for (var h = 0; h < 256; ++h) {
	    internals.hexTable[h] = '%' + ((h < 16 ? '0' : '') + h.toString(16)).toUpperCase();
	}


	exports.arrayToObject = function (source, options) {

	    var obj = options.plainObjects ? Object.create(null) : {};
	    for (var i = 0, il = source.length; i < il; ++i) {
	        if (typeof source[i] !== 'undefined') {

	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};


	exports.merge = function (target, source, options) {

	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        }
	        else if (typeof target === 'object') {
	            target[source] = true;
	        }
	        else {
	            target = [target, source];
	        }

	        return target;
	    }

	    if (typeof target !== 'object') {
	        target = [target].concat(source);
	        return target;
	    }

	    if (Array.isArray(target) &&
	        !Array.isArray(source)) {

	        target = exports.arrayToObject(target, options);
	    }

	    var keys = Object.keys(source);
	    for (var k = 0, kl = keys.length; k < kl; ++k) {
	        var key = keys[k];
	        var value = source[key];

	        if (!Object.prototype.hasOwnProperty.call(target, key)) {
	            target[key] = value;
	        }
	        else {
	            target[key] = exports.merge(target[key], value, options);
	        }
	    }

	    return target;
	};


	exports.decode = function (str) {

	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};

	exports.encode = function (str) {

	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    if (typeof str !== 'string') {
	        str = '' + str;
	    }

	    var out = '';
	    for (var i = 0, il = str.length; i < il; ++i) {
	        var c = str.charCodeAt(i);

	        if (c === 0x2D || // -
	            c === 0x2E || // .
	            c === 0x5F || // _
	            c === 0x7E || // ~
	            (c >= 0x30 && c <= 0x39) || // 0-9
	            (c >= 0x41 && c <= 0x5A) || // a-z
	            (c >= 0x61 && c <= 0x7A)) { // A-Z

	            out += str[i];
	            continue;
	        }

	        if (c < 0x80) {
	            out += internals.hexTable[c];
	            continue;
	        }

	        if (c < 0x800) {
	            out += internals.hexTable[0xC0 | (c >> 6)] + internals.hexTable[0x80 | (c & 0x3F)];
	            continue;
	        }

	        if (c < 0xD800 || c >= 0xE000) {
	            out += internals.hexTable[0xE0 | (c >> 12)] + internals.hexTable[0x80 | ((c >> 6) & 0x3F)] + internals.hexTable[0x80 | (c & 0x3F)];
	            continue;
	        }

	        ++i;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (str.charCodeAt(i) & 0x3FF));
	        out += internals.hexTable[0xF0 | (c >> 18)] + internals.hexTable[0x80 | ((c >> 12) & 0x3F)] + internals.hexTable[0x80 | ((c >> 6) & 0x3F)] + internals.hexTable[0x80 | (c & 0x3F)];
	    }

	    return out;
	};

	exports.compact = function (obj, refs) {

	    if (typeof obj !== 'object' ||
	        obj === null) {

	        return obj;
	    }

	    refs = refs || [];
	    var lookup = refs.indexOf(obj);
	    if (lookup !== -1) {
	        return refs[lookup];
	    }

	    refs.push(obj);

	    if (Array.isArray(obj)) {
	        var compacted = [];

	        for (var i = 0, il = obj.length; i < il; ++i) {
	            if (typeof obj[i] !== 'undefined') {
	                compacted.push(obj[i]);
	            }
	        }

	        return compacted;
	    }

	    var keys = Object.keys(obj);
	    for (i = 0, il = keys.length; i < il; ++i) {
	        var key = keys[i];
	        obj[key] = exports.compact(obj[key], refs);
	    }

	    return obj;
	};


	exports.isRegExp = function (obj) {

	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};


	exports.isBuffer = function (obj) {

	    if (obj === null ||
	        typeof obj === 'undefined') {

	        return false;
	    }

	    return !!(obj.constructor &&
	              obj.constructor.isBuffer &&
	              obj.constructor.isBuffer(obj));
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules

	var Utils = __webpack_require__(7);


	// Declare internals

	var internals = {
	    delimiter: '&',
	    depth: 5,
	    arrayLimit: 20,
	    parameterLimit: 1000,
	    strictNullHandling: false,
	    plainObjects: false,
	    allowPrototypes: false
	};


	internals.parseValues = function (str, options) {

	    var obj = {};
	    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

	    for (var i = 0, il = parts.length; i < il; ++i) {
	        var part = parts[i];
	        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

	        if (pos === -1) {
	            obj[Utils.decode(part)] = '';

	            if (options.strictNullHandling) {
	                obj[Utils.decode(part)] = null;
	            }
	        }
	        else {
	            var key = Utils.decode(part.slice(0, pos));
	            var val = Utils.decode(part.slice(pos + 1));

	            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
	                obj[key] = val;
	            }
	            else {
	                obj[key] = [].concat(obj[key]).concat(val);
	            }
	        }
	    }

	    return obj;
	};


	internals.parseObject = function (chain, val, options) {

	    if (!chain.length) {
	        return val;
	    }

	    var root = chain.shift();

	    var obj;
	    if (root === '[]') {
	        obj = [];
	        obj = obj.concat(internals.parseObject(chain, val, options));
	    }
	    else {
	        obj = options.plainObjects ? Object.create(null) : {};
	        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
	        var index = parseInt(cleanRoot, 10);
	        var indexString = '' + index;
	        if (!isNaN(index) &&
	            root !== cleanRoot &&
	            indexString === cleanRoot &&
	            index >= 0 &&
	            (options.parseArrays &&
	             index <= options.arrayLimit)) {

	            obj = [];
	            obj[index] = internals.parseObject(chain, val, options);
	        }
	        else {
	            obj[cleanRoot] = internals.parseObject(chain, val, options);
	        }
	    }

	    return obj;
	};


	internals.parseKeys = function (key, val, options) {

	    if (!key) {
	        return;
	    }

	    // Transform dot notation to bracket notation

	    if (options.allowDots) {
	        key = key.replace(/\.([^\.\[]+)/g, '[$1]');
	    }

	    // The regex chunks

	    var parent = /^([^\[\]]*)/;
	    var child = /(\[[^\[\]]*\])/g;

	    // Get the parent

	    var segment = parent.exec(key);

	    // Stash the parent if it exists

	    var keys = [];
	    if (segment[1]) {
	        // If we aren't using plain objects, optionally prefix keys
	        // that would overwrite object prototype properties
	        if (!options.plainObjects &&
	            Object.prototype.hasOwnProperty(segment[1])) {

	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        keys.push(segment[1]);
	    }

	    // Loop through children appending to the array until we hit depth

	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {

	        ++i;
	        if (!options.plainObjects &&
	            Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {

	            if (!options.allowPrototypes) {
	                continue;
	            }
	        }
	        keys.push(segment[1]);
	    }

	    // If there's a remainder, just add whatever is left

	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }

	    return internals.parseObject(keys, val, options);
	};


	module.exports = function (str, options) {

	    options = options || {};
	    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : internals.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : internals.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : internals.arrayLimit;
	    options.parseArrays = options.parseArrays !== false;
	    options.allowDots = options.allowDots !== false;
	    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : internals.plainObjects;
	    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : internals.allowPrototypes;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : internals.parameterLimit;
	    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : internals.strictNullHandling;

	    if (str === '' ||
	        str === null ||
	        typeof str === 'undefined') {

	        return options.plainObjects ? Object.create(null) : {};
	    }

	    var tempObj = typeof str === 'string' ? internals.parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0, il = keys.length; i < il; ++i) {
	        var key = keys[i];
	        var newObj = internals.parseKeys(key, tempObj[key], options);
	        obj = Utils.merge(obj, newObj, options);
	    }

	    return Utils.compact(obj);
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ko = __webpack_require__(1);

	function decodeURLEncodedURIComponent(val) {
	  if (typeof val !== 'string') {
	    return val;
	  }
	  return decodeURIComponent(val.replace(/\+/g, ' '));
	}

	function merge(dest, src) {
	  var createAsObservable = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	  var prune = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	  if (!src) {
	    return prune ? undefined : dest;
	  }

	  var props = Object.keys(src);

	  if (prune) {
	    for (var prop in dest) {
	      if (props.indexOf(prop) < 0) {
	        props.push(prop);
	      }
	    }
	  }

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var prop = _step.value;

	      if (typeof dest[prop] === 'undefined') dest[prop] = createAsObservable ? fromJS(src[prop]) : src[prop];else if (ko.isWritableObservable(dest[prop])) dest[prop](src[prop]);else if (typeof src[prop] === 'undefined') dest[prop] = undefined;else if (src[prop].constructor === Object) {
	        if (prune) {
	          dest[prop] = {};
	        }

	        merge(dest[prop], src[prop], createAsObservable);
	      } else dest[prop] = src[prop];
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return dest;
	}

	function fromJS(obj, parentIsArray) {
	  var obs = undefined;

	  if (isPrimitiveOrDate(obj)) obs = parentIsArray ? obj : ko.observable(obj);else if (obj instanceof Array) {
	    obs = [];

	    for (var i = 0; i < obj.length; i++) {
	      obs[i] = fromJS(obj[i], true);
	    }obs = ko.observableArray(obs);
	  } else if (obj.constructor === Object) {
	    obs = {};

	    for (var p in obj) {
	      obs[p] = fromJS(obj[p]);
	    }
	  }

	  return obs;
	}

	function isPrimitiveOrDate(obj) {
	  return obj === null || obj === undefined || obj.constructor === String || obj.constructor === Number || obj.constructor === Boolean || obj instanceof Date;
	}

	module.exports = {
	  decodeURLEncodedURIComponent: decodeURLEncodedURIComponent,
	  merge: merge
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var ko = __webpack_require__(1);
	var utils = __webpack_require__(9);

	module.exports = {
	  factory: function factory(ctx) {
	    var trigger = ko.observable(false);

	    var state = ko.pureComputed({
	      read: function read() {
	        trigger();
	        return history.state ? history.state[ctx.config.depth + ctx.pathname()] : {};
	      },
	      write: function write(v) {
	        if (v) {
	          var oldState = history.state || {};
	          var key = ctx.config.depth + ctx.pathname();
	          delete oldState[key];

	          history.replaceState(utils.merge(oldState, _defineProperty({}, key, v), false), document.title, '' === ctx.canonicalPath() ? ctx.config.base : ctx.canonicalPath());

	          trigger(!trigger());
	        }
	      }
	    });

	    var _dispose = state.dispose;

	    state.reload = function () {
	      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	      var guid = arguments.length <= 1 || arguments[1] === undefined ? ctx.config.depth + ctx.pathname() : arguments[1];

	      if (!ctx.config.persistState || force) {
	        if (history.state && history.state[guid]) {
	          var newState = history.state;
	          delete newState[guid];
	        }
	      }
	    };

	    state.dispose = function () {
	      for (var guid in history.state) {
	        if (guid.indexOf(ctx.config.depth) === 0) {
	          state.reload(true, guid);
	        }
	      }
	      _dispose.apply(state, arguments);
	    };

	    return state;
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var pathtoRegexp = __webpack_require__(12);
	var utils = __webpack_require__(9);

	var Route = (function () {
	  function Route(path, component) {
	    _classCallCheck(this, Route);

	    if (path[path.length - 1] === '!') {
	      path = path.replace('!', ':child_path(.*)?');
	    } else {
	      path = path.replace(/\(?\*\)?/, '(.*)');
	    }

	    this.component = component;

	    this._keys = [];
	    this._regexp = pathtoRegexp(path, this._keys);
	  }

	  _createClass(Route, [{
	    key: 'matches',
	    value: function matches(path) {
	      var qsIndex = path.indexOf('?');

	      if (~qsIndex) {
	        path = path.split('?')[0];
	      }

	      return this._regexp.exec(decodeURIComponent(path));
	    }
	  }, {
	    key: 'parse',
	    value: function parse(path) {
	      var childPath = undefined;
	      var hash = '';
	      var params = {};
	      var hIndex = path.indexOf('#');

	      if (~hIndex) {
	        var parts = path.split('#');
	        path = parts[0];
	        hash = utils.decodeURLEncodedURIComponent(parts[1]);
	      }

	      var qsIndex = path.indexOf('?');
	      var pathname = undefined,
	          querystring = undefined;

	      var _ref = ~qsIndex ? path.split('?') : [path];

	      var _ref2 = _slicedToArray(_ref, 2);

	      pathname = _ref2[0];
	      querystring = _ref2[1];

	      var matches = this._regexp.exec(decodeURIComponent(pathname));

	      for (var i = 1, len = matches.length; i < len; ++i) {
	        var k = this._keys[i - 1];
	        var v = utils.decodeURLEncodedURIComponent(matches[i]);
	        if (v !== undefined || !hasOwnProperty.call(params, k.name)) {
	          if (k.name === 'child_path') {
	            if (v !== undefined) {
	              childPath = '/' + v;
	              path = path.substring(0, path.lastIndexOf(childPath));
	              pathname = pathname.substring(0, pathname.lastIndexOf(childPath));
	            }
	          } else {
	            params[k.name] = v;
	          }
	        }
	      }

	      return [path, params, hash, pathname, querystring, childPath];
	    }
	  }]);

	  return Route;
	})();

	module.exports = Route;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isarray = __webpack_require__(13)

	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp
	module.exports.parse = parse
	module.exports.compile = compile
	module.exports.tokensToFunction = tokensToFunction
	module.exports.tokensToRegExp = tokensToRegExp

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
	].join('|'), 'g')

	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {String} str
	 * @return {Array}
	 */
	function parse (str) {
	  var tokens = []
	  var key = 0
	  var index = 0
	  var path = ''
	  var res

	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0]
	    var escaped = res[1]
	    var offset = res.index
	    path += str.slice(index, offset)
	    index = offset + m.length

	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1]
	      continue
	    }

	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path)
	      path = ''
	    }

	    var prefix = res[2]
	    var name = res[3]
	    var capture = res[4]
	    var group = res[5]
	    var suffix = res[6]
	    var asterisk = res[7]

	    var repeat = suffix === '+' || suffix === '*'
	    var optional = suffix === '?' || suffix === '*'
	    var delimiter = prefix || '/'
	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')

	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      pattern: escapeGroup(pattern)
	    })
	  }

	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index)
	  }

	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path)
	  }

	  return tokens
	}

	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {String}   str
	 * @return {Function}
	 */
	function compile (str) {
	  return tokensToFunction(parse(str))
	}

	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction (tokens) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length)

	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] === 'object') {
	      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
	    }
	  }

	  return function (obj) {
	    var path = ''
	    var data = obj || {}

	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i]

	      if (typeof token === 'string') {
	        path += token

	        continue
	      }

	      var value = data[token.name]
	      var segment

	      if (value == null) {
	        if (token.optional) {
	          continue
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined')
	        }
	      }

	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
	        }

	        if (value.length === 0) {
	          if (token.optional) {
	            continue
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty')
	          }
	        }

	        for (var j = 0; j < value.length; j++) {
	          segment = encodeURIComponent(value[j])

	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	          }

	          path += (j === 0 ? token.prefix : token.delimiter) + segment
	        }

	        continue
	      }

	      segment = encodeURIComponent(value)

	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	      }

	      path += token.prefix + segment
	    }

	    return path
	  }
	}

	/**
	 * Escape a regular expression string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	function escapeString (str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
	}

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1')
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys
	  return re
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i'
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {RegExp} path
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g)

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        pattern: null
	      })
	    }
	  }

	  return attachKeys(path, keys)
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {Array}  path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = []

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source)
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

	  return attachKeys(regexp, keys)
	}

	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function stringToRegexp (path, keys, options) {
	  var tokens = parse(path)
	  var re = tokensToRegExp(tokens, options)

	  // Attach keys back to the regexp.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] !== 'string') {
	      keys.push(tokens[i])
	    }
	  }

	  return attachKeys(re, keys)
	}

	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {Array}  tokens
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function tokensToRegExp (tokens, options) {
	  options = options || {}

	  var strict = options.strict
	  var end = options.end !== false
	  var route = ''
	  var lastToken = tokens[tokens.length - 1]
	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)

	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i]

	    if (typeof token === 'string') {
	      route += escapeString(token)
	    } else {
	      var prefix = escapeString(token.prefix)
	      var capture = token.pattern

	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*'
	      }

	      if (token.optional) {
	        if (prefix) {
	          capture = '(?:' + prefix + '(' + capture + '))?'
	        } else {
	          capture = '(' + capture + ')?'
	        }
	      } else {
	        capture = prefix + '(' + capture + ')'
	      }

	      route += capture
	    }
	  }

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
	  }

	  if (end) {
	    route += '$'
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
	  }

	  return new RegExp('^' + route, flags(options))
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 [keys]
	 * @param  {Object}                [options]
	 * @return {RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  keys = keys || []

	  if (!isarray(keys)) {
	    options = keys
	    keys = []
	  } else if (!options) {
	    options = {}
	  }

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options)
	  }

	  if (isarray(path)) {
	    return arrayToRegexp(path, keys, options)
	  }

	  return stringToRegexp(path, keys, options)
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ko = __webpack_require__(1);

	ko.bindingHandlers.path = {
	  init: function init(e, xx, b, x, c) {
	    applyBinding.call(this, e, b, c);
	  }
	};
	ko.bindingHandlers.state = {
	  init: function init(e, xx, b, x, c) {
	    applyBinding.call(this, e, b, c);
	  }
	};
	ko.bindingHandlers.query = {
	  init: function init(e, xx, b, x, c) {
	    applyBinding.call(this, e, b, c);
	  }
	};

	function applyBinding(el, bindings, ctx) {
	  var bindingsToApply = {};
	  el.href = '#';

	  bindingsToApply.click = function (data, e) {
	    var router = getRouter(ctx);
	    var url = bindings.has('path') ? bindings.get('path') : router.canonicalPath();
	    var state = bindings.has('state') ? bindings.get('state') : false;
	    var query = bindings.has('query') ? bindings.get('query') : false;

	    if (router.update(url, state, true, query)) {
	      e.preventDefault();
	      e.stopPropagation();
	      e.stopImmediatePropagation();
	    }
	  };

	  bindingsToApply.clickBubble = false;

	  if (bindings.has('path')) {
	    bindingsToApply.css = {
	      'active-path': ko.pureComputed(function () {
	        return ctx.$router.route() !== '' ? ctx.$router.route().matches(bindings.get('path')) : false;
	      })
	    };
	  }

	  // allow adjacent routers to initialize
	  window.requestAnimationFrame(function () {
	    ko.applyBindingsToNode(el, bindingsToApply);
	  });
	}

	function getRouter(ctx) {
	  while (typeof ctx !== 'undefined') {
	    if (typeof ctx.$router !== 'undefined') {
	      return ctx.$router;
	    }

	    ctx = ctx.$parent;
	  }
	}

/***/ }
/******/ ])
});
;