import { Configuration } from "../../common/env/Configuration";
import { CoreObject } from "../../common/core/CoreObject";
import { Arrays } from "../../common/utils/Arrays";
import { LocalForage } from "../data/Forage";
import { Strings } from "../../common/utils/Strings";
import { API } from "../io/API";
import { Classes } from "../../common/utils/Classes";
import {Model as BaseModel} from "../../common/mvc/Model";
export class Model extends BaseModel {
    constructor() {
        super();
        Object.defineProperty(this, "_pathLoaded", {
            enumerable: false,
            writable:true
        });
        this._pathLoaded = {};
    }
    getRootPath() {
        return this.getModelName();
    }
    _path(path) {
        if (path.substring(0, 1) == ".") {
            path = this.getRootPath() + "/" + path.substring(1);
        }
        return path;
    }
    api(name, api_name) {
        return api();//.name(this.getClassName() + "_" + name);
    }
    cache() {
        return LocalForage.instance().war(this.getClassName());
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