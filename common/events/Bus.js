import { EventDispatcher } from "./EventDispatcher";
import {root} from "../env/Root";
class Bus extends EventDispatcher
{
    middlewares = {};
    addMiddleware(name, middleware)
    {
        this.middlewares[name] = middleware;
        middleware.count = {};
    }
    removeMiddleware(name, middleware)
    {
        delete this.middlewares[name];
    }
    added(listener)
    {
        if(!this.middlewares[listener.key1])
        {
            return;
        }
        let middleware = this.middlewares[listener.key1];
        if(middleware.count[listener.key2] == undefined)
        {
            middleware.count[listener.key2] = 0;
        }
        middleware.count[listener.key2]++;
        if(middleware.count[listener.key2] == 1)
        {
            middleware.start(listener.key2);
        }
    }
    removed(listener)
    {
        if(!this.middlewares[listener.key1])
        {
            return;
        }
        let middleware = this.middlewares[listener.key1];
        middleware.count[listener.key2]--;
        if(middleware.count[listener.key2] == 0)
        {
            middleware.stop(listener.key2);
        }
    }
    inspect()
    {
        return this._listeners.reduce((previous, item)=>
        {
            if(!previous[item.key1+":"+item.key2])
            {
                previous[item.key1+":"+item.key2] = 0;
            }
            previous[item.key1+":"+item.key2]++;
            return previous;
        }, {}); 
    }
}
export class BusMiddleware
{
    count = {};
    start(key)
    {

    }
    stop(key)
    {

    }
}
export const bus = new Bus;
export function event(name, ...data)
{
    bus.trigger(name, ...data);
}
root.bus = bus;