import { Maths } from "../../common/utils/Maths";
import { EventDispatcher } from "../../common/events/EventDispatcher";
import {Stream as StreamClass} from "../../common/io/Stream";


export function Stream()
{
    return function(target, key, descriptor)
    {
        let original = descriptor.value;
        descriptor.value = function(user, params, sender)
        {   
            let stream = new StreamClass((type, data, answerID)=>
            {
                sender.send("stream-data", {type,data,streamID:stream.id, answerID});
            });

            let result;
            try{

                result = original(user, params, stream);
            }catch(error)
            {
                result = Promise.reject(error);
            }
            if(!(result instanceof Promise))
            {
                result = Promise.resolve(result);
            }
            return result.then(()=>stream);
        };
        return descriptor;
    }
} 