export class adapter
{

    load(request, config)
    {
        return Promise.reject("abstract class");
    }   
    config(config)
    {
        this._config = Object.assign({}, config);
        this._config.adapter = null;
    }

}