import { Controller } from "../mvc/Controller";
import { config } from "../../common/env/Configuration";
import { Stream } from "../io/Stream";

export class Ping extends Controller
{
    get()
    {
        return "pong";
    }
    @Stream()
    stream(user, params, stream)
    {
        stream.on('ping', function(data, callback)
        {
            if(callback)
            {
                callback('pong');
            }else
            {
                stream.send('pong');
            }
        })
    }
}