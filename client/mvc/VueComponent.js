//import Vue from "vue";
import { Component, Emit, Inject, Model, Prop, Provide, Watch,Vue } from 'vue-property-decorator'
import { bus } from "../../common/events/Bus";
import { Strings } from '../../common/utils/Strings';
import { Buffer } from '../../common/buffer/Buffer';
import { Objects } from '../../common/utils/Objects';




//@Global(true)
//@Global('test', true)
//de@Global("test",true)
function mixinReduce(component)
{
    let mixins = component.mixins?component.mixins.slice():[]
    let result = mixins.slice()
    for(let p in mixins)
    {
        let mixin = mixins[p]
        result.splice(p, 0, ...mixinReduce(mixin))
    }
    return result
}

export const VueMixinSuper = {
    beforeCreate()
    {
    },
    methods: {
        $super(cls, method)
        {
            if(!this.allmixins)
            {
                let allmixins = mixinReduce(this.$options)
                this.allmixins = []
                for(let i=allmixins.length-1; i>= 0; i--)
                {
                    if(!~this.allmixins.indexOf(allmixins[i]))
                    {
                        this.allmixins.unshift(allmixins[i])
                    }
                }
            }
            if(!method && typeof cls == 'string')
            {
                method = cls;
                cls = null;
            }
            let mixins = this.allmixins
            let index = mixins.indexOf(cls)
            if(index == -1)
            {
                index = mixins.length
            }
            for (let i=index-1; i>=0; i--)
            {
                if(mixins[i][method])
                {
                    return mixins[i][method].bind(this)
                }
                if(mixins[i].methods[method])
                {
                    return mixins[i].methods[method].bind(this)
                }
            }
            return function(){
                throw new Error(`no $super.${method}()`)
            }
        }
    }
}

export const VueMixinAsync = {
    beforeCreate()
    {
    },
    created()
    {
        if(this.$options.createdAsync)
        {
            let promise
            if(!this.$options.async || !this.$options.async.created)
            {
                promise = Promise.resolve()
            }else{
                promise = Promise.all(this.$options.async.created)
            }
            promise.then(()=>
            {
                let result = this.$options.createdAsync.call(this)
                if(result && result.then)
                {
                    return result.then(()=>
                    {
    
                    })
                }
                return result
            })
        }
    }
}
export const VueMixinComponent = {
    mixins: [VueMixinSuper],
    beforeMount()
    {
        bus.trigger('component:mounted', this);
    },
    beforeDestroy()
    {
        bus.trigger('component:destroyed', this);
    },
    methods: {
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
        },
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
        },
        getAllChildren()
        {
            let components = this.$children.slice();
            for(let component of this.$children)
            {
                if(component.getAllChildren)
                    components = components.concat(component.getAllChildren());
                else
                    components = components.concat(this.getAllChildren.call(component));
            }
            return components;
        }
    }
}

var strategies = Vue.config.optionMergeStrategies
strategies.events = function(oldValue, newValue)
{
    if(!oldValue)
    {
        return newValue
    }
    if(!newValue)
    {
        return oldValue
    }
    return oldValue.concat(newValue)
}
export const VueMixinEvent = {
    optionMergeStrategies:
    {
        events: (oldval, newval) =>
        {
            debugger
        }
    },
    created()
    {
        if(!this.$options.events)
        {
            return
        }
        if(this.$options.events.initialized)
        {
            return
        }
        this.$options.events = this.$options.events.map((event)=>
        {
            if(!event.event)
            {
                throw new Error('event property is required')
            }
            if(!event.callback)
            {
                throw new Error('callback property is required')
            }
            if(!event.dispatcher)
            {
                event.dispatcher = bus
            }
            if(!Array.isArray(event.event))
            {
                event.event = event.event.split(' ')
            }
            // if(typeof event.callback == 'string')
            // {
            //     event.callback = this[event.callback]
            // }
            if(event.debounce)
            {
                if(event.debounce === true)
                {
                    event.debounce = 100
                }
            }
            if(event.throttle)
            {
                if(event.throttle === true)
                {
                    event.throttle = 100
                }
                if(event.debounce)
                {
                    throw new Error('you can\' use together debounce and throttle options')
                }
            }
            return event
        })
        this.$options.initialized = true
    },
    beforeMount()
    {
        if(!this.$options.events)
            return

        this.__events = this.$options.events.map((event)=>
        {
            event = Object.assign({}, event)
            let listener ;
            if(event.throttle || event.debounce)
            {
                let callLater = (...params) => {
                    if(this._isDestroyed)
                    {
                        console.log('ignoring late call for ', this)
                        return
                    }
                   let method = typeof event.callback == 'function'? event.callback:this[event.callback] 
                   method.apply(this, params)
                }
                if(event.debounce)
                {
                    listener = Buffer.debounce( callLater , event.debounce);
                }else
                {
                    listener = Buffer.throttle( callLater , event.throttle);
                }
            }
             else{
                listener = typeof event.callback == 'function'? event.callback:this[event.callback];
            }
            event.listener = listener.bind(this);
            event.event.forEach((name)=>
            {
                event.dispatcher.on(name,  event.listener);
            })
            return event
        });
    },
    beforeDestroy()
    {
        if(!this.__events)
            return
        this.__events.forEach((event)=>
        {
            event.event.forEach((name)=>
            {
                event.dispatcher.off(name, event.listener);
            })
        });
    },
    methods : {
        test()
        {
            console.log('test vue events')
            this.$super(VueEventMixin, 'test')()
        }
    }
}
  
/**
 * Link a method to an event from bus
 * @param event {string} event name
 */
export function Event2(event, options)
{
    options = Objects.assign({debounce:false, throttle:false, dispatcher:bus}, options);
    return function(target, key, descriptor)
    {

        if(!event)
        { 
            event = Strings.uncamel(key);
        }
        if(!target.events)
        {
            target.events = [];
        }
        if(!target.mixins)
        {
            target.mixins = []
        }
        if(!~target.mixins.indexOf(VueEventMixin))
        {
            target.mixins.push(VueEventMixin)
        }
        debugger
        target.events.push({...options, callback:descriptor.value, event:event, dispatcher:options.dispatcher})
        return descriptor
    }
}


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

export function Event(event, options)
{
    options = Objects.assign({debounce:false, throttle:false, dispatcher:bus}, options);
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
            target.__listeners.push({options:options, descriptor:descriptor, event:event, dispatcher:options.dispatcher})
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
                    config.dispatcher.on(config.event, listener, this);
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
                    config.dispatcher.off(config.event, config.listener, this);
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
            //TODO:maybe this instead of target
            options.dispatcher.on(event, listener, target);
        }
        return descriptor;
    }
} 

export {Component, Emit, Inject, Model, Prop, Provide, Watch}