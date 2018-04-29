import { Strings } from "../../../../common/utils/Strings";
import { Promise } from "bluebird";

export class Validator
{
    static _validators = {}
    static register(name, cls)
    {
        if(typeof name != "string")
        {
            cls = name;
            name = cls.prototype.name();
        }
        Validator._validators[name] = cls;
    }
    static get(name)
    {
        return Validator._validators[name];
    }
    static parse(str)
    {
       let i = 0;
       let len = str.length;
       let name = "";
       let level = 0;
       let chr;
       let names = [];
       while(i<len)
       {
           chr = str[i++];
           if(chr == ",")
           {
                if(level == 0)
                {
                    name.push(name);
                    name = "";
                    continue;
                }
           }
           if(chr == "(")
           {
               level++;
           }
           if(chr == ")")
           {
               level--;
           }
           name+=chr;
       }
       if(name)
       {
           names.push(name);
       }
       names = names.map((item)=>Strings.trim(item).replace(/'/g,'"'));
        return names.map((item)=>Validator.parseOne(item));
    }
    static parseOne(name)
    {
        let index = name.indexOf('(');
        if(!~index)
        {
            let cls = Validator.get(name);
            if(!cls)
            {
                throw new Error('validator ['+name+'] is not found');
            }
            return new cls();
        }
        let value = name.substring(index+1);
        name = name.substring(0, index)
        let cls = Validator.get(name);
        if(!cls)
        {
            throw new Error('validator ['+name+'] is not found');
        }

        index = value.lastIndexOf(')');
        if(!~index)
        {
            throw new Error('validator ['+name+'('+value+'] is mal formed');
        }
        value = value.substring(0, index);
        try
        {
            value = JSON.parse('['+value+']');
        }catch(error)
        {
            throw new Error('validator ['+name+'('+value+'] is mal formed');
        }
        let instance = new cls(...value)
        return instance;
    }
    name()
    {
        return this.constructor.name;
    }   
    handle(data)
    {
        return "error!!";
        return new Promise((resolve)=>
        {
            setTimeout(()=>
        {
            debugger;
            resolve();
        }, 2000);
        });
    }
}