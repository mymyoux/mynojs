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
        mousetrap.bind(['backspace','delete'], ()=>
        {
            let target = KeyboardShortcutHelper.getTarget();
            if(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
            {
            }else
            {
                event.preventDefault();
            }
            
            this.trigger("deletekey", event);
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
                if(item === document || item === document.body)
                {
                    console.log('sshorcut body')
                    break
                }
                return item;
            }
        }
        if(isNaN(this._last.clientX)) {
            debugger
        }
        return document.elementFromPoint(Math.floor(this._last.clientX), Math.floor(this._last.clientY));
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
        console.log()
        if(item === document || item === document.body) {
            if(this._last) {
                console.log('set new item from last')
                document.elementFromPoint( this._last.clientX,  this._last.clientY);
            }else {
                console.log('set new item from event')
                document.elementFromPoint( event.clientX,  event.clientY);
            }
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
        if(this._last) {
            if(!isNaN(this._last.pageX)) {
                event.pageX = this._last.pageX
            }
            if(!isNaN(this._last.pageY)) {
                event.pageY = this._last.pageY
            }
            if(!isNaN(this._last.clientX)) {
                event.clientX = this._last.clientX
            }
            if(!isNaN(this._last.clientY)) {
                event.clientY = this._last.clientY
            }
        }
        this._last = event;
        console.log('SET LAST key'+event.keyCode, this._last.target);
    }
  
}