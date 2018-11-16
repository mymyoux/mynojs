/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

    "use strict";
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return root; });
    const root = typeof window == "undefined"?global:window;
    
    
    /***/ }),
    /* 1 */
    /***/ (function(module, exports) {
    
    module.exports = require("path");
    
    /***/ }),
    /* 2 */
    /***/ (function(module, exports) {
    
    module.exports = require("fs");
    
    /***/ }),
    /* 3 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Objects; });
        class Objects {
        static deepEquals(a, b, exclude) {
            if (typeof a != typeof b) {
                return false;
            }
            if (typeof a == "object") {
                if (a instanceof Date) {
                    if (b instanceof Date) {
                        return a == b;
                    }
                    else {
                        return false;
                    }
                }
                else if (b instanceof Date) {
                    return false;
                }
                for (var p in a) {
                    if (exclude && exclude.indexOf(p) !== -1) {
                        continue;
                    }
                    if (!Objects.deepEquals(a[p], b[p])) {
                        return false;
                    }
                }
                for (var p in b) {
                    if (exclude && exclude.indexOf(p) !== -1) {
                        continue;
                    }
                    if (!Objects.deepEquals(a[p], b[p])) {
                        return false;
                    }
                }
                return true;
            }
            else {
                return a == b;
            }
        }
        static clone(obj, ignore, hidePrivate = false) {
            //console.log(obj);
            if (ignore) {
                if (typeof ignore == "string") {
                    ignore = [ignore];
                }
            }
            // Handle the 3 simple types, and null or undefined
            if (null == obj || "object" != typeof obj)
                return obj;
            // Handle Date
            if (obj instanceof Date) {
                var copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }
            // Handle Array
            if (obj instanceof Array) {
                var copy_array = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy_array[i] = Objects.clone(obj[i], null, hidePrivate);
                }
                return copy_array;
            }
            // Handle Object
            if (obj instanceof Object) {
                var copy_object = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr) && (!ignore || ignore.indexOf(attr) == -1) && (!hidePrivate || attr.substring(0, 1) != "_")) {
                        if (obj[attr] === obj) {
                            //circular
                            copy_object[attr] = copy_object;
                        }
                        else {
                            copy_object[attr] = Objects.clone(obj[attr], null, hidePrivate);
                        }
                    }
                }
                return copy_object;
            }
            throw new Error("Unable to copy obj! Its type isn't supported.");
        }
        static makeNestedObject(data, name) {
            var names = name.split(".");
            var len = names.length;
            for (var i = 0; i < len; i++) {
                if (!data[names[i]]) {
                    data[names[i]] = {};
                }
                data = data[names[i]];
            }
            return data;
        }
        static mergeProperties(propertyKey, firstObject, secondObject) {
            var propertyValue = firstObject[propertyKey];
            var propertyValue2 = secondObject[propertyKey];
            if (typeof (propertyValue) === "object" && !(propertyValue instanceof Date) && propertyValue2 !== undefined && !(propertyValue2 instanceof Date)) {
                return Objects.mergeObjects(firstObject[propertyKey], secondObject[propertyKey]);
            }
            else if (secondObject[propertyKey] === undefined) {
                return firstObject[propertyKey];
            }
            return secondObject[propertyKey];
        }
        static merge(firstObject, secondObject) {
            return this.mergeObjects(firstObject, secondObject);
        }
        static mergeObjects(firstObject, secondObject) {
            if (!firstObject) {
                return secondObject;
            }
            if (!secondObject) {
                return firstObject;
            }
            var finalObject = {};
            // Merge first object and its properties.
            for (var propertyKey in firstObject) {
                finalObject[propertyKey] = Objects.mergeProperties(propertyKey, firstObject, secondObject);
            }
            // Merge second object and its properties.
            for (var propertyKey in secondObject) {
                finalObject[propertyKey] = Objects.mergeProperties(propertyKey, secondObject, finalObject);
            }
            return finalObject;
        }
        static getAllPropertiesName(object) {
            var properties = [];
            if (Object.getOwnPropertyNames && Object.getPrototypeOf) {
                properties = properties.concat(Object.getOwnPropertyNames(object));
                var proto = Object.getPrototypeOf(object);
                if (proto) {
                    properties = properties.concat(this.getAllPropertiesName(proto));
                }
            }
            else {
                for (var p in object) {
                    properties.push(p);
                }
            }
            return properties;
        }
        static assign(previous, ...newValues)
        {
            return Object.assign({}, previous, ...newValues);
        }
    }
    
    
    /***/ }),
    /* 4 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Hardware; });
    /* harmony import */ var _Root__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
    /* harmony import */ var _Configuration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
    
    
    class Hardware {
        static isNode() {
            return typeof window == "undefined";
        }
        static isBrowser() {
            return !Hardware.isNode();
        }
        static isElectron()
        {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.versions && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.versions['electron'];
        }
        static isWindows()
        {
            if (_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process)
                return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.platform && /^win/.test(_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.platform);
            else
                return Hardware.getOS() === Hardware.OS_WINDOW_DESKTOP;
        }
        static isMacOsX()
        {
            if (_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process)
                return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.platform && /^darwin/.test(_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.platform);
            else
                return Hardware.getOS() === Hardware.OS_MAC_OS_X;
        }
        static isCordova()
        {
            return  _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device.cordova != undefined;
        }
        /**
         * Get the version of Cordova running on the device.
         * @returns {*}
         */
        static getCordovaVersion() {
            return Hardware.isCordova() ? _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device.cordova : 0;
        }
        static getElectronVersion() {
            return Hardware.isElectron() ? _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.versions['electron'] : 0;
        }
        /**
         * Gets app version
         */
        static getAppVersion() {
            return Object(_Configuration__WEBPACK_IMPORTED_MODULE_1__[/* config */ "b"])("app.version", 0);
        }
        /**
         * Get the device's operating system name.
         * @returns {string}
         */
        static getOS() {
            if (_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device) {
                return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device.platform;
            }
            var agent = _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"] && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].navigator && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].navigator.userAgent ? navigator.userAgent.toLowerCase() : "node";
            if (agent.indexOf("android") != -1) {
                return Hardware.OS_ANDROID;
            }
            else if (agent.indexOf("windows ce") != -1) {
                return Hardware.OS_WINDOWS_PHONE_7;
            }
            else if (agent.indexOf("windows phone") != -1) {
                return Hardware.OS_WINDOWS_PHONE_8;
            }
            else if (agent.indexOf("blackberry") != -1) {
                return Hardware.OS_BlackBerry;
            }
            else if (agent.indexOf("iphone") != -1 || agent.indexOf("ipod") != -1) /* || agent.indexOf("ipad")!=-1)*/ {
                return Hardware.OS_IOS;
            }
            else if (agent.indexOf("node") != -1) {
                return Hardware.OS_NODE;
            }
            else if (agent.indexOf("mac os x") != -1) {
                return Hardware.OS_MAC_OS_X;
            }
            else if (agent.indexOf("linux") != -1) {
                return Hardware.OS_LINUX;
            }
            else if (agent.indexOf("windows nt") != -1) {
                return Hardware.OS_WINDOW_DESKTOP;
            }
            else {
                return Hardware.OS_Website;
            }
        }
        static getBrowser() {
            var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null)
                    return 'Opera ' + tem[1];
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null)
                M.splice(1, 1, tem[1]);
            return M.join(' ');
        }
        //TODO:correct these
        static getLocale() {
            return Hardware.getLanguage() + "_" + Hardware.getLanguage().toUpperCase();
        }
        static getLanguage() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"] && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].navigator && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].navigator.language ? _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].navigator.language : "en";
        }
        static hasTouch()
        {
            return 'ontouchstart' in _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"] || (_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].navigator && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].navigator.msMaxTouchPoints > 0);
        }
        /**
         * Get the device's Universally Unique Identifier (UUID).
         * @returns {string}
         */
        static getUUID() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device ? _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device.uuid : "uuid";
        }
        /**
         * Get the operating system version.
         * @returns {string}
         */
        static getOSVersion() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device ? _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device.version : "unkown";
        }
        /**
         * Get the device's model name.
         * @returns {string}
         */
        static getModel() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device ? _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].device.model : "unkown";
        }
        /**
         * Specifies if the current device is iOS Device
         * @returns {boolean}
         */
        static isIOS() {
            return Hardware.getOS() == Hardware.OS_IOS;
        }
        /**
         * Specifies if the current device is Android Device
         * @returns {boolean}
         */
        static isAndroid() {
            return Hardware.getOS() == Hardware.OS_ANDROID;
        }
        static isChrome() {
            var browser = Hardware.getBrowser().toLowerCase();
            return browser.indexOf('chrome') === 0;
        }
        static getNodeVersion()
        {
            if(_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process)
            {
                return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].process.version;
            }
            return null;
        }
        /**
         * Specifies if the current device is a website (emulated)
         * @returns {boolean}
         */
        static isWebsite() {
            var os = Hardware.getOS();
            return os == Hardware.OS_Website || os == Hardware.OS_LINUX || os == Hardware.OS_WINDOW_DESKTOP || os == Hardware.OS_MAC_OS_X;
        }
        /**
         * Specifies if the current device is BlackBerry Device
         * @returns {boolean}
         */
        static isBlackBerry() {
            //TODO:manages cases when blackberry returns phone version instead of plateform's name
            return Hardware.getOS() == Hardware.OS_BlackBerry;
        }
        /**
         * Specifies if the current device is Windows Phone Device
         * @returns {boolean}
         */
        static isWindowsPhone() {
            return Hardware.getOS() == Hardware.OS_WINDOWS_PHONE_7 || Hardware.getOS() == Hardware.OS_WINDOWS_PHONE_8;
        }
        /**
         * Specifies if the current device is a smartphone
         * @returns {boolean}
         */
        static isMobile() {
            return Hardware.isAndroid() || Hardware.isIOS() || Hardware.isBlackBerry() || Hardware.isWindowsPhone();
        }
        /**
         * Gets screen height in pixels
         * @returns {Number}
         */
        static getScreenHeight() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].innerHeight;
        }
        /**
         * Gets screen width in pixels
         * @returns {Number}
         */
        static getScreenWidth() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].innerWidth;
        }
        /**
         * Gets screen orientation
         * @returns {Number} 0 = portrait, 90 = landscape rotated to left, 180 = portrait upside down, -90 = landscape rotated to right
         */
        static getOrientation() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"]["orientation"];
        }
        /**
         * Gets pixel ratio. 1 = 160 dpi, 2 = 320 dpi...
         * @returns {number}
         */
        static getPixelRatio() {
            var ratio = 1;
            // To account for zoom, change to use deviceXDPI instead of systemXDPI
            if (_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].screen && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].screen.systemXDPI !== undefined && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].screen.logicalXDPI !== undefined && _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].screen.systemXDPI > _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].screen.logicalXDPI) {
                // Only allow for values > 1
                ratio = _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].screen.systemXDPI / _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].screen.logicalXDPI;
            }
            else if (_Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].devicePixelRatio !== undefined) {
                ratio = _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].devicePixelRatio;
            }
            return ratio == undefined ? 1 : ratio;
        }
        /**
         * Gets pixel ratio. avoir weird values like 2.200000047683716
         * @returns {number}
         */
        static getPixelRatioApproximate() {
            return Math.ceil(Hardware.getPixelRatio() * 10) / 10;
        }
        /**
         * Gets dpi
         * @returns {number}
         */
        static getDPI() {
            return 160 * _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].devicePixelRatio;
        }
        /**
         * Checks if the device is currently on portrait mode
         * @returns {boolean}
         */
        static isPortrait() {
            return _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"]["orientation"] % 180 == 0;
        }
        /**
         * Checks if the device is currently on landscape mode
         * @returns {boolean}
         */
        static isLandscape() {
            return !Hardware.isPortrait();
        }
        static supportPassive() {
            var supportsPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function () {
                        supportsPassive = true;
                    }
                });
                _Root__WEBPACK_IMPORTED_MODULE_0__[/* root */ "a"].addEventListener("test", null, opts);
            }
            catch (e) { }
            return supportsPassive;
        }
        /**
         * Main device's data to object
         * @returns {object}
         */
        static toObject() {
            var data = {
                cordovaVersion: Hardware.getCordovaVersion(),
                os: Hardware.getOS(),
                uuid: Hardware.getUUID(),
                osVersion: Hardware.getOSVersion(),
                android: Hardware.isAndroid(),
                blackberry: Hardware.isBlackBerry(),
                ios: Hardware.isIOS(),
                mobile: Hardware.isMobile(),
                windowsPhone: Hardware.isWindowsPhone(),
                screenWidth: Hardware.getScreenWidth(),
                screenHeight: Hardware.getScreenHeight(),
                orientation: Hardware.getOrientation(),
                landscape: Hardware.isLandscape(),
                portrait: Hardware.isPortrait(),
                browser: Hardware.getBrowser(),
                isElectron: Hardware.isElectron(),
                electronVersion:Hardware.getElectronVersion(),
                nodeVersion:Hardware.getNodeVersion(),
                cookie: (Hardware.hasCookieEnable() ? 'true' : 'false')
            };
            return data;
        }
        static hasCookieEnable() {
            if (!Hardware.isBrowser())
                return false;
            return navigator.cookieEnabled;
        }
    }
    Hardware.OS_NODE = "Node_Environment";
    /**
     * Android Operating System
     * @type {string}
     */
    Hardware.OS_ANDROID = "Android";
    /**
     * iOS Operating System
     * @type {string}
     */
    Hardware.OS_IOS = "iOS";
    /**
     * BlackBerry Operating System
     * @type {string}
     */
    Hardware.OS_BlackBerry = "BlackBerry";
    /**
     * Windows Phone 7 Operating System
     * @type {string}
     */
    Hardware.OS_WINDOWS_PHONE_7 = "WinCE";
    /**
     * Windows Phone 8 Operating System
     * @type {string}
     */
    Hardware.OS_WINDOWS_PHONE_8 = "Win32NT";
    /**
     * Other OS Web(for outside phonegap compatibility)
     * @type {string}
     */
    Hardware.OS_Website = "Other OS website";
    /**
     * Other OS (for outside phonegap compatibility)
     * @type {string}
     */
    Hardware.OS_OTHER = "Other OS";
    /**
     * Mac OS X
     * @type {string}
     */
    Hardware.OS_MAC_OS_X = "Mac OS X";
    /**
     * Linux
     * @type {string}
     */
    Hardware.OS_LINUX = "Linux";
    /**
     * Desktop Windows
     * @type {string}
     */
    Hardware.OS_WINDOW_DESKTOP = "Windows Desktop";
    
    /***/ }),
    /* 5 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Configuration; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return config; });
    /* harmony import */ var _utils_Objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
    /* harmony import */ var _Hardware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
    /* harmony import */ var _Root__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
    
    
    
    
    class Configuration {
        static env()
        {
            if(!Configuration.has('app.env'))
            {
                let env = "production";
                if(_Hardware__WEBPACK_IMPORTED_MODULE_1__[/* Hardware */ "a"].isNode())
                {
                    if(false)
                    {}else
                    {
                        env = "production" || process.env.BABEL_ENV;
                        if(env == "node")
                        {
                            //exception
                            env = "local";
                        }
                    }
                }
                Configuration.set('app.env', env); 
            }
            return Configuration.get('app.env');
        }
        static getAllKeys()
        {
           return this.buildKeys(this.data);
        }
        static buildKeys(data, prefix = '')
        {
            let keys = Object.keys(data);
            keys = keys.reduce((previous, key)=>
            {
                let item = data[key];
                if(item && typeof item == 'object')
                {
                    previous = previous.concat(this.buildKeys(item, prefix+key+'.'))
                }
                return previous;
            }, keys);
            return keys.map((item)=>prefix+item);
        }
        static isDebug()
        { 
            return Configuration.env() == "DEBUG" || Configuration.isLocal();
        }
        static isLocal()
        {
            return ~this.env().indexOf('local');
        }
        static isProduction()
        {
            return ~this.env().indexOf('production');
        }
        static merge(key, data) {
            if (typeof key == "string") {
                if (Configuration.data[key]) {
                    Configuration.data[key] = _utils_Objects__WEBPACK_IMPORTED_MODULE_0__[/* Objects */ "a"].merge(Configuration.data[key], data);
                }
                else {
                    Configuration.data[key] = data;
                }
            }
            else {
                data = key;
                Configuration.data = _utils_Objects__WEBPACK_IMPORTED_MODULE_0__[/* Objects */ "a"].merge(Configuration.data, data);
            }
        }
        static has(key) {
            if(!key)
            {
                return false;
            }
            let  keys = key.split('.');
            //not last
            key = keys.pop();
            let current = Configuration.data;
            for(var k of keys)
            {
                if(current[k] == null)
                {
                    current[k] = {};
                } 
                if(typeof current[k] != "object")
                {
                    current[k] = {}; 
                }
                current = current[k];
            }
            return current[key] != undefined;
        }
        static get(key, defaultValue = null) {
            if(!key)
            {
                return _utils_Objects__WEBPACK_IMPORTED_MODULE_0__[/* Objects */ "a"].clone(Configuration.data);
            }
            let  keys = key.split('.');
            //not last
            key = keys.pop();
            let current = Configuration.data;
            for(var k of keys)
            {
                if(current[k] == null)
                {
                    current[k] = {};
                } 
                if(typeof current[k] != "object")
                {
                    current[k] = {}; 
                }
                current = current[k];
            }
            return current[key] != undefined ? current[key] : defaultValue;
        }
        static set(key, value) {
            let keys = key.split('.');
            //not last 
            key = keys.pop();
            let current = Configuration.data;
            for(var k of keys)
            {
                if(current[k] == null)
                {
                    current[k] = {};
                } 
                if(typeof current[k] != "object")
                {
                    console.warn("Configuration nested key not object", current, keys, k);
                    current[k] = {}; 
                }
                current = current[k];
            }
            if(current[key] === value)
            {
                return;
            }
            current[key] = value;
        }
        static remove(key)
        {
            let keys = key.split('.');
            //not last 
            key = keys.pop();
            let current = Configuration.data;
            for(var k of keys)
            {
                if(current[k] == null)
                {
                    current[k] = {};
                } 
                if(typeof current[k] != "object")
                {
                    console.warn("Configuration nested key not object", current, keys, k);
                    current[k] = {}; 
                }
                current = current[k];
            }
            delete current[key];
        }
        static writeExternal() {
            return _utils_Objects__WEBPACK_IMPORTED_MODULE_0__[/* Objects */ "a"].clone(Configuration.data);
        }
        static readExternal(data) {
            Configuration.data = data;
        }
    }
    Configuration.data = {};
    
    const config = function(key, value)
    {
        if(value != undefined)
        {
            return Configuration.set(key, value);
        }
        return Configuration.get(key);
    }
    //add Configuration methods to config
    for(let key of Object.getOwnPropertyNames(Configuration))
    {
        if(typeof Configuration[key] == "function")
        {
            config[key] = Configuration[key];
        }
    }
    _Root__WEBPACK_IMPORTED_MODULE_2__[/* root */ "a"].config = config;
    
    /***/ }),
    /* 6 */
    /***/ (function(module, exports, __webpack_require__) {
    
    /* @flow */
    /*::
    
    type DotenvParseOptions = {
      debug?: boolean
    }
    
    // keys and values from src
    type DotenvParseOutput = { [string]: string }
    
    type DotenvConfigOptions = {
      path?: string, // path to .env file
      encoding?: string, // encoding of .env file
      debug?: string // turn on logging for debugging purposes
    }
    
    type DotenvConfigOutput = {
      parsed?: DotenvParseOutput,
      error?: Error
    }
    
    */
    
    const fs = __webpack_require__(2)
    const path = __webpack_require__(1)
    
    function log (message /*: string */) {
      console.log(`[dotenv][DEBUG] ${message}`)
    }
    
    // Parses src into an Object
    function parse (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
      const debug = Boolean(options && options.debug)
      const obj = {}
    
      // convert Buffers before splitting into lines and processing
      src.toString().split('\n').forEach(function (line, idx) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
        // matched?
        if (keyValueArr != null) {
          const key = keyValueArr[1]
    
          // default undefined or missing values to empty string
          let value = keyValueArr[2] || ''
    
          // expand newlines in quoted values
          const len = value ? value.length : 0
          if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
            value = value.replace(/\\n/gm, '\n')
          }
    
          // remove any surrounding quotes and extra spaces
          value = value.replace(/(^['"]|['"]$)/g, '').trim()
    
          obj[key] = value
        } else if (debug) {
          log(`did not match key and value when parsing line ${idx + 1}: ${line}`)
        }
      })
    
      return obj
    }
    
    // Populates process.env from .env file
    function config (options /*: ?DotenvConfigOptions */) /*: DotenvConfigOutput */ {
      let dotenvPath = path.resolve(process.cwd(), '.env')
      let encoding /*: string */ = 'utf8'
      let debug = false
    
      if (options) {
        if (options.path != null) {
          dotenvPath = options.path
        }
        if (options.encoding != null) {
          encoding = options.encoding
        }
        if (options.debug != null) {
          debug = true
        }
      }
    
      try {
        // specifying an encoding returns a string instead of a buffer
        const parsed = parse(fs.readFileSync(dotenvPath, { encoding }), { debug })
    
        Object.keys(parsed).forEach(function (key) {
          if (!process.env.hasOwnProperty(key)) {
            process.env[key] = parsed[key]
          } else if (debug) {
            log(`"${key}" is already defined in \`process.env\` and will not be overwritten`)
          }
        })
    
        return { parsed }
      } catch (e) {
        return { error: e }
      }
    }
    
    module.exports.config = config
    module.exports.load = config
    module.exports.parse = parse
    
    
    /***/ }),
    /* 7 */
    /***/ (function(module, exports) {
    
    module.exports = require("util");
    
    /***/ }),
    /* 8 */
    /***/ (function(module, exports) {
    
    function webpackEmptyContext(req) {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    webpackEmptyContext.keys = function() { return []; };
    webpackEmptyContext.resolve = webpackEmptyContext;
    module.exports = webpackEmptyContext;
    webpackEmptyContext.id = 8;
    
    /***/ }),
    /* 9 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _common_env_Hardware__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
    var path = __webpack_require__(1);
    
    
    global.base_path = function (folder) {
        var p = path.resolve(path.resolve());
        if(_common_env_Hardware__WEBPACK_IMPORTED_MODULE_0__[/* Hardware */ "a"].isElectron())
        {
            p = __webpack_require__(10).app.getAppPath();
        }
        if (folder) {
            p = path.resolve(p, folder);
        }
        return p;
    };
    global.app_path = function (folder) {
        return base_path(folder);
    };
    global.storage_path = function (folder) {
        return app_path(path.join('storage', folder ? folder : ""));
    };
    global.config_path = function (folder) {
        return app_path(path.join('config', folder ? folder : ""));
    };
    global.certificates_path = function (folder) {
        return app_path(path.join('certificates', folder ? folder : ""));
    };
    global.view_path = function (folder) {
        return base_path(path.join('views', folder ? folder : ""));
    };
    global.public_path = function (folder) {
        return base_path(path.join('public', folder ? folder : ""));
    };
    global.source_path = function (folder) {
        return base_path(path.join('src', folder ? folder : ""));
    };
    global.data_path = function(folder)
    {
        return base_path(path.join("data", folder?folder:""));
    }
    console.log('app_path:'+app_path());
    console.log('config_path:'+config_path());
    
    /***/ }),
    /* 10 */
    /***/ (function(module, exports, __webpack_require__) {
    
    /* WEBPACK VAR INJECTION */(function(__dirname) {var fs = __webpack_require__(2)
    var path = __webpack_require__(1)
    
    var pathFile = path.join(__dirname, 'path.txt')
    
    if (fs.existsSync(pathFile)) {
      module.exports = path.join(__dirname, fs.readFileSync(pathFile, 'utf-8'))
    } else {
      throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again')
    }
    
    /* WEBPACK VAR INJECTION */}.call(this, "/"))
    
    /***/ }),
    /* 11 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    
    // EXTERNAL MODULE: ./src/myno/common/utils/Objects.js
    var Objects = __webpack_require__(3);
    
    // EXTERNAL MODULE: ./src/myno/common/env/Hardware.js
    var Hardware = __webpack_require__(4);
    
    // EXTERNAL MODULE: ./src/myno/common/env/Root.js
    var Root = __webpack_require__(0);
    
    // EXTERNAL MODULE: ./src/myno/common/env/Configuration.js
    var env_Configuration = __webpack_require__(5);
    
    // EXTERNAL MODULE: external "fs"
    var external_fs_ = __webpack_require__(2);
    var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);
    
    // EXTERNAL MODULE: external "util"
    var external_util_ = __webpack_require__(7);
    
    // EXTERNAL MODULE: external "path"
    var external_path_ = __webpack_require__(1);
    var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
    
    // EXTERNAL MODULE: ./node_modules/dotenv/lib/main.js
    var main = __webpack_require__(6);
    var main_default = /*#__PURE__*/__webpack_require__.n(main);
    
    // CONCATENATED MODULE: ./src/myno/server/env/Configuration.js
    
    
     
    
    
    
    
    
    
    class Configuration_Configuration  extends env_Configuration["a" /* Configuration */]{
        static loadFileSync(file, prefix = false)
        {
            console.log('loading '+file);
            let extension = external_path_default.a.extname(file);
            if(!extension)
            {
                extension = external_path_default.a.basename(file);
            }
            if(extension == '.json')
            {
                //json with fault tolerant
                let result = 'return '+external_fs_default.a.readFileSync(file, {encoding:'utf-8'});
                result = new Function(result);
                result = result();
                if(prefix)
                {
                    this.merge(external_path_default.a.basename(file, extension), result);            
                }else
                {
                    this.merge( result);
                }
    
            }else
            if(extension == '.env')
            {
                main_default.a.config({ path: file })
            }else
            if(extension == '.js')
            {
                let result = require(file);
                if(prefix)
                {
                    this.merge(external_path_default.a.basename(file, extension), result);            
                }else
                { 
                    this.merge( result);
                }
            }
        }
        static loadFolderSync(folder, prefix = true)
        {
            let result = external_fs_default.a.readdirSync(folder);
            result.forEach((item)=>this.loadFileSync(external_path_default.a.join(folder,item), prefix));
        }
    }
    const config = function(key, value)
    {
        if(value != undefined)
        {
            return Configuration_Configuration.set(key, value);
        }
        return Configuration_Configuration.get(key);
    }
    //add Configuration methods to config
    for(let key of Object.getOwnPropertyNames(Configuration_Configuration))
    {
        if(typeof Configuration_Configuration[key] == "function")
        {
            config[key] = Configuration_Configuration[key];
        }
    }
    Root["a" /* root */].config = config;
    // CONCATENATED MODULE: ./src/myno/server/services/ConfigurationLoader.js
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfigurationLoader", function() { return ConfigurationLoader_ConfigurationLoader; });
    /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configurationLoader", function() { return configurationLoader; });
    
    const fs = __webpack_require__(2);
    const path = __webpack_require__(1);
    const paths = __webpack_require__(9)
    class ConfigurationLoader_ConfigurationLoader {
        boot() {
            return new Promise(async (resolve, reject)=>
        {
    
            try{
    
                Configuration_Configuration.loadFileSync(base_path('.env'));
                Configuration_Configuration.loadFileSync(base_path('storage/config.json'))
                Configuration_Configuration.loadFolderSync(source_path('myno/config'));
                Configuration_Configuration.loadFolderSync(config_path());
                resolve(Configuration_Configuration);
            }catch(error)
            {
                console.log(error);
                reject();
            }
        });
        }
        loadFileData(path)
        {
            let data = "return "+fs.readFileSync(path, 'utf8');
            let result = new Function(data);
            return result();
        }
        mergeWithDefaultOptions(name, config, default_options) {
            if (name) {
                if (config[name] == undefined) {
                    config[name] = {};
                }
                config = config[name];
            }
            let keys = Object.keys(default_options);
            for(let key of keys)
            {
                if(~key.indexOf('.'))
                {
                    let parts = key.split('.');
                    let k = parts.shift();
                    if(!default_options[k])
                    {
                        default_options[k] = {};
                    }
                    default_options[k][parts.join('.')] = default_options[key];
                    delete default_options[key];
                }
            }
            for (var p in default_options) {
                
                if (config[p] == undefined) {
                    config[p] = default_options[p];
                    continue;
                }
                if (typeof default_options[p] != typeof config[p]) {
                    //overwrite current options
                    config[p] = default_options[p];
                    continue;
                }
                if (typeof default_options[p] == "object") {
                    config[p] = this.mergeWithDefaultOptions(null, config[p], default_options[p]);
                }else{
                    config[p] = default_options[p];
                }
            }
            return config;
        }
    }
    var configurationLoader = new ConfigurationLoader_ConfigurationLoader();
    
    exports.configurationLoader = configurationLoader;
    exports.Configuration = Configuration_Configuration;
    /***/ })
    /******/ ]);