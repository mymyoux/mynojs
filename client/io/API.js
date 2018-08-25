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
    getBaseURL()
    {
        return this._config.baseUrl;
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
    _paginate = null;
    _nextPaginate = null;
    _previousPaginate = null;
    constructor(api)
    {
        this._api = api;
        this._config = Objects.assign({requestInstance:true}, this._api._config);
        this._promise = null;
    }
    getBaseURL()
    {
        return this._config.baseUrl;
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
    resetForPaginate()
    {
        this._data = null;
        this._exception = null;
        this._executing = null;
        this._promise = null;
        this._executed = false;
        this._api_data = null;
        if(this._request.params)
        {
            delete this._request.params.paginate;
        }
    }
    resetPaginate(){
        this._paginate = null;
        this._nextPaginate = null;
        this._previousPaginate = null;
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
    _computePaginate()
    {
        // save next and previous 
        //why ? => if no data no next/previou
        let paginate = this.apidata("paginate");
        if(!paginate)
        {
            //no paginate
            return;
        }
        if(!this._paginate)
        {
            this._paginate = {};
        }
        //set local paginate
        this._paginate.keys = paginate.keys;
        this._paginate.directions = paginate.directions;
        this._paginate.limit = paginate.limit;

        if(!this._paginate.nextAll && paginate.next)
        {
            this._paginate.nextAll = paginate.next;
        }
        if(!this._paginate.previousAll && paginate.previous)
        {
            this._paginate.previousAll = paginate.previous;
        }

        if ( paginate.next &&  paginate.next.length) {
            this._paginate.next = paginate.next;
            let isNextAll = true;
                for (let i = 0; i < paginate.next.length; i++) {
                    if (!((this._paginate.nextAll[i] < paginate.next[i] && paginate.directions[i] > 0) || (this._paginate.nextAll[i] > paginate.next[i] && paginate.directions[i] < 0))) {
                        if (this._paginate.nextAll[i] == paginate.next[i]) {
                            continue;
                        }
                        isNextAll = false;
                        break;
                    } else {
                        break;
                    }
                }
            if(isNextAll)
            {
                this._paginate.nextAll = paginate.next;
            }
        }
        if ( paginate.previous &&  paginate.previous.length) {
            let isPreviousAll = true;
            this._paginate.previous = paginate.previous;
                for (let i = 0; i <  paginate.previous.length; i++) {
                    if (!((this._paginate.previousAll[i] <  paginate.previous[i] &&  paginate.directions[i] < 0) || (this._paginate.previousAll[i] >  paginate.previous[i] &&  paginate.directions[i] > 0))) {
                        if (this._paginate.previousAll[i] ==  paginate.previous[i]) {
                            continue;
                        }
                        isPreviousAll = false;
                        break;
                    } else {
                        break;
                    }
                }
            if(isPreviousAll)
            {
                this._paginate.previousAll =  paginate.previous;
            }
        }
        console.log("computed _paginate: ",this._paginate);
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
            if(params instanceof FormData)
            {
                this._request.params = params;
            }else{
                this._request.params = Objects.assign(this._request.params, params);
            }
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
        if(this._paginate)
        {
            if(!this._request.params)
            {
                this._request.params = {};
            }
            this._request.params.paginate = {
                keys:this._paginate.keys,
                directions:this._paginate.directions,
                limit:this._paginate.limit,
            }
        }
        if(this._nextPaginate)
        {
            this._request.params.paginate.next = this._nextPaginate;
        }else
        if(this._previousPaginate){
            this._request.params.paginate.previous = this._previousPaginate;
        }
        this._executing = true;
       this._promise = this._api.load(this).then((data)=>
        {
            this._executing = false;
            this._executed = true;
            if(data && data.exception)
            {
                event('toaster', {message:data.message, type:'error'});
                return Promise.reject(data);
            }
            return data;
        }, (error)=>
        {
            this._executing = false;
            this._executed = true;
            return Promise.reject(error);
        });

        return  this._promise.then(resolve, reject);
    }
    paginate(options)
    {
        this.resetForPaginate();
        if(! this._paginate)
        {
            this._paginate = {};
        }else
        {
            delete this._paginate.nextAll;
            delete this._paginate.previousAll;
            delete this._paginate.next;
            delete this._paginate.previous;
        }
        this._paginate = Objects.assign(this._paginate, options);
        return this;
    }
    limit(number)
    {
        if(typeof number != "number")
        {
            throw new Error('limit must be a integer');
        }
        number = parseInt(number);
        if(isNaN(number))
        {
            throw new Error('limit must be a integer');
        }
        if(number <= 0)
        {
            throw new Error('limit can\'t be <= 0');
        }
        if(!this._paginate)
        {
            this._paginate = {};
        }
        this.resetForPaginate();
        this._paginate.limit = number;
    }
    _next(data)
    {
        if(!this._paginate)
        {
            this._paginate = {};
        }
        this.resetForPaginate();
        this._paginate._previousPaginate = null;
        this._nextPaginate = data;
        return this;
    }
    _previous(data)
    {
        if(!this._paginate)
        {
            this._paginate = {};
        }
        this.resetForPaginate();
        this._paginate._nextPaginate = null;
        this._previousPaginate = data;
        return this;
    }
    sort(options)
    {
        return this.order(...arguments);
    }
    order(options)
    {
        if(!options)
        {
            throw new Error('options can\'t be null')
        }
       if(Array.isArray(options))
       {    
            options = options.reduce(function(order, row)
            {
                if(Array.isArray(row))
                {
                    order[row[0]] = row[1]
                    row = row[0];
                }else{
                    order[row] = 1;
                }
                return order;
            }, {});
       }
       if(!this._paginate)
       {
           this._paginate = {};
        }
        this.resetForPaginate();
       this._paginate.keys = [];
       this._paginate.directions = [];
       for(var key in options)
       {
           let direction = options[key];
            if(typeof direction != number || isNaN(direction))
            {
                throw new Error('direction must be a number')
            }
            if(direction == 0)
            {
                throw new Error('direction can\'t be 0');
            }
            if(direction>0)
            {
                direction = 1;
            }else
            {
                direction = -1
            }
            this._paginate.keys.push(key);
            this._paginate.directions.push(direction);
       }
       return this;
    }
   
    next(data)
    {
        if(data)
        {
            return this._next(data);
        }
        if(!this._paginate)
        {
            throw new Error("you can\'t next a non paginated request");
        }   
        this.resetForPaginate();
        //let paginate = Object.assign(this._paginate,{});
        this._previousPaginate = null;
        if(!this._paginate.next)
        {
            throw new Error('no next value for paginate');
        }
        this._nextPaginate = this._paginate.next;
        //paginate = {keys:paginate.keys, directions:paginate.directions, limit:paginate.limit, next:paginate.next};
        //this.params({paginate:paginate});
        return this;
    }
    nextAll()
    {
        
        if(!this._paginate)
        {
            throw new Error("you can\'t next a non paginated request");
        }   
        this.resetForPaginate();
        this._previousPaginate = null;
        if(!this._paginate.nextAll)
        {
            throw new Error('no nextAll value for paginate');
        }
        this._nextPaginate = this._paginate.nextAll;
        return this;
    }
    previous(data)
    {
        if(data)
        {
            return this._previous(data);
        }
        if(!this._paginate)
        {
            throw new Error("you can\'t previous a non paginated request");
        }   
        this.resetForPaginate();
        this._nextPaginate = null;
        if(!this._paginate.previous)
        {
            throw new Error('no previous value for paginate');
        }
        this._previousPaginate = this._paginate.previous;
        return this;
    }
    previousAll()
    {
        if(!this._paginate)
        {
            throw new Error("you can\'t previous-all a non paginated request");
        }   
        this.resetForPaginate();
        this._nextPaginate = null;
        if(!this._paginate.previousAll)
        {
            throw new Error('no previousAll value for paginate');
        }
        this._previousPaginate = this._paginate.previousAll;
        return this;
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
        this._computePaginate();
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
