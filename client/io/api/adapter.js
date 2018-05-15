import { Objects } from "../../../common/utils/Objects";

export class adapter
{

    api(api)
    {
        this._api = api;
    }
    load(request, config)
    {
        return Promise.reject("abstract class");
    }   
    config(config)
    {
        this._config = Objects.assign({}, config);
        this._config.adapter = null;
    }
    addStream(stream)
    {
    }

    sendStream(stream, type, data, answerID)
    {
        
    }

}