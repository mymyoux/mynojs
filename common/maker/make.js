



let factory = {};

export function make(name)
{
    return factory[name];
}
export function register(name, cls)
{
    factory[name] = cls;
}