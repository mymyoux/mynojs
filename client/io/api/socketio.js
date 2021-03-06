import { adapter } from "./adapter";
import axios from "axios";
import Qs from "qs"
import { Objects } from "../../../common/utils/Objects";
import { Form } from "../../utils/Form";
export class socketio extends adapter
{
    constructor(config)
    {
        super();
        this._adapterConfig = Objects.assign({
            // paramsSerializer: function(params) {
                
                
            //     return "json="+JSON.stringify(params);
            //   }
        }, config?config:{});

        if(this._adapterConfig.indices)
        {
            this._adapterConfig.paramsSerializer =this.paramsSerializer.bind(this);
        }
    }
    paramsSerializer(params, arrayFormat)
   {
        if(!arrayFormat)
        {
                arrayFormat = this._adapterConfig.arrayFormat ? this._adapterConfig.arrayFormat:'brackets';
        }
        return Qs.stringify(params, {arrayFormat: arrayFormat})
   } 
    load(request)
    {
        let req         = request._request;
        let config      = Objects.assign(this._config, {});
        config          = Objects.assign(this._adapterConfig, config);
        config.url      = this._config.baseUrl + req.path;
        config.method   = "post";

        if (!config.params)
            config.params = {};

        const needsFormData = Form.needsFormData(req.params);

        let useGet = !needsFormData && (config.url+"?"+this.paramsSerializer(req.params, 'indices')).length<2000;
        if(useGet)
        {
            config.method = "get";
            config.params = Objects.assign(config.params, req.params);
        }else
        {
            config.method= "post";
            config.data = Objects.assign(config.params, req.params);
        }
        if(config.data)
        {
            if(this._adapterConfig.indices)
            {
                config.data.__type = "indices";
            }else
            {
                config.data.__type = "json";
            }
        }
        if(config.params)
        {
            if(this._adapterConfig.indices)
            {
                config.params.__type = "indices";
            }else
            {
                    config.params.__type = "json";
            }
        }
        
        if(needsFormData)
        {
            config.data.__type = "formdata";
            config.old = config.data;
            config.data = Form.toFormData(config.data);
            if(!config.headers)
            {
                config.headers = {};
            }
            config.headers['Content-Type'] = 'multipart/form-data';
        }else{
            if( config.params.__type  == 'json')
            {
                for(let key in config.data )
                {
                    if(key == '__type')
                        continue;
                    config.data[key] = JSON.stringify(config.data[key]);
                }
                for(let key in config.params )
                {
                    if(key == '__type')
                        continue;
                    config.params[key] = JSON.stringify(config.params[key]);
                }
            }
            if(!this._adapterConfig.indices)
            {
                // if(config.method == 'post' && Object.keys(config.data).length)
                //     config.data = {json:config.data, '__type':'json'};
                // else
                // if(config.method == "get" && Object.keys(config.params).length)
                //     config.params = {json:config.params, '__type':'json'};
            }
        }
        //config.paramsSerializer = this.paramsSerializer.bind(this);
        return axios(config).then((response)=>
        {
            request.setapidata(response.data.api_data);
            request.data(response.data.data);
            request.exception(response.data.exception);
            //needed for not being called as promise
            return [request];
        },(error)=>
        {
            request.setapidata(null);
                request.data(null);
                request.exception(error);
            return [request];
        });
    }  
    config(config)
    {
        super.config(config);
        
        this._config = Objects.assign({
            baseUrl:window.origin
        }, this._config);

        if(!this._config.baseUrl.endsWith('/'))
        {
            this._config.baseUrl+="/";
        }
    }
    addStream(stream)
    {
        this.retrieveStream(stream);
    }
    retrieveStream(stream)
    {
        this._api.request().path('stream/get').param("stream_id", stream.id).then((result)=>
        {
            let {data:results, end} = result;
            results.forEach((item)=>
            {
                if(item.type == "stream-data")
                {
                    this.onStreamData(stream, item.data);
                    //stream.onData(item.type, item.data);
                }else if(item.type == 'stream-answer')
                {
                    this.onStreamAnswer(stream, item.data);
                }
            });
            if(end)
            {
                stream.close();
            }else
            {
                setTimeout(()=>
                {
                    this.retrieveStream(stream);
                }, results.length==0?200:100);
            }
        },(error)=>
        {
            stream.trigger('error', error); 
            stream.close();
        });
    }
    sendStream(stream, type, data, answerID)
    {
        this._api.request().path('stream/send').param("stream_id", stream.id).params({type,data,answerID}).then((result)=>
        {

        });
    }
    answer(params)
    {
        this._api.request().path('stream/answer').params(params).then((result)=>
        {
            //ignore
        },(error)=>
        {   
            debugger;
        });
    }
    onStreamData(stream, request)
    {
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
               this.answer({answerID:request.answerID,streamID:stream.id, data});
            };
        }
        stream.onData(request.type, request.data, callback);
    }
    onStreamAnswer(stream, request)
    {
        stream.onAnswerData(request.data, request.answerID);
    }
}