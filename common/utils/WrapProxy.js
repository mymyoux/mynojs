export var WrapProxy = function(keys)
{
    if(!keys)
    {
        keys = ["_wrap"];
    }
    if(!Array.isArray(keys))
    {
        keys = [keys];
    }
    return {
        get: function(target, prop, receiver)
        {
            if(target[prop] !== undefined)
            {
                return target[prop];
            }
            //console.log('GET:', prop);
            for(var k of keys)
            {
                if(target[k])
                {
                    if(target[k][prop] !== undefined)
                    {
                        return target[k][prop];
                    }
                }
            }
            return target[k][prop];
        },
        set(target, prop, value) {
            if(target[prop] !== undefined)
            {
                return target[prop] = value;
            }
            //console.log('GET:', prop);
            for(var k of keys)
            {
                if(target[k])
                {
                    if(target[k][prop] !== undefined)
                    {
                        return target[k][prop] = value;
                    }
                }
            }
            return target[k][prop] = value;
          }
    };
} 