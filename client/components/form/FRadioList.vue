<template>
    <ul>
        <li v-for="item,i in items" :key="i" @click="select($event, item, i)" :class="{selected:~selected.indexOf(item)}">
            <slot name="item" :item="item" :index="i">
                <template v-if="!multiple">
                    {{item}}
                </template>
                <f-input v-else type="checkbox" :name="item"></f-input>
            </slot>
        </li>
    </ul>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Provide,Event} from "../../mvc/VueComponent";
import FElement from "./FElement";
import { Objects } from "../../../common/utils/Objects";

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
        multiple:{default:false,type:Boolean},
        none:{default:false,type:Boolean},
        object:{default:false, type:Boolean},
        objectFull:{default:false, type:Boolean}
    },
    watch:{
        value(newVal, oldVal)
        {
            if (!Objects.deepEquals(newVal, oldVal))
            {
                if(newVal == null)
                {
                    newVal = [];
                }
                if(!Array.isArray(newVal))
                {
                    if((this.object || this.objectFull) && typeof newVal == "object")
                    {
                        newVal = Object.keys(newVal).filter((item)=>newVal[item]);
                    }else
                    {
                        newVal = [newVal];
                    }
                }
                this.selected = newVal;
             //   this._$emitValue();
            }
        },
        multiple(newVal, oldVal)
        {
            if (newVal !== oldVal) {
                //needs to retrigger due to difference value format
            //    this._$emitValue();
            }
        },
        object(newVal, oldVal)
        {
            if (newVal !== oldVal) {
                //needs to retrigger due to difference value format
           //     this._$emitValue();
            }
        },
        list(newVal, oldVal)
        {
            if (newVal !== oldVal) {
                //needs to retrigger due to difference value format
                this.items = this.list.slice()
            //    this._$emitValue();
            }
        }
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
               this._$emitValue();
               return;
           }
       }
       //to add
       if(!this.multiple)
       {
           this.selected.splice(0, this.selected.length);
       }
       this.selected.push(item);
       this._$emitValue();
   }
   _$emitValue()
   {
       if(this.object || this.objectFull)
       {
           if(this.objectFull)
           {
            this.$emit("input", this.list.reduce((previous, item)=>
               {
                   previous[item] = !!~this.selected.indexOf(item);
                   return previous;
               },{}));


              this.$emit("change", this.list.reduce((previous, item)=>
               {
                   previous[item] = !!~this.selected.indexOf(item);
                   return previous;
               },{}));
           }else
           {
               this.$emit("input", this.selected.reduce((previous, item)=>
               {
                   previous[item] = true;
                   return previous;
               },{}));

               this.$emit("change",this.selected.reduce((previous, item)=>
               {
                   previous[item] = true;
                   return previous;
               },{}));
           }
       }else
       {
           if(this.multiple)
           {
               this.$emit("input", this.selected);
               this.$emit("change", this.selected);
           }else
           {
               this.$emit("input", this.selected[0]);
                this.$emit("change", this.selected[0]);
           }
       }
   }
    mounted()
    {
        if(this.value != undefined)
        {
            let value = this.value;
            if(value == null)
            {
                value = [];
            }
            if(!Array.isArray(value))
            {
                if((this.object || this.objectFull) && typeof value == "object")
                {
                    value = Object.keys(value).filter((item)=>value[item]);
                }
            }
            if(!Array.isArray(value))
            {
                    value = [value];
            }
            this.selected = value;
        }
        this.items = this.list.slice();
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../../renderer/scss/variables.scss";
    ul 
    {
        display:flex;
        >li 
        {
            background-color: #ececec;
            color: $grey;
            min-width: 85px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 0.5em;
            &.selected 
            {
                background-color: $blue;
                color:white;
            }
        }
        li + li 
        {
            margin-left:0.5em;
        }
    }
</style>
