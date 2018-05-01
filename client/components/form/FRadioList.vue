<template>
    <ul>
        <li v-for="item,i in items" :key="i" @click="select($event, item, i)" :class="{selected:~selected.indexOf(item)}">
            <slot name="item" :item="item" :index="i">
                    {{item}}
            </slot>
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
            return this.list;
        }
    },
    props:
    {
        value:{},
        list:{},
        multiple:{default:false,type:Boolean},
        none:{default:false,type:Boolean}
    }
})
export default class FRadioList extends FElement
{
    data()
    {
        return {items:null,selected:[] };
    }
   select(event, item, index)
   {
       let idx = this.selected.indexOf(item);
       if(~idx)
       {
           if(this.none || this.selected.length>1)
           {
               this.selected.splice(idx, 1);
               this._emitValue();
               return;
           }
       }
       //to add
       if(!this.multiple)
       {
           this.selected.splice(0, this.selected.length);
       }
       this.selected.push(item);
       this._emitValue();
   }
   _emitValue()
   {
       if(this.multiple)
       {
           this.$emit("input", this.selected);
       }else
       {
           this.$emit("input", this.selected[0]);
       }
   }
    mounted()
    {
        if(this.value != undefined)
        {
            this.selected = Array.isArray(this.value)?this.value.slice():[this.value];
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
