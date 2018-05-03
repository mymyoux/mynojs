import { CoreObject } from "../../common/core/CoreObject";
import { json } from "./api/json";
import { Buffer } from "../../common/buffer/Buffer";
import { Stream } from "../../common/io/Stream";
import { EventDispatcher } from "../../common/events/EventDispatcher";

export class API extends CoreObject
{
    static EVENT_DATA = "eventdData";
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
        return API._instances[name];
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
        this._config = Object.assign(this._config, config);
        return this;
    }
    boot()
    {
        if(!this._config)
        {
            this._config = {};
        }
        this._config = Object.assign({
            adapter:new json
        }, this._config);

        this._config.adapter.config(this._config);

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
            request.then = null;
            let requestConfig = request._config;

            console.log("load", request);
            let promise;
            if(request.exception && requestConfig.retry)
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
            if(!fromAPI && request.exception)
            {
                return Promise.reject(request);
            }
            return request;
        });
    }
    load(request)
    {
        return this.execute(request, true).then((request)=>
        {   
            let requestConfig = request._config;

            if(request.exception)
            {
                return Promise.reject(request.exception);
            }
            if(request.data && request.data.streamID !== undefined)
            {
                //stream;
                let stream = new Stream((type, data, answerID)=>
                {
                    this._config.adapter.sendStream(stream, type, data, answerID);
                }, request.data.streamID);
                return stream;
            }   
            return request.data;
        });
    }
    then(resolve, reject)
    {
        return new Promise((resolve, reject)=>
        {   



        }).then(resolve, reject);
    }
}

class Request extends EventDispatcher
{
    _request = {params:{}};
    _api_data = null;
    _data = null;
    _exception = null;
    _exception = null;
    _config = {};
    constructor(api)
    {
        super();
        this._api = api;
        this._config = Object.assign({requestInstance:true}, this._api._config);
    }
    path(path)
    {
        this._request.path = path;
        return this;
    }
    config(config)
    {
        this._config = Object.assign(this._config, config);
        return this;
    }
    hasNoPaginate()
    {
        return !!this._api_data && !this._api_data.paginate
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
       return this._api.load(this).then(resolve, reject).then((data)=>
        {
            this.trigger(API.EVENT_DATA, data);
            return data;
        })
    }
    stream(resolve, reject)
    {
        console.log("request then");
       return this._api.stream(this).then(resolve, reject);
    }

    apidata(value)
    {
        this._apidata = value;
        this._loaded = true;
    }
    data(value)
    {
        this._data = value;
        this._loaded = true;
    }   
    exception(value)
    {
        this._exception = value;
        this._loaded = true;
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
