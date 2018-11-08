import { Configuration } from "../env/Configuration";
import { CoreObject } from "../core/CoreObject";
import { Arrays } from "../utils/Arrays";
import { Strings } from "../utils/Strings";
import { Classes } from "../utils/Classes";
export class Model extends CoreObject {
    id_name = 'id';
    constructor() {
        super();
        Object.defineProperty(this, "id_name", {
            enumerable: false,
            writable:true
        });
        Object.defineProperty(this, "_modelName", {
            enumerable: false,
            writable:true
        });
    }
    getClassName()
    {
        return Classes.getName(this);
    }
   
    getID()
    {
        return this[this.getIDName()];
    }
    getIDName()
    {
        return this.id_name;
    }
    hasID()
    {
        return this.getID() !== undefined;
    }
    getModelName() {
        if (!this._modelName) {
            var name = this.getClassName();
            name = name.replace('Model', '').toLowerCase();
            if (typeof this == "function")
                return name;
            this._modelName = name;
        }
        return this._modelName;
    }
    readExternal(input, path = null) {
        for (var p in input) {
            if (typeof this[p] == "function") {
                 console.warn("you overwrite function: "+p);
            }
            this[p] = input[p];
        }
    }
    /**
    * Returns model's data
    * @returns {any}
    */
    writeExternal() {

        return Object.keys(this)
        .filter((key)=>
        {
            //exception for _id
            return key == this.getIDName() || this[key] !== null && key.substring(0, 1)!='_';
        })
        .filter((key)=>
        {
            return !~this.forbidden.indexOf(key);  
        })
        .filter((key)=>
        {
            return !~this.hidden.indexOf(key);  
        }).reduce((previous, key)=>
        {
            if(key == this.getIDName())
            {
                //id => model_id 
                previous[this.getModelName()+'_id'] = typeof this[key] == 'object' && typeof  this[key].writeExternal == 'function'?this[key].writeExternal():this[key];
            }else
            {
                previous[key] = typeof this[key] == 'object' && typeof  this[key].writeExternal == 'function'?this[key].writeExternal():this[key];
            }
            return previous;
        }, {});
    }
    [Symbol.toPrimitive](type)
    {
        if(type == "string")
            return JSON.stringify(this, null, 2);
        else 
        {
            if(type == "default")
            {
                return JSON.stringify(this, null, 2);
            } 
        }
        return JSON.stringify(this, null, 2);
    }
    toJSON()
    {
        return this.writeExternal();
    }
    clone()
    {
        let cls = this.constructor;
        let instance = new cls();
        instance.readExternal(this.writeExternal());
        return instance;
    }
}