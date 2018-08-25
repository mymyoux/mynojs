import { Configuration } from "../../common/env/Configuration";
import { CoreObject } from "../../common/core/CoreObject";
import { Arrays } from "../../common/utils/Arrays";
import { LocalForage } from "../data/Forage";
import { Strings } from "../../common/utils/Strings";
import { API, api } from "../io/API";
import { Classes } from "../../common/utils/Classes";
import {Model as BaseModel} from "../../common/mvc/Model";
export class Model extends BaseModel {
    id_name = 'id';

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
                    let parts = key.split(".");
                    let current = this;
                    let i = 0;
                    while(i<parts.length)
                    {
                        if(!current)
                        {
                            break;
                        }
                        try{

                            current = current[parts[i]]
                        }catch(error)
                        {
                            current = null;
                            break;
                        }
                        i++;
                    }



                    if (current != null) {
                        var v = current;
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
        return this.load(this.constructor["PATH_DELETE"], params, config)
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

    //new api
    save()
    {
        let request = new Request();
        request
        .path(this.getRootPath()+'/'+(this.hasID()?'update':'create'))
        .source(this);

        Object.keys(this)
        .filter((key)=>
        {
            return this[key] !== null && key.substring(0, 1)!='_';
        })
        .filter((key)=>
        {
            if(!this.hidden)
                return true;
            return !~this.hidden.indexOf(key);  
        })
        .forEach((key)=>
        {
            if(key == this.getIDName())
            {
                //id => model_id 
                request.addParam(this.getModelName()+'_id', this[key]);
            }else
            {
                request.addParam(key, this[key]);
            }
        });

        return request;
    }
    destroy()
    {
        //ignore
        if(!this.hasID())
            return Promise.resolve();

        let request = new Request();
        request.path(this.getRootPath()+'/delete');
        request.addParam(this.getModelName()+'_id', this.getID());
        return request;
    }
}
Model.PATH_CREATE = () => new ModelLoadRequest("%root-path%/create", null, { replaceDynamicParams: true, ignorePathLoadState: true, marksPathAsLoaded: false });
Model.PATH_GET = () => new ModelLoadRequest("%root-path%/get", { '%id-name%': '%id%' }, { replaceDynamicParams: true });
Model.PATH_DELETE = () => new ModelLoadRequest("%root-path%/delete", { '%id-name%': '%id%' }, { replaceDynamicParams: true, ignorePathLoadState: true, marksPathAsLoaded: false });
Model.PATH_UPDATE = () => new ModelLoadRequest("%root-path%/update", { '%id-name%': '%id%','%getModelName%':'%writeExternal%' }, { replaceDynamicParams: true, ignorePathLoadState: true, marksPathAsLoaded: false });
Model.regexp = /%([^%]+)%/g;
export class ModelLoadRequest {
    constructor(path, params = null, config = null) {
        this.path = path;
        this.params = params;
        this.config = config;
    }
}
ModelLoadRequest.regexp = /%([^%]+)%/g;


class Request{
    _cls = null;
    _path = null;
    _mapInto = null;
    _params = {}
    params(params)
    {
        this._params = params;
        return this;
    }
    addParams(params)
    {
        for(var k of params)
        {
            this.addParam(k, params[k]);
        }
        return this;
    }
    source(source)
    {
        this._mapInto = function(item)
        {
            let instance = source;
            if(instance.readExternal)
                instance.readExternal(item);
            else{
                for(var k in item)
                {
                    instance[k] = item[k];
                }
            }
            return instance;
        }
        return this;
    }
    param(key, value)
    {
        return this.addParam(key, value);
    }
    addParam(key, value)
    {
        this._params[key] = value;
        return this;
    }
    path(path)
    {
        this._path = path;
        return this;
    }
    mapInto(cls)
    {
        this._mapInto = function(item)
        {
            let instance = new cls();
            if(instance.readExternal)
                instance.readExternal(item);
            else{
                for(var k in item)
                {
                    instance[k] = item[k];
                }
            }
            return instance;
        }
        return this;
    }
    then(resolve, reject)
    {
        return api()
        .path(this._path)
        .params(this._params)
        .then((data)=>
        {
            if(data && this._mapInto)
                data = this._mapInto(data);
            resolve(data);
        }, reject);

    }
}