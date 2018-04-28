import { root } from "../env/Root";
import { Classes } from "../utils/Classes";
import { bus } from "../events/Bus";
import { Strings } from "../utils/Strings";


let authorized;
export function Global(name, onInstance)
{
    let alias;
    let instance;
    let object;
    Array.from(arguments).forEach((item)=>
    {
        if(typeof item == "string")
        {
            alias = item;
        }else
        if(typeof item == "boolean")
        {
            instance = item;
        }else
        {
            object = item;
        }
    });
    return function(target, key, descriptor)
    {
        if(!object && target)
        {
            object = target;
        }
        if(!alias)
        {
            alias = object.name;
        }
        alias = Strings.uncamel(alias);
        if(instance)
        {
            if(object.is__vuecomponent)
            {
                if(!authorized)
                {
                    authorized = [];
                    bus.on('component:mounted', (item)=>
                    {
                        if(!~authorized.indexOf(item.constructor.name))
                        {
                            return;
                        }
                        if(root[alias])
                        {
                            if(!Array.isArray(root[alias]))
                            {
                                root[alias] = [root[alias]];
                            }
                            root[alias].push(item);
                        }else
                        {
                            root[alias] = item;
                        }
                    });
                    bus.on('component:destroyed', (item)=>
                    {
                        if(!~authorized.indexOf(item.constructor.name))
                        {
                            return;
                        }
                        if(root[alias])
                        {
                            
                            if(root[alias] === item)
                            {
                                delete root[alias];
                            }else
                            {
                                let index = root[alias].indexOf(item);
                                if(~index)
                                {
                                    root[alias].splice(index, 1);
                                }
                            }
                        }
                    });
                }
                authorized.push(object.name);
                return;
            }
            let old = object.prototype;
            let Model = function(...args)
            {
                console.log('Log '+alias);
                if(root[alias])
                {
                    if(!Array.isArray(root[alias]))
                    {
                        root[alias] = [root[alias]];
                    }
                    root[alias].push(this);
                }else
                {
                    root[alias] = this;
                }
                return new old.constructor(...args);
            }
            return Model;
        }else
        {
            root[alias] = object;
        }
        // if(instance)
        // {
        //     // let c = class extends object
        //     // {
        //     //     pak()
        //     //     {
        //     //         console.log('park')
        //     //     }
        //     // }
        //     return (...args) => {
        //         debugger;
        //         //console.log(`Arguments for ${name}: args`);
        //         return new object(...args);
        //       };
        //     //return new c(...Array.from(arguments))
        // }
        return descriptor;
    }
}

  