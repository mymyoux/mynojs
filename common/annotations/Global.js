import { root } from "../env/Root";


export function Global(clsOrName)
{
    return function(target, key, descriptor)
    {
        root[typeof clsOrName == "string"?clsOrName:clsOrName.name] = target?target:clsOrName;
        return descriptor;
    }
}