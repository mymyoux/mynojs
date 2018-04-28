//import Vue from "vue";
import { Component, Emit, Inject, Model, Prop, Provide, Watch,Vue } from 'vue-property-decorator'
import { bus } from "../../common/events/Bus";
import { Strings } from '../../common/utils/Strings';
import { Global } from '../../common/annotations/Global';
import { log } from '../../common/annotations/Global';


//@Global(true)
//@Global('test', true)
//de@Global("test",true)

@Component
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
    beforeMount()
    {
        VueComponent.onBeforeMounted(this);
        console.log('beforeMount');
    }
    mounted()
    {
        console.log('mounted');
    }
    destroyed()
    {
        VueComponent.onDestroyed(this);
        console.log('destroyed');
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
}
/**
 * Link a method to an event from bus
 * @param event {string} event name
 */
export function Event(event)
{
    return function(target, key, descriptor)
    {
        if(!event)
        { 
            event = Strings.uncamel(key);
        }
        if(target instanceof VueComponent)
        {
            if(target.destroyed)
            {
                target.____destroyed = target.destroyed
            }
            if(target.beforeMount)
            {
                target.____beforeMount = target.beforeMount
            }
            target.beforeMount = function()
            { 
                bus.on(event, descriptor.value, target);
                if( target.____beforeMount)
                {
                    target.____beforeMount();
                }
            }
            target.destroyed = function()
            {
                bus.off(event, descriptor.value, target);
                if( target.____destroyed)
                {
                    target.____destroyed();
                }
            }
        }else{
            bus.on(event, descriptor.value, target);
        }
        return descriptor;
    }
} 

export {Component, Emit, Inject, Model, Prop, Provide, Watch}