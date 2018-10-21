import {Room} from './Room';
export class Application
{
    name = null;
    socketio = null;
    _sockets = [];
    _commands = {}
    _rooms = {}
    _roomsType = {}
    constructor(name, socketio)
    {
        this.name = name;   
        this.socketio = socketio;
        this._commands = {
            login:this.onCommandLogin.bind(this)
        }
    }
    command(name, listener)
    {
        this._commands[name] = listener;
    }
    roomType(type, roomClass)
    {
        this._roomsType[type] = roomClass;
    }
    listen()
    {
        console.log(this.socketio);
        console.log('listen: '+this.name);
        this.socketio.of('/'+this.name).on('connection', (socket)=>
        {
            console.log('connexion');
            this._sockets.push(socket);
            this.onSocket(socket);
        })
    }
    onSocket(socket)
    {
        console.log('socket connecté');
        socket.in = [];
        socket.user = null;
        socket.on('server', this.onServerMessage.bind(this, socket))
        socket.on('room', this.onRoomMessage.bind(this, socket))
        socket.on('disconnect', this.onDisconnect.bind(this, socket))
    }
    onDisconnect(socket)
    {
        console.log('disconnect of ', socket.user);
        let index = this._sockets.indexOf(socket);
        if(~index)
        {
            this._sockets.splice(index, 1);
        }
        let room;
        for(let p in socket.in)
        {
            room = socket.in[p];
            room.out(socket);
        }
    }
    onServerMessage(socket, message)
    {
        if(!message.command)
        {
            console.error('no command');
            return;
        }
        if(!this._commands[message.command])
        {
            console.error('command doesn\'t exist: '+message.command);
            return;
        }
        let method = this._commands[message.command];
        method(socket, message.payload);
    }
    onRoomMessage(socket, message)
    {
        if(!message.command)
        {
            console.error('no command');
            return;
        }
        if(!message.name)
        {
            console.error('no room name');
            return;
        }
        if(!this._rooms[message.name])
        {
            this._rooms[message.name] = this.createRoom(message);
        }
        let room = this._rooms[message.name];
        room.onMessage(socket, message);
    }
    createRoom(message)
    {
        if(this._roomsType[message.type])
        {
            let cls = this._roomsType[message.type];
            return new cls(message.name, this);
        }
        return new Room(message.name, this);
    }
    onCommandLogin(socket, payload)
    {
        socket.user = payload.user;
        this.write('server', {command:'ready'}, socket);
    }
    write(type, data, socket)
    {
        socket.emit(type, data)
    }
    boot()
    {
        console.log('boot');
    }
}