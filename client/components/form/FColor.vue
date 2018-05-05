<template>
    <ul>
        <li v-for="item,i in items" :key="i" @click="select($event, item, i)" :class="{selected:selected === item}" :style="{backgroundColor:item}">
            <slot name="item" :item="item" :index="i">
                    
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
        list:{default:()=>
        {
            return ["#e0e0e0", "#f44336", "#AB47BC", "#3F51B5", "#03A9F4", "#4CAF50", "#FBC02D", "#FF9800"];
        }},
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
            this.selected = this.value.toLowerCase();
        }
        this.items = this.list;
        if(this.items)
            this.items = this.items.map(item=>item.toLowerCase());
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    ul
    {
        display:flex;
        li
        {
            width:20px;
            height:20px;
        }
    }
    .selected
    {
        border-color:red;
        border-width:1px;
        border-style:solid;
    }
</style>
