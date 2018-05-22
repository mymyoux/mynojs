import { Functions } from "../utils/Functions";
import { wrap } from "./wrap";
import { Objects } from "../utils/Objects";

export function Param(name, options)
{
    if(typeof name == "string")
    {
        options = Objects.assign({name:name}, options);
    }else{
        options = name;
        if(!name)
        {
            throw new Error('param must have a name');
        }
    }

    options = Objects.assign({required:false}, options);

    return function(target, key, descriptor)
    {
        wrap(descriptor, function(parameters, next)
        {
            let params = parameters.get('params');
            if(!params)
            {
                throw new Error('params must be in method parameters');
            }
            let value = params[options.name];
            
            if(options.default != undefined && value == null)
            {
                value = options.default;
            }
            if(options.required)
            {
                if(value == null)
                {
                    throw new Error(options.name+" is required");
                }
            }
            if(options.type && value != undefined)
            {
                if(options.type == Boolean)
                {
                    if(value == "false" || value == 0)
                    {
                        value = false;
                    }else
                    if(value == "true" || value == 1)
                    {
                        value = true;    
                    }
                    if(typeof value != "boolean")
                    {
                        throw new Error(options.name+" must be "+options.type.name+", given "+(typeof value));
                    }
                }
                if(options.type == Number)
                {
                    value = parseFloat(value);
                    if(typeof value != "number" || isNaN(value))
                    {
                        throw new Error(options.name+" must be "+options.type.name+", given "+(typeof value)+", "+(isNaN(value)?'NaN':''));
                    }
                }
                if(options.type == String)
                {
                    if(typeof value != "string")
                    {
                        throw new Error(options.name+" must be "+options.type.name+", given "+(typeof value));
                    }
                }
            }
            params[options.name] = value;
            parameters.replace(options.name, value);
            return next();
        }, target);
        return descriptor;
    }
}

  