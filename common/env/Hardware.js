import {root} from "./Root";
import {config} from "./Configuration";
export class Hardware {
    static isNode() {
        return typeof window == "undefined";
    }
    static isBrowser() {
        return !Hardware.isNode();
    }
    static isElectron()
    {
        return root.process && root.process.versions && root.process.versions['electron'];
    }
    static isCordova()
    {
        return  root.device && root.device.cordova != undefined;
    }
    /**
     * Get the version of Cordova running on the device.
     * @returns {*}
     */
    static getCordovaVersion() {
        return Hardware.isCordova() ? root.device.cordova : 0;
    }
    static getElectronVersion() {
        return Hardware.isElectron() ? root.process.versions['electron'] : 0;
    }
    /**
     * Gets app version
     */
    static getAppVersion() {
        return config("app.version", 0);
    }
    /**
     * Get the device's operating system name.
     * @returns {string}
     */
    static getOS() {
        if (root.device) {
            return root.device.platform;
        }
        var agent = root && root.navigator && root.navigator.userAgent ? navigator.userAgent.toLowerCase() : "node";
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
        return root && root.navigator && root.navigator.language ? root.navigator.language : "en";
    }
    /**
     * Get the device's Universally Unique Identifier (UUID).
     * @returns {string}
     */
    static getUUID() {
        return root.device ? root.device.uuid : "uuid";
    }
    /**
     * Get the operating system version.
     * @returns {string}
     */
    static getOSVersion() {
        return root.device ? root.device.version : "unkown";
    }
    /**
     * Get the device's model name.
     * @returns {string}
     */
    static getModel() {
        return root.device ? root.device.model : "unkown";
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
        if(root.process)
        {
            return root.process.version;
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
        return root.innerHeight;
    }
    /**
     * Gets screen width in pixels
     * @returns {Number}
     */
    static getScreenWidth() {
        return root.innerWidth;
    }
    /**
     * Gets screen orientation
     * @returns {Number} 0 = portrait, 90 = landscape rotated to left, 180 = portrait upside down, -90 = landscape rotated to right
     */
    static getOrientation() {
        return root["orientation"];
    }
    /**
     * Gets pixel ratio. 1 = 160 dpi, 2 = 320 dpi...
     * @returns {number}
     */
    static getPixelRatio() {
        var ratio = 1;
        // To account for zoom, change to use deviceXDPI instead of systemXDPI
        if (root.screen && root.screen.systemXDPI !== undefined && root.screen.logicalXDPI !== undefined && root.screen.systemXDPI > root.screen.logicalXDPI) {
            // Only allow for values > 1
            ratio = root.screen.systemXDPI / root.screen.logicalXDPI;
        }
        else if (root.devicePixelRatio !== undefined) {
            ratio = root.devicePixelRatio;
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
        return 160 * root.devicePixelRatio;
    }
    /**
     * Checks if the device is currently on portrait mode
     * @returns {boolean}
     */
    static isPortrait() {
        return root["orientation"] % 180 == 0;
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
            root.addEventListener("test", null, opts);
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