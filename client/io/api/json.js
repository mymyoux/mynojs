import { adapter } from "./adapter";
import axios from "axios";
export class json extends adapter
{
    constructor(config)
    {
        super();
        this._adapterConfig = Object.assign({}, config?config:{});
    }
    load(request)
    {
        let req = request._request;
        let config =  Object.assign(this._adapterConfig,{
            params:req.params
        });
        return axios.get(this._config.baseUrl + req.path,config).then((response)=>
        {
            request.api_data = response.data.api_data;
            request.data = response.data.data;
            request.exception = response.data.exception;
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