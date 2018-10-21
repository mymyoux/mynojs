import {BaseWorker, MasterOnly, WorkerOnly} from './BaseWorker';
import {Hardware} from 'myno/common/env/Hardware';
export class CrossWorker extends BaseWorker
{
    static _tick = 0;
    _ports = [];
    constructor(name)
    {
        super();
       if(BaseWorker.isWorker())
       {
           this._interval = setInterval(this.checkAlive.bind(this), 60000);
       }
    }
    /**
     * Check if a port is alive - no native event
     */
    checkAlive()
    {
        if( CrossWorker._tick)
        {
            let port;
            for(let i=0; i<this._ports.length; i++)
            {
                port = this._ports[i];
                if(port.alive === undefined )
                {
                    port.alive = CrossWorker._tick;
                }
                if(port.alive != CrossWorker._tick)
                {
                    this.log('remove-clients', i);
                    this._ports.splice(i, 1);
                    i--;
                    continue;
                }
            }
        }
        this.log('total-clients', this._ports.length);
        CrossWorker._tick++;
        this.write('ping');
    }
    /**
     * Answer to alive request
     */
    pong(event)
    {
        event.port.alive =  CrossWorker._tick;
        this.log('pong', CrossWorker._tick);
    }
    /**
     * Ping - pong (needed for alive request)
     */
    ping()
    {
        this.write('pong');
    }
    listenFromMain()
    {
        //dont do anything
    }
    spawnHeavy()
    {
        this.spawn(new SharedWorker(Hardware.getCurrentScript()), false);
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
            this._instance = new SharedWorker(url)
        }
        this._instance = this._instance.port;
        this._instance.start();
        this._instance.onmessage = super.onMessage.bind(this);
        if(boot)
        {
            this.boot();
        }
    }
    addPort(port)
    {
        this._ports.push(port);
        this.log('booting', 'listen to incoming message', port);
        port.onmessage =  this.onMessage.bind(this, port);
        port.onmessageerror =  this.onError.bind(this, port);
        this._instance = self;
    }
    writeOne(port, command, ...data)
    {
        this.postMessageOne(port, {command, data});
    }
    postMessageOne(port, data)
    {
        this.log('send', data);
        return port.postMessage(data);
    }
    postMessage(data)
    {
        if(BaseWorker.isMaster())
        {
            return super.postMessage(data);
        }
        this.log('send-all', data);
        return this._ports.forEach((port)=>
        {
            port.postMessage(data);
        })
    }
   
    onMessage(port, event)
    {
        if(BaseWorker.isMaster())
        {
            return super.onMessage(...arguments);
        }
        event.port = port;
        super.onMessage(event);
    }
    onError(port, event)
    {
        if(BaseWorker.isMaster())
        {
            return super.onError(...arguments);
        }
        event.port = port;
        super.onError(event);
    }
}
export {BaseWorker, MasterOnly,WorkerOnly} 