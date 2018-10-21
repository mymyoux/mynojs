export class Room
{
    _type = null;
    _name = null;
    _sockets = {};
    constructor(name, application, type)
    {
        this.application = application;
        this._name = name;
        this._type = type;
    }
    onMessage(socket, message)
    {
        if(message.command == 'in')
        {
            this.in(socket);
            return;
        }
        if(!this._sockets[socket.user.id])
        {
            console.error('user not in room['+this._name+']: ', socket.user);
            return;
        }
        if(message.command == 'out')
        {
            this.out(socket);
            return;
        }
        if(message.command == 'broadcast')
        {
            this.broadcast(message.payload, socket);
            return;
        }
        if(message.command == 'writeone')
        {
            let socket = this.getSocket(message.payload.user)
            if(!socket)
            {
                console.error('bad_user:'+message.payload.user);
                return;
            }
            this.write(message.payload.command, message.payload.payload,socket);
            
            return;
        }
        return this.onCommand(socket, message);
    }
    getSocket(userid)
    {
        return this._sockets[userid];
    }
    onCommand(socket, message)
    {
        //TODO:override this
    }
    in(socket)
    {
        this._sockets[socket.user.id] = socket;
        let index = socket.in.indexOf(this);
        if(!~index)
        {
            console.log('['+this._name+']: entering of ', socket.user);
            socket.in.push(this);
        }
        console.log('['+this._name+']: '+Object.keys(this._sockets));
    }
    out(socket)
    {
        console.log('['+this._name+']: exiting of ', socket.user);
        delete this._sockets[socket.user.id];
        let index = socket.in.indexOf(this);
        if(~index)
        {
            socket.in.splice(index, 1);
        }
        console.log('['+this._name+']: '+Object.keys(this._sockets));
    }
    broadcast(message, sender)
    {
        console.log('BROADCAST', message);
        let socket;
        console.log(Object.keys(this._sockets));
        for(let p in this._sockets)
        {
            socket = this._sockets[p];
            console.log('broadcasting')
            if(socket === sender)
                continue;
            console.log('write to ', socket.user);
            this.write(message.command, sender?{user:sender.user,payload:message.payload}:{payload:message.payload}, socket)
        }
    }
    write(command, payload, socket)
    {
        
        this.application.write('room', {name:this._name, type:this._type, command, payload}, socket);
    }
    get name()
    {
        return this._name;
    }
}