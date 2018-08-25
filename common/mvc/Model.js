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
        var external = {};
        for (var p in this) {
            //TODO:check this not sure if needed
            // if(!this.hasOwnProperty(p))
            //     continue;
            if (typeof this[p] == "function") {
                continue;
            }
            if (Strings.startsWith(p, "_")) {
                continue;
            }
            if (this[p] && typeof this[p] == "object" && typeof this[p]['writeExternal'] === 'function') {
                external[p] = this[p]['writeExternal']();
            }
            else {
                external[p] = this[p];
            }
        }
        external[this.getIDName()] = this.getID();
        return external;
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