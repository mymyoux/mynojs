import { CoreObject } from "../core/CoreObject";
import { Maths } from "../../common/utils/Maths";

export class EventDispatcher extends CoreObject {
  
    /**
     * Constructor
     */
    constructor() {
        super();
        /**
         * Mute the dispatcher
         */
        this._muted = false;
        this._listeners = [];
    }
    /**
     * Mutes the event dispatcher
     */
    mute() {
        this._muted = true;
    }
    /**
     * Unmutes the event dispatcher
     */
    unmute() {
        this._muted = false;
    }
    /**
     * Tests if the event dispatcher is muted
     */
    isMuted() {
        return this._muted;
    }
    trigger(name, ...data) {
        if (!this._listeners) {
            //disposed
            return;
        }
        if (this._muted) {
            return;
        }
        if (!name) {
            debugger;
            throw (new Error("event's name can't be null"));
        }
        var key1;
        var key2;
        if (name.indexOf(":") != -1) {
            var parts = name.split(":");
            key1 = parts[0];
            key2 = parts.slice(1).join(":");
            if (key1 == "" || !key1) {
                key1 = EventDispatcher.EVENTS.ALL;
            }
            if (key2 == "" || !key2) {
                key2 = null;
            }
        }
        else {
            key1 = name;
            key2 = null; //EventDispatcher.EVENTS.ALL;
        }
        //var len: number = this._listeners.length;
        var i = 0;
        var listener;
        var listeners = this._listeners.slice();
        //copy array & remove once after ?
        var len = listeners.length;
        while (i < len) {
            listener = listeners[i];
            if (listener.disposed !== true && (listener.key1 == key1 || listener.key1 == EventDispatcher.EVENTS.ALL || key1 == EventDispatcher.EVENTS.ALL) && (listener.key2 == EventDispatcher.EVENTS.ALL || listener.key2 == key2 || key2 == EventDispatcher.EVENTS.ALL)) {
                if (listener.key1 == EventDispatcher.EVENTS.ALL) {
                    listener.execute(data, [key1]);
                }
                else {
                    listener.execute(data);
                }
                //test if the current dispatcher has been disposed();
                if (listener.once) {
                    listener.dispose();
                    //this._listeners.splice(i, 1);
                    //len--;
                    //  continue;
                }
            }
            i++;
        }
        //disposed between
        if (!this._listeners) {
            return;
        }
        i = 0;
        len = this._listeners.length;
        while (i < len) {
            if (this._listeners[i].disposed === true) {
                listener = this._listeners[i];
                this._listeners.splice(i, 1);
                this.removed(listener);
                len--;
                continue;
            }
            i++;
        }
        //for dispose maybe set a variable to running & only dispose listeners after the running
        //for off ?
    }
    on(name, callback, scope, ...parameters) {
        return this.__on(false, name, callback, scope, parameters);
    }
    __on(once, name, callback, scope, parameters) {
        if (!this._listeners) {
            //disposed
            return;
        }
        if (!name) {
            throw (new Error("event's name can't be null"));
        }
        if (!callback) {
            throw (new Error("callback is required"));
        }
        if (name.indexOf(" ") > -1) {
            var names = name.split(" ");
            for (var p in names) {
                if (names[p].length > 0) {
                    // this.once.apply(this, [names[p],callback, scope].concat(parameters));
                    this.__on(once, names[p], callback, scope, parameters);
                }
            }
            return;
        }
        var key1;
        var key2;
        if (name.indexOf(":") != -1) {
            var parts = name.split(":");
            key1 = parts[0];
            key2 = parts.slice(1).join(":");
            if (key1 == "" || !key1) {
                key1 = EventDispatcher.EVENTS.ALL;
            }
            if (key2 == "" || !key2) {
                key2 = EventDispatcher.EVENTS.ALL;
            }
        }
        else {
            key1 = name;
            key2 = EventDispatcher.EVENTS.ALL;
        }
        ///  if(key1 == "page_changed")
        //console.log("TT___on["+once+"]=>"+name +"      |    "+key1+":"+key2);
        var listener = new Listener(key1, key2, once, callback, scope, parameters);
        this._listeners.push(listener);
        this.added(listener);
    }
    added(listener)
    {
    }
    removed(listener)
    {
        
    }
    once(name, callback, scope, ...parameters) {
        return this.__on(true, name, callback, scope, parameters);
    }
    off(name, callback, scope) {
        if (!this._listeners) {
            //disposed
            return;
        }
        //debugger;
        var key1, key2;
        var listener;
        //TODO:off with new system
        if (name) {
            if (name.indexOf(" ") > -1) {
                var names = name.split(" ");
                for (var p in names) {
                    if (names[p].length > 0) {
                        this.off(names[p], callback, scope);
                    }
                }
                return;
            }
            var index;
            if ((index = name.indexOf(":")) != -1) {
                key1 = name.substring(0, index);
                key2 = name.substring(index + 1);
            }
            else {
                key1 = name;
            }
        }
        if (!key1 || key1 == "") {
            key1 = EventDispatcher.EVENTS.ALL;
        }
        if (!key2 || key2 == "") {
            key2 = EventDispatcher.EVENTS.ALL;
        }
        if (!name) {
            while (this._listeners.length) {
                this.removed(this._listeners.shift()); //.dispose();
            }
            return;
        }
        var len = this._listeners.length;
        var i = 0;
        var listener;
        while (i < len) {
            listener = this._listeners[i];
            if ((!callback || callback === listener.callback) && (!scope || scope === listener.scope) && (listener.key1 == key1 || key1 == EventDispatcher.EVENTS.ALL) && (listener.key2 == key2 || key2 == EventDispatcher.EVENTS.ALL)) {
                this._listeners.splice(i, 1);
                this.removed(listener);
                //listener.dispose();
                len--;
                continue;
            }
            i++;
        }
    }
    proxy(callback, scope) {
        scope = scope || this;
        return function () {
            return callback.apply(scope, Array.prototype.splice.apply(arguments));
        };
    }
    dispose() {
        if (super.dispose) {
            super.dispose();
        }
        this.destroy();
    }
    destroy() {
        if(!this._listeners)
            return;
        while(this._listeners.length)
        {
            this.removed(this._listeners.shift());
        }
        this._listeners = null;
    }
}

export class Listener {
    constructor(key1, key2, once, callback, scope, parameters) {
        this.key1 = key1;
        this.key2 = key2;
        this.once = once;
        this.callback = callback;
        this.scope = scope;
        this.parameters = parameters;
        this.instance = Maths.getUniqueID();
        if (!callback) {
            debugger;
        }
    }
    isScope(scope) {
        return scope === this.scope;
    }
    isCallback(callback) {
        return callback === this.callback;
    }
    execute(parameters, prefixParams) {
        var params = parameters.length ? parameters.concat(this.parameters) : this.parameters;
        if (prefixParams) {
            params = prefixParams.concat(params);
        }
        this.callback.apply(this.scope, params /*parameters.concat(params)*/);
    }
    dispose() {
        this.callback = null;
        this.scope = null;
        this.parameters = null;
        this.once = false;
        this.disposed = true;
    }
}

EventDispatcher.EVENTS = {
    ALL: "all"
}