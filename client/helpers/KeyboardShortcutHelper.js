import { BusMiddleware, bus } from "../../common/events/Bus";
import mousetrap from 'mousetrap';

export class KeyboardShortcutHelper
{
    static _last;
    static _lastEvent;
    static _lasts = [];
    static register()
    {
        mousetrap.bind(['command+r','ctrl+r','f5'], ()=>
        {
                this.trigger("refresh", event);
        })
        mousetrap.bind(['command+a','ctrl+a'], ()=>
        {
                this.trigger("selectall", event);
        })
        mousetrap.bind(['up'], ()=>
        {
                this.trigger("up", event);
        })
        mousetrap.bind(['down'], ()=>
        {
                this.trigger("down", event);
        })
        document.addEventListener("mousedown", this.onClick.bind(this));
    }
    static trigger(name, event, handler)
    {
        if(!this._last)
        {
            return;
        }
        var custom = new CustomEvent(name, {  bubbles: true,detail: event });
        let stop = custom.stopPropagation;
        custom.stopPropagation = function()
        {
            stop.apply(custom, ...arguments);
            event.stopPropagation();
        };
        let prevent = custom.preventDefault;
        custom.preventDefault = function()
        {
            prevent.apply(custom, ...arguments);
            event.preventDefault();
        };
        custom.original = event;
        let triggerable  = this.getTriggerable(this._last.target);
        if(triggerable)
        {
            triggerable.dispatchEvent(custom);
        }
        if(!triggerable)
        {
            debugger;
        }
    }
    static getTriggerable(item)
    {
        if(!item)
            return item;

        let current = item;
        while(current)
        {
            current._parent = current.parentNode;
            current = current.parentNode;
            if(current === document)
            {
                return item;
            }
        }
        return document.elementFromPoint(this._last.pageX, this._last.pageY);
    }
    static onClick(event)
    {
        if(!event.target)
        {
            debugger;
        }
        //TODO:try to listen for dom removed 
        this._last = event;
    }
}