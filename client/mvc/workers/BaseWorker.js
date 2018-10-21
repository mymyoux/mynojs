import {Hardware} from 'myno/common/env/Hardware';
import {Auth} from 'myno/client/mvc/Auth';
import { make } from "myno/common/maker/make";
import { EventDispatcher } from "myno/common/events/EventDispatcher";
export class BaseWorker extends EventDispatcher
{
    static _registered = {};
    static _registered_cls = {};
    static _instance = null;
    static _worker = null;
    static _ports = [];
    static register(cls)
    {
        if(!cls.worker)
        {
            throw new Error('static property worker must be defined', cls);
        }
        this.renameMethods(cls);
        this.log('register', cls.worker, cls);
        this._registered_cls[cls.worker] = cls;
    }
    /**
     * On Worker: Rename methodWorker => method 
     * On Master: Rename methodMaster => method 
     * @param {*} cls 
     */
    static renameMethods(cls)
    {
        if(cls === BaseWorker || Object.getPrototypeOf(cls) === BaseWorker)
        {
            return;
        }
        if(!cls)
            return;
        let methods = Object.getOwnPropertyNames(cls.prototype);
        let isWorker = this.isWorker();
        for(let method of methods)
        {
            if(isWorker && ~method.indexOf('Worker'))
            {
                cls.prototype[method.replace('Worker', '')] = cls.prototype[method];
            }else
            if(!isWorker && ~method.indexOf('Master'))
            { 
                cls.prototype[method.replace('Master', '')] = cls.prototype[method];
            }
        }
        this.renameMethods(Object.getPrototypeOf(cls));
    }
    static execute(cls)
    {
        let instance = new cls();
    }
    static listen()
    {
        this.log('booting', 'listening');
        self.onmessage =  this.onMessage.bind(this);
        this._instance = self;
        self.onconnect = this.onConnect.bind(this);
    }
    static postMessage(data)
    {
        this.log('send', data);
        return this._instance.postMessage(data);
    }
    static onConnect(event)
    {
        let port = event.ports[0];
        this.log('connect', port);
        if(!this._worker)
        {
            port.onmessage = this.onMessage.bind(this);
            port.onmessageerror = this.onError.bind(this);
            this._ports.push(port);
        }else{
            this._worker.addPort(port);
        }
    }
    static onError(event)
    {
        this.log('error', event);
    }
    static onMessage(event)
    {
        this.log('receive', event);
        let data = event.data;
        if(data.command == 'worker')
        {
            let workerClass = this._registered_cls[data.data[0]];
            if(!workerClass)
            {
                throw new Error('bad worker type: '+ data.data);
            }
            this._worker = new workerClass();
            this._ports.forEach((port)=>this._worker.addPort(port))
            this._ports = [];
            
        }
    }
    static log(type, ...message)
    {
        console.log((BaseWorker.isWorker()?'[worker]':'[main]')+type+': ', ...message);
    }

    _instance = null;
    constructor()
    {
        super();
        BaseWorker._registered[name] = this;
        if(BaseWorker.isWorker())
        {
            this.listenFromMain();
        }
    }
    log(type, ...message)
    {
        return BaseWorker.log(type, ...message);
    }
    spawnHeavy()
    {
        this.spawn(new Worker(Hardware.getCurrentScript()), false);
        if(!this.constructor.worker)
        {
            throw new Error('static property worker must be defined', this);
        }
        this.write('worker', this.constructor.worker)
        this.boot();
    }
    spawn(url, boot = true)
    {
        if(typeof url == 'function')
        {
            this.log('spawn', 'spawning function');
            this._instance = new url();
        }else if(typeof url == 'object')
        {
            this.log('spawn', 'spawning instance');
            this._instance = url;
        }else
        {
            this.log('spawn', 'spawning url:'+url);
            this._instance = new Worker(url)
        }
        this._instance.onmessage = this.onMessage.bind(this);
        if(boot)
        {
            this.boot();
        }
    }
    boot()
    {
        this.write('user', Auth.check()?Auth.user().writeExternal():null);
    }
    listenFromMain()
    {
        this.log('booting', 'listen to incoming message', this);
        self.onmessage =  this.onMessage.bind(this);
        self.onmessageerror =  this.onError.bind(this);
        this._instance = self;
    }
    write(command, ...data)
    {
        this.postMessage({command, data});
    }
    postMessage(data)
    {
        this.log('send', data);
        return this._instance.postMessage(data);
    }
    onError(event)
    {
        this.log('error', event);
    }
    onMessage(event)
    {
        this.log('receive', event);
        let command = event.data.command;
        let data = event.data.data;
        switch(command) 
        {
            case 'user':
            if(data)
            {
                let cls = make('user');
                let model = new cls();
                model.readExternal(...data);
                Auth.setUser(model);
                
            }else
            {
                Auth.setUser(null);
            }
            this.log('user loggued', Auth.user());
            break;
            default:
                if(typeof this[command] == 'function')
                {
                    this.log(command, ...data, event);
                    this[command](...data, event);
                }else
                {
                    this.trigger(command, ...data, event);
                    this.log('not understood', command, data, event, this);
                }
        }
    }
    terminate()
    {
        return this._instance.terminate();
    }
    isWorker()
    {
        return BaseWorker.isWorker();
    }
    isMaster()
    {
        return BaseWorker.isMaster();
    }
    static isMaster()
    {
        return !this.isWorker();
    }
    static isWorker()
    {
        return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
    }
}
if(BaseWorker.isWorker())
{
    BaseWorker.listen();
}

export function WorkerOnly(name, options)
{ 
    return function(target, key, descriptor)
    {
        if(!BaseWorker.isWorker())
        {
            descriptor.value  = function()
            {
                this.write(key, ...arguments);
            };
        }
    }

}
export function MasterOnly(name, options)
{ 
    return function(target, key, descriptor)
    {
        if(BaseWorker.isWorker())
        {
            descriptor.value  = function()
            {
                this.write(key, ...arguments);
            };
        }
    }

}