import { adapter } from "./adapter";
import axios from "axios";
import Qs from "qs"
export class json extends adapter
{
    constructor(config)
    {
        super();
        this._adapterConfig = Object.assign({
            paramsSerializer: function(params) {
                return Qs.stringify(params, {arrayFormat: 'indices'})
              }
        }, config?config:{});
    }
    load(request)
    {
        let req = request._request;
        let config =  Object.assign(this._adapterConfig,{
        });
        config.url = this._config.baseUrl + req.path;
        config.method = "post";


        let fullurl = config.url+"?"+config.paramsSerializer(req.params);
        if(fullurl.length<2000)
        {
            config.method = "get";
            config.params = req.params;
        }else
        {
            config.method= "post";
            config.data = req.params;
        }
        return axios(config).then((response)=>
        {
            request.setapidata(response.data.api_data);
            request.data(response.data.data);
            request.exception(response.data.exception);
            //needed for not being called as promise
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