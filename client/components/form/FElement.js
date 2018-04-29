
import {VueComponent, Component, Prop, Watch, Emit} from "../../mvc/VueComponent";
import Vue from 'vue';
import {Hardware} from "../../../common/env/Hardware";
import electron from "../../../common/electron/Electron";
import {Global} from "../../../common/annotations/Global";
import { Strings } from "../../../common/utils/Strings";


export default class FElement extends VueComponent
{
    getName()
    {
        return this.$el.getAttribute('name') || this.$el.id;
    }
    getCleanedName()
    {
        let name = this.getName();
        if(Strings.endsWith(name, '[]'))
        {
            name = name.substring(0, name.length-2);
           return name;
        }
        return name;
    }
    isArray()
    {
        let name = this.getName();
        return Strings.endsWith(name, '[]');
    }
    addError(error)
    {
        if(this.$el.$children)
        {
            this.$el.$children
        }



        let errorField = this.$el.querySelector('[error]');

        if(!errorField)
        {
            let found = false;
            let siblings = Array.from(this.$el.parentNode.childNodes).filter((item)=>
            {
                if(item === this.$el)
                {
                    found = true;
                }
                return found && item!==this.$el
            });
    
            siblings = siblings.filter((item)=>item.hasAttribute('error'));
            if(!siblings.length)
            {
                console.warn('No Error element to display this error', this);
                debugger;
                return;
            }
            errorField = siblings[0];
        }
        if(!errorField)
        {
            return;
        }
        errorField.textContent = error;
    }
}
