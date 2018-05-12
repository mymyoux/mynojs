import { Maths } from "../utils/Maths";
import { EventDispatcher } from "../events/EventDispatcher";
import { ENGINE_METHOD_DIGESTS } from "constants";
export var streamStats = {
    count:0
}
export class Stream extends EventDispatcher
{
    // static _count = 0;
    static _streams = {};
    static getStream(id)
    {
        return Stream._streams[id];
    }
    _id = null;
    _closed = false;
    _sender = false;
    _asks = {};
    _buffer = [];
    constructor(sender, id)
    {
        super();
        this._sender = sender;
        this._id = id === undefined?Maths.getUniqueID():id;
        // Stream._count++;
        streamStats.count++;
        Stream._streams[this._id] = this;
    }
    get id()
    {
        return this._id;
    }
    onData(type, data, callback)
    {
        if(type == "close" && !data)
        {
            return this.close(true);
        }
        this.trigger(type, data, callback);
    }
    onAnswerData(data, answerID)
    {
        let listener = this._asks[answerID];
        if(!listener)
        {
            return console.log("NO ANSWER FOR ID "+answerID);
        }
        delete this._asks[answerID];
        listener.resolve(data);
    }
    ask(type, data)
    {
        if(this._closed)
        {
            throw new Error("steam already closed");
        }
        let id = Maths.getUniqueID();
        return new Promise((resolve, reject)=>
        {
            this._asks[id] = {resolve, resolve};
            this._sender(type, data, id);
        });
    }
    send(type, data)
    {
        if(this._closed)
        {
            throw new Error("steam already closed");
        }
        this._sender(type, data);
        return this._buffer.length;
    }
    close(fromClient = false)
    {
        if(this._closed)
        {
            //ignore
            return;
        }
        this.trigger("close");
        if(!fromClient)
        {
            this.send("close");
        }
        if(!this._buffer.length)
        {
            this.dispose();
        }
        //Stream._count--;
        this._closed = true;
    }
    get closed()
    {
        return this._closed;
    }
    flush()
    {
        this.trigger("_internal:flushed");
        let buffer = this._buffer;
        this._buffer = [];
        if(this._closed)
        {
            this.dispose();
        }
        return buffer;
    }
    dispose()
    {   
        delete Stream._streams[this._id];
        streamStats.count--;
        super.dispose();
    }
    writeExternal(user)
    {
        return {streamID:this._id};
    }
}
