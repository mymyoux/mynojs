import { spawn } from 'child_process';
import { EventDispatcher } from '../../common/events/EventDispatcher';
import { Promise } from 'bluebird';

export class Command extends EventDispatcher
{
    _closedPromise = null;
    _resolved = null;
    _rejected = null;
    _hadError = false;
    constructor(command, parameters, options)
    {
        super();
        this._closedPromise = new Promise((resolve, reject)=>
        {
            this._resolved = resolve;
            this._rejected = reject;
        }); 
        if(!options)
        {
            options = {};
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
        this.trigger("data", data.toString());
    }
    onError(data)
    {
        this._hadError = true;
        this.trigger("error", data.toString());

    }
    onClose()
    {
        this.trigger("close");
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