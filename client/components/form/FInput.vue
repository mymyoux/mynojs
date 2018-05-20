<template>
    <div>
        <label v-if="localLabel">{{localLabel}}</label>
        <input :type="type" @change="onChange" :disabled="disabled" v-model="val" :min="min" :max="max" :name="name">
        <span v-if="name && errors.has(name)" class="f-error">{{errors.first(name)}}</span>
   </div> 
</template>

<script>
import {VueComponent, Component} from "../../mvc/VueComponent";
import Vue from 'vue';
import FElement from "./FElement";

@Component({
    inject: ['$validator'],
    $_veeValidate: {
        //not used when using v-model
        value () {
            return this.val;
        }
    },
    props:
    {
        disabled:{type:Boolean, default:false},
        label:{type:String},
        min:{type:Number},
        max:{type:Number},
        name:{type:String},
        type:{type:String, required:true},
        value:{},
    },
     watch: {
        value (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.val = newVal
            }
        },
        val (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.emit(newVal);
            }
        },
        label(newVal, oldVal)
        {
            if (newVal !== oldVal) {
               if(newVal)
               {
                   this.localLabel = newVal;
               }else
               if(this.name)
               {
                   this.localLabel = this.name;
               }else
               {
                   this.localLabel = null;
               }
            }
        }
    }
})
export default class FInput extends FElement
{
    data()
    {
        return {val:null,localLabel:null};
    }
    onChange()
    {
        this.emit(this.val);
        this.$emit('input', this.val);
    }
    emit(value)
    {
        if(this.type == "number")
        {
            this.$emit('input', parseInt(value, 10))
        }else{
            this.$emit('input', value)
        }
    }
    mounted()
    {
        if(this.value)
        {
            this.val = this.value;
        }
        if(this.label)
        {
            this.localLabel = this.label
        }else
        if(this.name)
        {
            this.localLabel = this.name;
        }
        if (null === this.label)
            this.localLabel = null;
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
