//import Vue from "vue";
import { Component, Emit, Inject, Model, Prop, Provide, Watch,Vue } from 'vue-property-decorator'
import { bus } from "../../common/events/Bus";
import { Strings } from '../../common/utils/Strings';
export class VueComponent extends Vue
{
    
    beforeMount()
    {
        console.log('beforeMount');
    }
    mounted()
    {
        console.log('mounted');
    }
    destroyed()
    {
        console.log('destroyed');
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