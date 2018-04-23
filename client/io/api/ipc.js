import { adapter } from "./adapter";
//import electron from "electron";
const {ipcRenderer} = window.require('electron')
import axios from "axios";
import { Maths } from "../../../common/utils/Maths";
import { Stream } from "../../../common/io/Stream";

export class ipc extends adapter
{
    _requests = {};
    _binds = {};
    load(request)
    {
        let req = request._request;
        req.answerID = Maths.getUniqueID();
        return (new Promise((resolve, reject)=>
        {
            this._requests[req.answerID] = {resolve:resolve, reject:reject};
            console.log("send:", req);
            ipcRenderer.send('api', req);
        })).then((response)=>
        {
            request.api_data = response.api_data;
            request.data = response.data;
            request.exception = response.exception;
            //needed for not being called as promise
            return [request];
        });
        // return axios.get(this._config.baseUrl + req.path, {
        //     params:req.params            
        // }).then((response)=>
        // {
        //     request.api_data = response.data.api_data;
        //     request.data = response.data.data;
        //     request.exception = response.data.exception;
        //     //needed for not being called as promise
        //     return [request];
        // });
    }  
    sendStream(stream, type, data, answerID)
    {
        ipcRenderer.send("stream-data",{type, data,streamID:stream.id, answerID});
    }

    onAPIAnswer(sender, answer)
    {
        let answerID  = answer.answerID;
        if(!this._requests[answerID])
        {
            throw new Error(answerID+" doesn't exist");
        }
        let request = this._requests[answerID];
        delete this._requests[answerID];
        request.resolve(answer);
        // if(answer.success)
        // {
        //     request.resolve(answer.data);
        // }else
        // {
        //     request.reject(answer.exception);
        // }
    }
    onStreamData(sender, request)
    {
        let stream = Stream.getStream(request.streamID);
        if(!stream)
        {
            throw new Error('stream not found: '+request.streamID);
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
                ipcRenderer.send('stream-answer', {answerID:request.answerID,streamID:stream.id, data});
            };
        }
        stream.onData(request.type, request.data, callback);
    }
    onStreamAnswer(sender, request)
    {
        let stream = Stream.getStream(request.streamID);
        if(!stream)
        {
            throw new Error('stream not found: '+request.streamID);
        }
        stream.onAnswerData(request.data, request.answerID);
    }
    config(config)
    {
        super.config(config);
        ipcRenderer.on('api-answer',  this._binds['api-answer'] = this.onAPIAnswer.bind(this));
        ipcRenderer.on('stream-data', this._binds['stream-data'] =  this.onStreamData.bind(this));
        ipcRenderer.on('stream-answer', this._binds['stream-answer'] =  this.onStreamAnswer.bind(this));
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