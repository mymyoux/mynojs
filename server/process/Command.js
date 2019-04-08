const { spawn } = require('child_process');
const { EventDispatcher } = require( '../../common/events/EventDispatcher');
const { Promise } = require( 'bluebird');
const { Hardware } = require( '../../common/env/Hardware');
const path = require( "path");

 class Command extends EventDispatcher
{
    constructor(command, parameters, options)
    {
        super();
        this._command = command + ' '+parameters.join(' ')
        this._closedPromise = null;
        this._resolved = null;
        this._rejected = null;
        this._hadError = false;
        
        this._closedPromise = new Promise((resolve, reject)=>
        {
            this._resolved = resolve;
            this._rejected = reject;
        }); 
        if(!options)
        {
            options = {};
        }

        if (Hardware.isWindows())
        {
            if (command.indexOf('./') === 0 && options.cwd)
            {
                command = path.join(options.cwd, command);
            }

            var new_parameters  = ['/s', '/c', command];
            command             = 'cmd';
            parameters          = new_parameters.concat(parameters);
        }

        this._child = spawn(command, parameters, options);

        if(this._child.stdout)
            this._child.stdout.on('data', this.onData.bind(this));
        if(this._child.stderr)
            this._child.stderr.on('data', this.onError.bind(this));
        this._child.on('close', this.onClose.bind(this));
    }
    show()
    {
        if(this._child.stdout)
            this._child.stdout.pipe(process.stdout);
        if(this._child.stderr)
            this._child.stderr.pipe(process.stderr);
    }
    onData(data)
    {
        console.log(data.toString())
        this.trigger("data", data.toString());
    }
    onError(data)
    {
        this._hadError = true;
        console.log('command error', this._command, data.toString());
        this.trigger("error", data.toString());

    }
    onClose()
    {
        this.trigger("close");
        console.log('close')
        if(false && this._hadError) 
        {
            this._rejected();
        }else
        {
            this._resolved();
        }
        this.dispose();
    }
    end()
    {
        return this._closedPromise;
    }
 }
module.exports = {Command}