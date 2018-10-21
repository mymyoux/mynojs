import {EventDispatcher} from 'myno/common/events/EventDispatcher';
export class Room extends EventDispatcher
{
    _ready = false;
    _buffer = [];
    _type = null;
    constructor(name, application, type)
    {
        super();
        this.application = application;
        this._name = name;
        this._type = type;
    }
    boot()
    {
        this._ready = true;
        this.write('in', null, false);
        let message;
        while(this._buffer.length)
        {
            message = this._buffer.shift();
            this.write(message.command, message.payload, true);
        }

    }
    onMessage(message)
    {
        this.trigger(message.command, message.payload);
    }
    broadcast(command, payload)
    {
        this.write('broadcast', {command, payload})
    }
    writeOne(command, payload, user)
    {
        this.write('writeone', {command, payload, user:user.id})
    }
    write(command, payload, bufferable = true)
    {
        if(!this._ready)
        {
            if(bufferable)
                this._buffer.push({command, payload});
            return;
        }
        this.application.write('room', {name:this._name, type:this._type, command, payload});
    }
    get name()
    {
        return this._name;
    }
}