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
            event.preventDefault();
            this.trigger("refresh", event);
        })
        mousetrap.bind(['command+a','ctrl+a'], ()=>
        {
            let target = KeyboardShortcutHelper.getTarget();
            if(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
            {
            }else
            {
                event.preventDefault();
            }
            
            this.trigger("selectall", event);
        })
        mousetrap.bind(['up','shift+up'], ()=>
        {
                this.trigger("up", event);
        })
        mousetrap.bind(['down','shift+down'], ()=>
        {
                this.trigger("down", event);
        })
        mousetrap.bind(['enter'], ()=>
        {
                this.trigger("enter", event);
        })
        mousetrap.bind(['escape'], ()=>
        {
            console.log('LAST ',KeyboardShortcutHelper._last.target);
            this.trigger("escape", event);
        })
        document.addEventListener("mousedown", this.onClick.bind(this));
        document.addEventListener("keyup", this.onKeyDown.bind(this));
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
    static getTarget()
    {
        let current = this._last?this._last.target:null;
        let item = null;
        while(current)
        {
            current._parent = current.parentNode;
            current = current.parentNode;
            //style parent
            if(current === document)
            {
                item = this._last.target;
                break;
            }
        }
        if(!item)
        {
            item = event.target;
        }
        return item;
    }
    static onClick(event)
    {
        if(!event.target)
        {
            debugger;
        }
        this._last = event;
        console.log('SET LAST click', this._last.target);
    }  
    static onKeyDown(event)
    {
        if(!event.target)
        {
            debugger;
        }
        if(event.metaKey || event.shiftKey || event.ctrlKey || event.key == "Shift" || event.key == "Meta" || event.key == "Ctrl" || event.key == "Escape")
        {
            return;
        }
        if(event.keyCode == 27)
        {
            debugger;
        }
        this._last = event;
        console.log('SET LAST key'+event.keyCode, this._last.target);
    }
  
}