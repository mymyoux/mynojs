import { Functions } from "../../common/utils/Functions";

export function Param(name, options)
{
    if(typeof name == "string")
    {
        options = Object.assign({name:name}, options);
    }else{
        options = name;
        if(!name)
        {
            throw new Error('param must have a name');
        }
    }

    options = Object.assign({required:false}, options);

    return function(target, key, descriptor)
    {
        let paramList;
        let index;
        let indexParams;

        wrap(descriptor, function(parameters, next)
        {
            let value = parameters[indexParams][options.name];
            
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
            if(~index)
            {
                while(parameters.length<=index)
                {
                    parameters.push(undefined);
                }
                parameters.splice(index, 1, value);
            }
            return next();
        });
        paramList  = descriptor.value.parameters;
        index = paramList.indexOf(options.name);
        indexParams = paramList.indexOf("params");
        if(!~indexParams)
        {
            throw new Error('params must be in method parameters');
        }
        return descriptor;
    }
}

  
function wrap(descriptor, method)
{

    if(!descriptor.value.overrided)
    {
        let original = descriptor.value;
        let wrapped = function()
        {
            let index = 0;
            let current = wrapped.methods[index];
            let parameters = Array.from(arguments);
            let next = function()
            {
                index++;
                if(wrapped.methods.length <= index)
                {
                    return original(...parameters);
                }else
                {
                    return wrapped.methods[index](parameters, next);
                }
            }
            return current(parameters, next);
        };
        wrapped.overrided = true;
        wrapped.methods = [];
        wrapped.original = original;
        wrapped.parameters = Functions.getParameters(original);
        descriptor.value = wrapped;
    }
    descriptor.value.methods.push(method);
}