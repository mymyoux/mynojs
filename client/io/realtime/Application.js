import io from 'socket.io-client';
import {Room} from './Room';
export class Application
{
    name = null;
    url = null;
    connected = false;
    ready = false;
    _rooms = {}
    user = null
    _commands = {}
    constructor(name, url)
    {
        this.name = name;
        this.url = url;
        this._commands = 
        {
            ready:this.onReady.bind(this)
        }
    }
    command(name, listener)
    {
        this._commands[name] = listener;
    }
    connect()
    {
        this.socket = io.connect(this.url+'/'+this.name, {
            transports: ['websocket']
          });
        this.socket.on('connect', this.onConnect.bind(this))
        this.socket.on('server', this.onServerMessage.bind(this))
        this.socket.on('room', this.onRoomMessage.bind(this))
    }
    onConnect()
    {
        this.connected = true;
        this.login();
    }
    login()
    {
        this.write('server', {
            command:'login',
            payload:
            {
                user:this.user
            }
        })
    }
    onServerMessage(message)
    {
        console.log('app receive:', message);
        if(!message.command)
        {
            console.erroor('no command');
            return;
        }
        if(!this._commands[message.command])
        {
            console.erroor('command doesn\'t exist: '+message.command);
            return;
        }
        let method = this._commands[message.command];
        method(message.payload);
    }
    onRoomMessage(message)
    {
        console.log('room receive['+message.name+']:', message);
        if(!message.name)
        {
            console.erroor('no room name');
            return;
        }
        this.room(message.name).onMessage(message);
    }
    onReady()
    {
        this.ready = true;
        let room;
        for(let p in this._rooms)
        {
            room = this._rooms[p];
            room.boot();
        }
    }
    write(type, data)
    {
        console.log('app emit['+type+']', data);
        this.socket.emit(type, data)
    }
    room(name, cls = null)
    {
        if(!cls)
        {
            cls = Room;
        }
        if(!this._rooms[name])
        {
            this._rooms[name] = new cls(name, this);
        }
        return this._rooms[name];
    }
}