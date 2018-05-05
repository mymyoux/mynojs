<template>
    <div>
        <label>{{label}}</label>
        <input :type="type" @change="onChange" :disabled="disabled" v-model="val">
         
   </div> 
</template>

<script>
import {VueComponent, Component} from "../../mvc/VueComponent";
import Vue from 'vue';
import FElement from "./FElement";

@Component({
    $_veeValidate: {
        //not used when using v-model
        value () {
            return this.val;
        }
    },
    props:
    {
        value:{},
        label:{type:String},
        type:{type:String, required:true},
        disabled:{type:Boolean, default:false}
    },
     watch: {
        value (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.val = newVal
            }
        },
        val (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.$emit('input', newVal)
            }
        }
    }
})
export default class FInput extends FElement
{
    data()
    {
        return {val:null};
    }
    onChange()
    {
        this.$emit('input', this.val);
    }
    mounted()
    {
        if(this.value)
        {
            this.val = this.value;
        }
        
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
