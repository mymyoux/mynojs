//convert
/* ghost.core.Root.*/
import { root as Root} from "../env/Root";
import { Strings } from "./Strings";
export class Classes {
    static getName(cls) {
        //es6
        var clsText = cls + "";
        var funcNameRegex = /function ([^\(]{1,})\(/;
        var results = (funcNameRegex).exec(clsText);
        if (results && results.length > 1) {
            return results[1];
        }
        var funcNameRegex = /class ([^\({]{1,}){/;
        var results = (funcNameRegex).exec(clsText);
        if (results != null && (results && results.length > 1)) {
            return Strings.trim(results[1]);
        }
        if (cls && cls.constructor && cls.constructor.name) {
            return cls.constructor.name;
        }
        return "";
    }
    /**
     * Tests if a class exists
     * @param name Class name
     * @return true or false
     */
    static exists(name) {
        if (!name) {
            return false;
        }
        var names = name.split(".");
        var len = names.length;
        let root = Root;
        for (var i = 0; i < len; i++) {
            root = root[names[i]];
            if (!root) {
                return false;
            }
        }
        return true;
    }
    /**
     * Tests if a class exists
     * @param name Class name
     * @return class constructor
     */
    static get(name) {
        if (!name) {
            return null;
        }
        if (typeof require === "function" && typeof require["specified"] === "function") {
            return require(name);
        }
        var root = Root;
        var names = name.split(".");
        var len = names.length;
        for (var i = 0; i < len; i++) {
            root = root[names[i]];
            if (!root) {
                return root;
            }
        }
        return root;
    }
    static isArray(variable) {
        return Object.prototype.toString.call(variable) === '[object Array]';
    }
}
