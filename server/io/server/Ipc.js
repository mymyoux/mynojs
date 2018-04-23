import { CoreObject } from "../../../common/core/CoreObject";
import { StepHandler } from "../../../common/mixins/StepHandler";

import {ipcMain} from "electron";
import { api } from "../API";
import { Stream } from "../../../common/io/Stream";

export class Ipc extends StepHandler(CoreObject)
{
    _steps = []

    _binds = {};

    constructor()
    {
        super();
    }
    listen()
    {
        ipcMain.on('api', this._binds['api'] = this.onAPIRequest.bind(this));
        ipcMain.on('stream-data',this._binds['stream-data'] =  this.onStreamData.bind(this));
        ipcMain.on('stream-answer', this._binds['stream-answer'] =this.onStreamAnswer.bind(this));
    }
    onStreamAnswer(event, request)
    {
        let stream = Stream.getStream(request.streamID);
        if(!stream)
        {
            console.log('stream error: no stream with id '+request.streamID)
            return;
        }
        stream.onAnswerData(request.data, request.answerID);
    }
    onStreamData(event, request)
    {
        let stream = Stream.getStream(request.streamID);
        if(!stream)
        {
            console.log('stream error: no stream with id '+request.streamID)
            return;
        }
        let callback;
        if(request.answerID !== undefined)
        {
            let executed = false;
            callback = (data)=>
            {
                if(executed)
                {
                    return console.log('ALREADY ANSWERED ANSWER ID '+request.answerID+' STREAM ID '+stream.id);
                }
                executed = true;
                event.sender.send('stream-answer', {answerID:request.answerID,streamID:stream.id, data});
            };
        }
        stream.onData(request.type, request.data, callback);
    }
    onAPIRequest(event, request)
    {

        api().path(request.path).sender(event.sender).params(request.params).execute().then((data)=>
        {
            event.sender.send('api-answer', {
                success:true,
                data:data,
                answerID:request.answerID
            })
        }, (error)=>
        {
           
            event.sender.send('api-answer', {
                success:false,
                exception:{
                    message: error.message,
                    file: error.fileName,
                    line: error.lineNumber,
                    type: error.constructor + "",
                    fatal: error.fatal,
                    api: true,
                    from: request.path
                },
                answerID:request.answerID
            })
        });

    }
    dispose()
    {
        super.dispose();
        if(this._binds)
        {
            for(var key in this._binds)
            {
                ipcMain.removeListener(key, this._binds[key]);
            }
            this._binds = null;
        }
    }
}