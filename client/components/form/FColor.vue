<template>
    <ul>
        <li v-for="item,i in items" :key="i" @click="select($event, item, i)" :class="{selected:selected === item}" :style="{backgroundColor:item}">
            <slot name="item" :item="item" :index="i">
                    {{item}}
            </slot>
        </li>
        <li class="custom" v-if="custom">
            <input type="color" v-model="selected" @change="onCustom">
        </li>
    </ul>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Provide,Event} from "../../mvc/VueComponent";
import FElement from "./FElement";

@Component({
    $_veeValidate: {
        //not used when using v-model
        value () {
            return this.selected;
        }
    },
    props:
    {
        value:{},
        list:{},
        custom:{default:true, type:Boolean},
        none:{default:false,type:Boolean}
    }
})
export default class FColor extends FElement
{
    data()
    {
        return {items:null,selected:null };
    }
   select(event, item, index)
   {
       if(this.none && this.selected === item)
       {
           this.selected = null;
       }else
       {
           this.selected = item;
       }
       this._emitValue();
   }
   onCustom()
   {
       this._emitValue();
   }
   _emitValue()
   {
        this.$emit("input", this.selected);
   }
    mounted()
    {
        if(this.value != undefined)
        {
            this.selected = this.value;
        }
        this.items = this.list;
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .selected
    {
        color:red;
    }
</style>
