import { BusMiddleware, bus } from "../../common/events/Bus";

export class WindowBusMiddleware extends BusMiddleware
{
    _listeners = {};
    static register()
    {
        bus.addMiddleware("window", new WindowBusMiddleware());
    }
    start(key)
    {
        window.addEventListener(key,this._listeners[key] = function()
        {
            bus.trigger("window:"+key, ...arguments);
        });
    }
    stop(key)
    {
        window.removeEventListener(key, this._listeners[key]);
        delete this._listeners[key];
    }
}