import { root } from "../env/Root";


export function Global(cls)
{
    return function(target, key, descriptor)
    {
        root[cls.name] = cls;
        return descriptor;
    }
}