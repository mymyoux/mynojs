
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
        if(this.$children)
        {
            let components; 
            if(this.$parent)
            {
                components = this.$parent.$children;
                let index = components.indexOf(this);
                if(!~index)
                {
                    debugger;
                }
                components = components.slice(index+1);
                debugger;
            }else
            {
                components = [];
            }

            components = this.$children.concat(components);
            let errorFields = components.filter((item)=>
            {
                return item.$options.name == "FError";
            })
            if(errorFields.length)
            {
                let errorField = errorFields[0];
                errorField.error = error;
                return;
            }
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
    
            siblings = siblings.filter((item)=>
            {
                if(item.__vue__)
                {
                    if(item.__vue__.$options.name == "FError")
                    {
                        return true;
                    }
                }
                return item.hasAttribute('error')
            });
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
        if(errorField.__vue__ && errorField.__vue__.$options.name == "FError")
        {
            errorField.__vue__.error = error;
        }else
        {
            errorField.textContent = error;
        }
    }
}
