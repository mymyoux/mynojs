import  { Objects }  from  "../utils/Objects";
import  { Hardware }  from "./Hardware";
import  { root } from  "./Root";
// const {Objects} = require("../utils/Objects");
// const {Hardware} = require("./Hardware");
// const {root} = require("./Root");
 export class Configuration {
    static env()
    {
        if(!Configuration.has('app.env'))
        {
            let env = "production";
            if(Hardware.isNode())
            {
                if(!process.env.NODE_ENV && !process.env.BABEL_ENV)
                {
                    if(Hardware.isElectron())
                    {
                        if(process.defaultApp)
                        {
                            env = "local";
                        }
                    }
                }else
                {
                    env = process.env.NODE_ENV || process.env.BABEL_ENV;
                    if(env == "node")
                    {
                        //exception
                        env = "local";
                    }
                }
            }
            Configuration.set('app.env', env); 
        }
        return Configuration.get('app.env');
    }
    static getAllKeys()
    {
       return this.buildKeys(this.data);
    }
    static buildKeys(data, prefix = '')
    {
        let keys = Object.keys(data);
        keys = keys.reduce((previous, key)=>
        {
            let item = data[key];
            if(item && typeof item == 'object')
            {
                previous = previous.concat(this.buildKeys(item, prefix+key+'.'))
            }
            return previous;
        }, keys);
        return keys.map((item)=>prefix+item);
    }
    static isDebug()
    { 
        return Configuration.env() == "DEBUG" || Configuration.isLocal() || this.get('app.debug');
    }
    static isLocal()
    {
        return !!~this.env().indexOf('local');
    }
    static isProduction()
    {
        return !!~this.env().indexOf('production');
    }
    static merge(key, data) {
        if (typeof key == "string") {
            if (Configuration.data[key]) {
                Configuration.data[key] = Objects.merge(Configuration.data[key], data);
            }
            else {
                Configuration.data[key] = data;
            }
        }
        else {
            data = key;
            Configuration.data = Objects.merge(Configuration.data, data);
        }
    }
    static has(key) {
        if(!key)
        {
            return false;
        }
        let  keys = key.split('.');
        //not last
        key = keys.pop();
        let current = Configuration.data;
        for(var k of keys)
        {
            if(current[k] == null)
            {
                current[k] = {};
            } 
            if(typeof current[k] != "object")
            {
                current[k] = {}; 
            }
            current = current[k];
        }
        return current[key] != undefined;
    }
    static get(key, defaultValue = null) {
        if(!key)
        {
            return Objects.clone(Configuration.data);
        }
        let  keys = key.split('.');
        //not last
        key = keys.pop();
        let current = Configuration.data;
        for(var k of keys)
        {
            if(current[k] == null)
            {
                current[k] = {};
            } 
            if(typeof current[k] != "object")
            {
                current[k] = {}; 
            }
            current = current[k];
        }
        return current[key] != undefined ? current[key] : defaultValue;
    }
    static set(key, value) {
        let keys = key.split('.');
        //not last 
        key = keys.pop();
        let current = Configuration.data;
        for(var k of keys)
        {
            if(current[k] == null)
            {
                current[k] = {};
            } 
            if(typeof current[k] != "object")
            {
                console.warn("Configuration nested key not object", current, keys, k);
                current[k] = {}; 
            }
            current = current[k];
        }
        if(current[key] === value)
        {
            return;
        }
        current[key] = value;
    }
    static remove(key)
    {
        let keys = key.split('.');
        //not last 
        key = keys.pop();
        let current = Configuration.data;
        for(var k of keys)
        {
            if(current[k] == null)
            {
                current[k] = {};
            } 
            if(typeof current[k] != "object")
            {
                console.warn("Configuration nested key not object", current, keys, k);
                current[k] = {}; 
            }
            current = current[k];
        }
        delete current[key];
    }
    static writeExternal() {
        return Objects.clone(Configuration.data);
    }
    static readExternal(data) {
        Configuration.data = data;
    }
}
Configuration.data = {};

export const config = function(key, value)
{
    if(value != undefined)
    {
        return Configuration.set(key, value);
    }
    return Configuration.get(key);
}
//add Configuration methods to config
for(let key of Object.getOwnPropertyNames(Configuration))
{
    if(typeof Configuration[key] == "function")
    {
        config[key] = Configuration[key];
    }
}
root.config = config;