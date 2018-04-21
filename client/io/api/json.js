import { adapter } from "./adapter";
import axios from "axios";
export class json extends adapter
{
    load(request)
    {
        let req = request._request;
        return axios.get(this._config.baseUrl + req.path, {
            params:req.params            
        }).then((response)=>
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