import { Objects } from "../../common/utils/Objects";
import { api } from "../io/API";
import {
    bus
} from "myno/common/events/Bus";;

export class Preferences
{
    data = {};
    boot()
    {
        return api("preferences").path('preferences/get').then((data)=>
        {
            this.data = data;
        });
    }
    has(key) {
        if(!key)
        {
            return false;
        }
        let  keys = key.split('.');
        //not last
        key = keys.pop();
        let current = this.data;
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
    get(key, defaultValue = null) {
        if(!key)
        {
            return Objects.clone(this.data);
        }
        let  keys = key.split('.');
        //not last
        key = keys.pop();
        let current = this.data;
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
    set(key, value) {
        let keys = key.split('.');
        //not last 
        key = keys.pop();
        let current = this.data;
        for(var k of keys)
        {
            if(current[k] == null)
            {
                current[k] = {};
            } 
            if(typeof current[k] != "object")
            {
                console.warn("Preferences nested key not object", current, keys, k);
                current[k] = {}; 
            }
            current = current[k];
        }
        if(current[key] === value)
        {
            return;
        }
        current[key] = value;
        bus.trigger('preference:change')
    }
    remove(key)
    {
        let keys = key.split('.');
        //not last 
        key = keys.pop();
        let current = this.data;
        for(var k of keys)
        {
            if(current[k] == null)
            {
                current[k] = {};
            } 
            if(typeof current[k] != "object")
            {
                console.warn("Preferences nested key not object", current, keys, k);
                current[k] = {}; 
            }
            current = current[k];
        }
        delete current[key];
    }
    save()
    {
        return api('preferences').path('preferences/update').param('preferences', this.data).then(()=>
        {
            return this.data;
        });
    }
    writeExternal()
    {
        return Objects.clone(this.data);
    }
    readExternal(data)
    {
        this.data = data;
    }
}

export const preferences = new Preferences();