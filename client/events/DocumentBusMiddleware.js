import { BusMiddleware, bus } from "../../common/events/Bus";

export class DocumentBusMiddleware extends BusMiddleware
{
    _listeners = {};
    static register()
    {
        bus.addMiddleware("document", new DocumentBusMiddleware());
    }
    start(key)
    {
        document.addEventListener(key,this._listeners[key] = function()
        {
            bus.trigger("document:"+key, ...arguments);
        });
    }
    stop(key)
    {
        document.removeEventListener(key, this._listeners[key]);
        delete this._listeners[key];
    }
}