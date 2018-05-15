import { CoreObject } from "../../common/core/CoreObject";
import { json } from "./api/json";
import { Buffer } from "../../common/buffer/Buffer";
import { Stream } from "../../common/io/Stream";
import { EventDispatcher } from "../../common/events/EventDispatcher";
import { Objects } from "../../common/utils/Objects";

export class API extends CoreObject
{
    static _instances = {};
    static register(name, config)
    {
        if(typeof name != "string")
        {
            config = name;
            name = "default";
        }
        if(!API._instances[name])
        {
            API._instances[name] = new API;
            API._instances[name]._name = name;
        }
        API._instances[name].config(config);
        return API._instances[name];
    }
    static instance(name)
    {
        if(!name)
        {
            return API._instances['default'];
        }
        if(! API._instances[name])
        {
            return API._instances['default'];
        }
        return API._instances[name];
    }
    static scope(name, instance = "default")
    {
        API._instances[name] =  API._instances[instance];
    }
    _config = {};
    _buffer = {};
   
    _name = null;
    instance(name)
    {
        return API.instance(name);
    }
    get name()
    {
        return this._name;
    }
    request()
    {
        return new Request(this);
    }
    
    config(config)
    {
        if(!this._config)
        {
            this._config = {};
        }
        this._config = Objects.assign(this._config, config);
        return this;
    }
    boot()
    {
        if(!this._config)
        {
            this._config = {};
        }
        this._config = Objects.assign({
            adapter:new json
        }, this._config);

        this._config.adapter.config(this._config);
        this._config.adapter.api(this);

    }
    _getBufferKey(request)
    {
        //TODO:implement this
        return "default";
    }
    execute(request, fromAPI)
    {
        let bufferKey = this._getBufferKey(request);
        if(!this._buffer[bufferKey])
        {
            this._buffer[bufferKey] = new Buffer;
            this._buffer[bufferKey].loading = false;
        }
        let buffer = this._buffer[bufferKey];
        let promise =  buffer.push(this._execute, this, request, fromAPI);
        if(!buffer.loading)
        {
            buffer.execute();
        }
        buffer.loading = true;
        return promise;
    }
    _execute(request, fromAPI)
    {
        let bufferKey = this._getBufferKey(request);
        let buffer = this._buffer[bufferKey];
        return this._config.adapter.load(request, this._config).then((request)=>
        {   
            request = request[0];
            let requestConfig = request._config;

            console.log("load", request);
            let promise;
            if(request._exception && requestConfig.retry)
            {
                promise = buffer.unshift(this._execute, this, request, true);
            }

            if(buffer.length)
                buffer.execute();
            else
                buffer.loading = false;
                
            if(promise)
            {
                return promise;
            }
            if(!fromAPI && request._exception)
            {
                return Promise.reject([request]);
            }
            return [request];
        }); 
    }
    load(request)
    {
        return this.execute(request, true).then((request)=>
        {   
            request = request[0];
            let requestConfig = request._config;

            if(request._exception)
            {
                return Promise.reject(request._exception);
            }
            if(request._data && request._data.streamID !== undefined)
            {
                //stream;
                let stream = new Stream((type, data, answerID)=>
                {
                    this._config.adapter.sendStream(stream, type, data, answerID);

                }, request._data.streamID);
                this._config.adapter.addStream(stream);
                return stream;
            }   
            return request._data;
        });
    }
    then(resolve, reject)
    {
        return new Promise((resolve, reject)=>
        {   



        }).then(resolve, reject);
    }
}

class Request 
{
    _request = {params:{}};
    _api_data = null;
    _data = null;
    _exception = null;
    _executed = false;
    _executing = false;
    _promise = null;
    _config = {};
    constructor(api)
    {
        this._api = api;
        this._config = Objects.assign({requestInstance:true}, this._api._config);
        this._promise = null;
    }
    reset()
    {
        this._data = null;
        this._exception = null;
        this._executing = null;
        this._promise = null;
        this._executed = false;
        this._api_data = null;
        this._request.params = {};
    }
    clone()
    {
        let cls =  this.constructor;
        let req = new cls(this._api);
        req._config = Objects.clone(this._config);
        req._request = Objects.clone(this._request);
        return req;
    }
    apidata(key)
    {
        if(!this._api_data)
        {
            return null;
        }
        if(!key)
        {
            return this._api_data;
        }
        let keys = key.split('.');
        let value = this._api_data;
        for(let k of keys)
        {
            value = value[k];
            if(value == null)
            {
                return value;
            }
        }
        return value;
    }
    path(path)
    {
        this._request.path = path;
        return this;
    }
    config(config)
    {
        this._config = Objects.assign(this._config, config);
        return this;
    }
    getPath()
    {
        return this._request.path;
    }
    hasParam(name)
    {
        return this._request.params[name] != undefined;
    }
    param(name, value)
    {
        this._request.params[name] = value;
        return this;
    }
    params(params)
    {
        if(params)
        {
            Object.keys(params).forEach((key)=>
            {
                this.param(key, params[key]);
            });
        }
        return this;
    }
    async execute()
    {
      console.log("request then");
       return this._api.execute(this);
    }
    then(resolve, reject)
    {
        if( this._promise)
        {
            return  this._promise.then(resolve, reject);
        }
        this._executing = true;
       return this._promise = this._api.load(this).then((data)=>
        {
            this._executing = false;
            this._executed = true;
            return data;
        }, (error)=>
        {
            this._executing = false;
            this._executed = true;
            return Promise.reject(error);
        }).then(resolve, reject)
    }
    stream(resolve, reject)
    {
        console.log("request then");
       return this._api.stream(this).then;//(resolve, reject);
    }

    setapidata(value)
    {
        this._api_data = value;
        this._loaded = true;
    }
    data(value)
    {
        console.log(value);
        this._data = value;
        this._loaded = true;
    }   
    exception(value)
    {
        this._exception = value;
        this._loaded = true;
    }
    get [Symbol.toStringTag]()
    {
        return this._request.path;
    }
}


let ___api = API.register({});
export const api = new Proxy(function(name)
{
    return API.instance(name).request();
},{
    get:function(obj, prop)
    {
        return ___api[prop];
    }
});
