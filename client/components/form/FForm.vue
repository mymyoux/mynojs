<template>
    <form @submit.prevent="onSubmit" ref="form" :loading="loading">  
        <slot></slot>
    </form>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../../mvc/VueComponent";
import Vue from 'vue';

import {Global} from "../../../common/annotations/Global";
import {Strings} from "../../../common/utils/Strings";
import Validator from "./validators/all";
import FElement from "./FElement";
//@Global
@Component
export default class FForm extends VueComponent
{
    data()
    {
        return {loading:false};
    }
    test()
    {

    }
    beforeMount()
    {
        super.beforeMount();
    }
    getItems()
    {
         let fields = this.$el.querySelectorAll('input');


        //form components
        let components = this.getAllChildren().filter((item)=>item.getFormData);

        //fields outside component
        fields = Array.from(fields).map((item)=>
        {
            let component = VueComponent.getComponent(item);
            while(component && !component.getFormData)
            {
                component = component.$parent;
                if(component === this)
                {
                    return item;
                }
            }
            if(!component)
            {
                return item;
            }
            return null;
        }).filter((item)=>item)
        .map((item)=>new FieldWrapper(item));

        let objects = fields.concat(components);
     

        return objects;
    }
    onSubmit(event)
    {

        let objects = this.getItems();



        let data = objects.reduce((result, item)=>
        {
            //TODO: get hierarchic name (... parent name . name )
            let name = item.getCleanedName();
            if(!name)
            {
                console.log('no name', item);
                debugger;
                throw new Error('no name for a form element');
            }

            if(item.isArray())
            {
                if(!result[name])
                {
                    result[name] = [];
                }
                result[name].push(item.getFormData());
            }else
            {
                result[name] = item.getFormData();
            }

            return result;
        }, {});

        // debugger;
        // let validators = Array.from(this.$el.querySelectorAll('[validator]')).map((item)=>item.getAttribute('validator'));
        // let list = validators[0].split(',').map((item)=>Validator.get(item));
        // debugger;
        
        // console.log(this.$refs.form);
        this.$emit('submit', event, data, this);
    }
    validate()
    {
        let objects = this.getItems();
        let allPromises = [];
        objects.forEach((item)=>
        {   
            let validators = item.$el.getAttribute('validator');
            if(item.$el.hasAttribute('required'))
            {
                if(validators)
                {
                    validator+=",required";
                }else
                {
                    validators = "required";
                }
            }
            if(!validators)
            {
                return [];
            }
            validators = Validator.parse(validators);
            validators = validators.map( (validator)=>
            {
                let success = validator.handle(item.getFormData());
                if(typeof success == "boolean")
                {
                    if(success)
                    {
                        success = Promise.resolve(success);
                    }
                    else
                    {
                        success  =  Promise.reject(success);
                    }
                }
                if(!success)
                {
                    success  = Promise.reject(false);
                }
                //not boolean => error
                if(!success.then)
                {
                    success = Promise.reject(success);
                }
                return success.then(()=>
                {
                    return true;
                }).catch(function(error)
                {
                    item.addError(error===false?'error':error)
                    return Promise.reject(false);
                })
            });
            allPromises = allPromises.concat(validators)
        });
        return Promise.all(allPromises).then(()=>
        {
            return true;
        }).catch(function()
        {
            debugger;
            return false;
        })

    }

   
}

class FieldWrapper
{
    constructor(field)
    {
        this.$el = field;
    }
    getFormData()
    {
        return this.$el.value;
    }
}
FieldWrapper.prototype.getCleanedName = FElement.prototype.getCleanedName;
FieldWrapper.prototype.isArray = FElement.prototype.isArray;
FieldWrapper.prototype.addError = FElement.prototype.addError;
FieldWrapper.prototype.getName = FElement.prototype.getName;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
