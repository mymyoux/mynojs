import { adapter } from "./adapter";
import axios from "axios";
import Qs from "qs"
export class json extends adapter
{
    constructor(config)
    {
        super();
        this._adapterConfig = Object.assign({
            // paramsSerializer: function(params) {
            //     return Qs.stringify(params, {arrayFormat: 'indices'})
            //   }
        }, config?config:{});

        if(this._adapterConfig.indices)
        {
            this._adapterConfig.paramsSerializer =this.paramsSerializer;
        }
    }
    paramsSerializer(params)
   {
        return Qs.stringify(params, {arrayFormat: 'indices'})
   } 
    load(request)
    {
        let req = request._request;
        let config =  Object.assign(this._adapterConfig,{
        });
        config.url = this._config.baseUrl + req.path;
        config.method = "post";


        let fullurl = config.url+"?"+this.paramsSerializer(req.params);
        if(fullurl.length<2000)
        {
            config.method = "get";
            config.params = req.params;
        }else
        {
            config.method= "post";
            config.data = req.params;
        }
        if(config.data)
            if(this._adapterConfig.indices)
            {
                config.data.__type = "indices";
            }else
            {
                config.data.__type = "json"
            }
        if(config.params)
            if(this._adapterConfig.indices)
            {
                config.params.__type = "indices";
            }else
            {
                config.params.__type = "json"
            }
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
        
        this._config = Object.assign({
            baseUrl:window.origin
        }, this._config);

        if(!this._config.baseUrl.endsWith('/'))
        {
            this._config.baseUrl+="/";
        }
    }
}