//import Vue from "vue";
import { Component, Emit, Inject, Model, Prop, Provide, Watch,Vue } from 'vue-property-decorator'
import { bus } from "../../common/events/Bus";
import { Strings } from '../../common/utils/Strings';
import { Global } from '../../common/annotations/Global';
import { log } from '../../common/annotations/Global';
import { root } from '../../common/env/Root';
import { Buffer } from '../../common/buffer/Buffer';




//@Global(true)
//@Global('test', true)
//de@Global("test",true)
export class VueComponent extends Vue
{
    /**
     * @private required for Global
     */
    static is__vuecomponent = true;
    static onBeforeMounted(instance)
    {
        bus.trigger('component:mounted', instance);
    }
    static onDestroyed(instance)
    {
        bus.trigger('component:destroyed', instance);
    }
    static getComponent(element)
    {
        if(!element)
        {
            return null;
        }
        if(element instanceof Vue)
        {
            return element;
        }
        if(element.__vue__)
        {
            return element.__vue__;
        }
        return this.getComponent(element.parentNode);
    }
    data()
    {
        return {};
    }
    beforeMount()
    {
        VueComponent.onBeforeMounted(this);
        
        // console.log('beforeMount');
    }
    emit(name, ...data)
    {
        let current = this;
        do
        {
            if(current._events[name])
            {
                return current.$emit(name, ...data);
            }else
            {
                current = current.$parent;
            }
        }while(current);
        var event = new CustomEvent(name, {bubbles:true,detail:data})
        this.$el.dispatchEvent(event);
    }
    mounted()
    {
        // console.log('mounted');
    }
    destroyed()
    {
        VueComponent.onDestroyed(this);
        // console.log('destroyed');
    }
    contains(element, recursive = true)
    {
        if(!element)
        {
            return false;
        }
        if(element instanceof Vue)
        {
            element = element.$el;
        }
        if(element.__vue__)
        {
            if(element.__vue__ === this)
            {
                return true;
            }else
            if(!recursive)
            {
                return false;
            }
        }
        return this.contains(element.parentNode);
    }
    getAllChildren()
    {
        let components = this.$children.slice();
        for(let component of this.$children)
        {
            if(component.getAllChildren)
                components = components.concat(component.getAllChildren());
            else
                components = components.concat(VueComponent.prototype.getAllChildren.call(component));
        }
        return components;
    }
}
/**
 * Link a method to an event from bus
 * @param event {string} event name
 */
export function Event(event, options)
{
    options = Object.assign({debounce:false, throttle:false}, options);
    return function(target, key, descriptor)
    {
        if(!event)
        { 
            event = Strings.uncamel(key);
        }
       
        if(target instanceof VueComponent)
        {
            if(!target.__listeners)
            {
                target.__listeners = [];
            }
            target.__listeners.push({options:options, descriptor:descriptor, event:event})
            if(target.destroyed && !target.____destroyed)
            {
                target.____destroyed = target.destroyed
            }
            if(target.beforeMount && !target.____beforeMount)
            {
                target.____beforeMount = target.beforeMount
            }
            target.beforeMount = function()
            { 
                target.__listeners.forEach((config)=>
                {
                    let listener ;
                    if(config.options.debounce)
                    {
                        listener = Buffer.debounce(config.descriptor.value, config.options.debounce === true?100:config.options.debounce);
                    }else
                    if(options.throttle)
                    {
                        listener = Buffer.throttle(config.descriptor.value, config.options.throttle === true?100:config.options.throttle);
                    }else
                    {
                        listener = config.descriptor.value;
                    }
                    config.listener = listener;
                    bus.on(config.event, listener, this);
                });
                if( target.____beforeMount)
                {
                    target.____beforeMount();
                }
            }
            target.destroyed = function()
            {
                target.__listeners.forEach((config)=>
                {
                    bus.off(config.event, config.listener, this);
                });
                if( target.____destroyed)
                {
                    target.____destroyed();
                }
            }
        }else{
            let listener;
            if(options.debounce)
            {
                listener = Buffer.debounce(descriptor.value, options.debounce === true?100:options.debounce);
            }else
            if(options.throttle)
            {
                listener = Buffer.throttle(descriptor.value, options.throttle === true?100:options.throttle);
            }else
            {
                listener = descriptor.value;
            }
            //TODO:override metthod  to get this with wrap
            debugger;
            //TODO:maybe this instead of target
            bus.on(event, listener, target);
        }
        return descriptor;
    }
} 

export {Component, Emit, Inject, Model, Prop, Provide, Watch}