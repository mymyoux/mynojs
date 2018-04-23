import { Configuration } from "../../common/env/Configuration";
import { CoreObject } from "../../common/core/CoreObject";
import { Arrays } from "../../common/utils/Arrays";
import { LocalForage } from "../data/Forage";
import { Strings } from "../../common/utils/Strings";
import { API } from "../io/API";
import { Classes } from "../../common/utils/Classes";
export class Model extends CoreObject {
    constructor() {
        super();
        this._pathLoaded = {};
    }
    getClassName()
    {
        return Classes.getName(this);
    }
    get(key) {
        if (!key || key.length == 0) {
            throw new Error("Key must be defined - null given");
        }
        var methodName = "get" + key.substring(0, 1).toUpperCase() + key.substring(1);
        if (this[methodName]) {
            return this[methodName]();
        }
        return this[key];
    }
    set(key, value) {
        if (!key || key.length == 0) {
            throw new Error("Key must be defined - null given");
        }
        var methodName = "set" + key.substring(0, 1).toUpperCase() + key.substring(1);
        if (this[methodName]) {
            return this[methodName](value);
        }
        else {
            //TODO:add possibility to set key.object1.name = 'value'
            this[key] = value;
        }
        this.triggerForceChange(key);
    }
    getIDName() {
        var name = this.getModelName();
        return "id_" + Strings.uncamel(name);
    }
    getID() {
        var id_name = this.getIDName();
        if (id_name && this[id_name])
            return this[id_name];
        if (this["id"]) {
            return this["id"];
        }
        return null;
    }
    setID(value) {
        this.id = value;
        this[this.getIDName()] = value;
    }
    triggerChange(key) {
        this._trigger(Model.EVENT_CHANGE, key, this[key]);
    }
    triggerForceChange(key = null) {
        if (key)
            this._trigger(Model.EVENT_FORCE_CHANGE, key, this[key]);
        else
            this._trigger(Model.EVENT_FORCE_CHANGE);
    }
    _trigger(...params) {
        if (this["trigger"]) {
            this["trigger"](...params);
        }
    }
    triggerFirstData() {
        if (!this._firstData) {
            this._firstData = true;
            setTimeout(() => {
                this._trigger(Model.EVENT_FIRST_DATA);
            }, 0);
        }
    }
    getRootPath() {
        return this.getModelName();
    }
    getModelName() {
        if (!this._modelName) {
            var name = this.getClassName();
            name = name.replace('Model', '').toLowerCase();
            if (typeof this == "function")
                return name;
            this._modelName = name;
        }
        return this._modelName;
    }
    _path(path) {
        if (path.substring(0, 1) == ".") {
            path = this.getRootPath() + "/" + path.substring(1);
        }
        return path;
    }
    api(name, api_name) {
        return API.instance().request();//.name(this.getClassName() + "_" + name);
    }
    cache() {
        return LocalForage.instance().war(this.getClassName());
    }
    readExternal(input, path = null) {
        for (var p in input) {
            if (this[p] === undefined)
                this.invalidate();
            if (typeof this[p] == "function") {
                // console.warn("you overwrite function: "+p);
            }
            this[p] = input[p];
        }
        this.triggerFirstData();
        //this.data = input;
    }
    invalidate() {
        this._invalidated = true;
    }
    isInvalidated() {
        return this._invalidated;
    }
    validate() {
        if (!this.isInvalidated())
            return;
        this._invalidated = false;
        this._trigger(Model.EVENT_FORCE_CHANGE);
    }
    /**
    * Returns model's data
    * @returns {any}
    */
    writeExternal(remove_null_values = false) {
        var external = {};
        for (var p in this) {
            //TODO:check this not sure if needed
            // if(!this.hasOwnProperty(p))
            //     continue;
            if (typeof this[p] == "function") {
                continue;
            }
            if (Strings.startsWith(p, "_")) {
                continue;
            }
            if (remove_null_values === true && this[p] === null) {
                continue;
            }
            if (this[p] && typeof this[p] == "object" && typeof this[p]['writeExternal'] === 'function') {
                console.log("child writeExtenral", this[p]);
                external[p] = this[p]['writeExternal'](remove_null_values);
            }
            else {
                external[p] = this[p];
                // if(Arrays.isArray(external[p]))
                // {
                //     external[p] = this._writeExternal(external[p].slice());
                // }
            }
        }
        return external;
    }
    _writeExternal(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            //TODO:check this not sure if needed
            // if(!this.hasOwnProperty(p))
            //     continue;
            if (data[i] && typeof data[i] == "object" && typeof data[i]['writeExternal'] === 'function') {
                console.log("subchild writeExtenral", data[i]);
                data[i] = data[i]['writeExternal']();
            }
            else if (Arrays.isArray(data[i])) {
                console.log("is array: [" + i + "]", data[i]);
                data[i] = this._writeExternal(data[i].slice());
            }
        }
        return data;
    }
    /**
     * Replace %key% in strings
     *
     */
    replace(value) {
        var results = value.match(Model.regexp);
        if (results) {
            results.map(function (key) {
                return key.replace(/%/g, '');
            }).forEach((key) => {
                if (key == "root-path") {
                    value = value.replace('%root-path%', this.getRootPath());
                }
                else if (key == "id-name") {
                    value = value.replace('%id-name%', this.getIDName());
                }
                else if (key == "id") {
                    value = value.replace('%id%', "" + this.getID());
                }
                else {
                    if (this[key]) {
                        var v = this[key];
                        if (typeof v == "function")
                            v = v.call(this);
                        if (value == '%' + key + '%') {
                            if (typeof v == "object") {
                                //TODO:maybe json of that
                                value = v;
                                if (Arrays.isArray(v)) {
                                    value = v;
                                }
                            }
                            else {
                                value = value.replace('%' + key + '%', v);
                            }
                        }
                    }
                    else if (value == '%' + key + '%') {
                        value = null;
                    }
                }
            });
        }
        return value;
    }
    loadGet(params, config) {
        return this.load(this.constructor["PATH_GET"], params, config);
    }
    loadCreate(params, config) {
        return this.load(this.constructor["PATH_CREATE"], params, config);
    }
    loadUpdate(params, config) {
        return this.load(this.constructor["PATH_UPDATE"], params, config);
    }
    loadDelete(params, config) {
        return this.load(this.constructor["PATH_DELETE"], params, config);
    }
    getLoadPath(path) {
        if (typeof path == "function") {
            path = path.call(this);
        }
        if (path instanceof ModelLoadRequest) {
            path = path.path;
        }
        return path;
    }
    load(path, params, config = null) {
        if (!config)
            config = {};
        if (typeof path == "function") {
            path = path.call(this);
        }
        if (typeof params == "function") {
            params = params.call(this);
        }
        if (path instanceof ModelLoadRequest) {
            if (path.config) {
                for (var p in path.config) {
                    if (config[p] == undefined)
                        config[p] = path.config[p];
                }
            }
            if (!params)
                params = {};
            if (path.params) {
                for (var p in path.params) {
                    if (params[p] == undefined)
                        params[p] = path.params[p];
                }
            }
            path = path.path;
        }
        if (config.replaceDynamicParams) {
            path = this.replace(path);
            if (params) {
                var k;
                for (var p in params) {
                    if (Model.regexp.test(params[p])) {
                        params[p] = this.replace(params[p]);
                        if (params[p] == "undefined") {
                            delete params[p];
                        }
                    }
                    if (Model.regexp.test(p)) {
                        k = this.replace(p);
                        if (k != p) {
                            params[k] = params[p];
                            delete params[p];
                        }
                    }
                }
            }
        }
        if (config.execute !== false && config.ignorePathLoadState !== true) {
            //already loaded
            if (this._pathLoaded[path]) {
                if (typeof this._pathLoaded[path] != "boolean") {
                    //return promise
                    return this._pathLoaded[path];
                }
                console.log("shortcircuit: " + path);
                return new Promise((resolve, reject) => {
                    resolve();
                }).then(function () { });
            }
        }
        if (config.marksPathAsLoaded !== false) {
            this._pathLoaded[path] = true;
        }
        if (Configuration.isLocal()) {
            if (!params)
                params = {};
            if (params && params instanceof FormData) {
                params.append('__source', this.getClassName());
            }
            else {
                params.__source = this.getClassName();
            }
        }
        var request = this.getPathRequest(path, params, config)
        //TODO:implement always
            //.always(config.always === true);
        request["model_config"] = config;
        if (config.execute !== false) {
            return this._pathLoaded[path] = request.then((data) => {
                if (config.removePreviousModels) {
                    if (this["clearModels"]) {
                        this["clearModels"]();
                    }
                }
                if (config.callback) {
                    if (typeof config.callback == "function") {
                        config.callback(data, { ...config, path: path });
                    }
                    else {
                        this[config.callback](data, { ...config, path: path });
                    }
                }
                if (config.readExternal !== false) {
                    this.readExternal(data, { ...config, path: path });
                }
                if (config.readExternal !== false || config.callback)
                    this.validate();
                return data;
            }, (error) => {
                console.error(error);
                if (error.exception)
                    throw error.exception;
                else
                    throw error;
            });
        }
        return request;
    }
    getPathRequest(path, params, config) {
        path = this._path(path);
        return this.api(path, config.api_name).path(path).params(params);
    }
}
Model.EVENT_CHANGE = "change";
Model.EVENT_FIRST_DATA = "first_data";
Model.EVENT_FORCE_CHANGE = "force_change";
Model.PATH_CREATE = () => new ModelLoadRequest("%root-path%/create", null, { replaceDynamicParams: true, ignorePathLoadState: true, marksPathAsLoaded: false });
Model.PATH_GET = () => new ModelLoadRequest("%root-path%/get", { '%id-name%': '%id%' }, { replaceDynamicParams: true });
Model.PATH_DELETE = () => new ModelLoadRequest("%root-path%/delete", { '%id-name%': '%id%' }, { replaceDynamicParams: true, ignorePathLoadState: true, marksPathAsLoaded: false });
Model.PATH_UPDATE = () => new ModelLoadRequest("%root-path%/update", { '%id-name%': '%id%' }, { replaceDynamicParams: true, ignorePathLoadState: true, marksPathAsLoaded: false });
Model.regexp = /%([^%]+)%/g;
export class ModelLoadRequest {
    constructor(path, params = null, config = null) {
        this.path = path;
        this.params = params;
        this.config = config;
    }
}
ModelLoadRequest.regexp = /%([^%]+)%/g;