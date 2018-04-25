import { spawn } from 'child_process';
import { EventDispatcher } from '../../common/events/EventDispatcher';
import { Promise } from 'bluebird';

export class Command extends EventDispatcher
{
    _closedPromise = null;
    _resolved = null;
    constructor(command, parameters, options)
    {
        super();
        this._closedPromise = new Promise((resolve, reject)=>
        {
            this._resolved = resolve;
        }); 
        console.log(options);
        this._child = spawn(command, parameters, options);
        this._child.stdout.on('data', this.onData.bind(this));
        this._child.stderr.on('data', this.onError.bind(this));
        this._child.on('close', this.onClose.bind(this));
    }
    onData(data)
    {
        this.trigger("data", data.toString());
    }
    onError(data)
    {
        this.trigger("error", data.toString());
    }
    onClose()
    {
        this.trigger("close");
        this._resolved();
        this.dispose();
    }
    end()
    {
        return this._closedPromise;
    }
}