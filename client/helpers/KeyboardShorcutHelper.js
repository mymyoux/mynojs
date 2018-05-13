import { BusMiddleware, bus } from "../../common/events/Bus";
import hotkeys from 'hotkeys-js';

export class KeyboardShorcutHelper
{
    static _last;
    static register()
    {

        hotkeys('f5,cmd+r,ctrl+r', (event, handler)=>{
            debugger;
            // event.preventDefault() 
            // event.stopPropagation();
            this.trigger("refresh", event, handler);
        });
        hotkeys('cmd+a', (event, handler)=>{
            //event.preventDefault() 
            //event.stopPropagation();
            this.trigger("selectall", event, handler);
        });




        document.addEventListener("mousedown", this.onClick.bind(this));
    }
    static trigger(name, event, handler)
    {
        if(!this._last)
        {
            return;
        }
        var custom = new CustomEvent(name, {  bubbles: true,detail: handler });
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
        this._last.dispatchEvent(custom);
    }
    static onClick(event)
    {
        console.log('click');
        if(!event.target)
        {
            debugger;
        }
        this._last = event.target;
    }
}