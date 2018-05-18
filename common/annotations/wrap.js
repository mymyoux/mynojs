import { Functions } from "../utils/Functions";

  
export function wrap(descriptor, method, scope)
{

    if(!descriptor.value.overrided)
    {
        let original = descriptor.value;
        let wrapped = function()
        {
            let index = 0;
            let current = wrapped.methods[index];
            let parameters = Array.from(arguments);
            parameters.replace = function(name, value)
            {
                let index = wrapped.parameters.indexOf(name);
                if(~index)
                {
                    while(parameters.length<=index)
                    {
                        parameters.push(undefined);
                    }
                    parameters[index] = value;
                }
            }
            
            parameters.get = function(name)
            {
                let index = wrapped.parameters.indexOf(name);
                if(~index)
                {
                    return parameters[index];
                }
                return null;
            }

            let next = function()
            {
                index++;
                if(wrapped.methods.length <= index)
                {
                    if(wrapped.scope)
                    {
                        return original.apply(wrapped.scope, parameters);
                    }
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
    if(!descriptor.value.scope && scope)
    {
        descriptor.value.scope = scope;
    }
    descriptor.value.methods.push(method);
    return descriptor.value;
}