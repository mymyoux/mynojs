import { Maths } from "../../common/utils/Maths";
import { EventDispatcher } from "../../common/events/EventDispatcher";
import {Stream as StreamClass} from "../../common/io/Stream";
import { wrap } from "../../common/annotations/wrap";

export function Stream(name, onInstance)
{
    let wrapped 
    let modifier =  function(target, key, descriptor)
    {
        
        wrapped = wrap(descriptor ,function(parameters, next)
        {
            let sender = parameters.get("sender");
            let stream = new StreamClass((type, data, answerID)=>
            {
                sender.send("stream-data", {type,data,streamID:stream.id, answerID});
            });
            parameters.replace("stream", stream);
            let result;
            try{
               result = next();
            }catch(error)
            {
                result = Promise.reject(error);
            }
            if(!(result instanceof Promise))
            {
                result = Promise.resolve(result);
            }
            return result.then(()=>stream);
        });
        
    }
    if(arguments.length == 3)
    {
        let result =  modifier(...arguments);
        wrapped.parameters.push('sender');
        return result;
    }

    return modifier;
}

  