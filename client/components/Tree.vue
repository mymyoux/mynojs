<template>
  <ul class="tree" v-if="model">
    <tree-item v-for="item,i in model" :model="item" :key="i" @click="onClick" :item-component="itemComponent" :folder-component="folderComponent">
         <template slot="item" slot-scope="_" >
              <slot name="item" v-bind:item="_.item">
                    {{_.item.label}}
                </slot>
        </template>
         <template slot="folder" slot-scope="_" >
             <slot name="item" v-bind:item="_.item">
                    {{_.item.label}}
            </slot>
        </template>
    </tree-item>
  </ul>
</template>

<script>


import {VueComponent, Event, Component} from "../mvc/VueComponent";
import { Objects } from "../../common/utils/Objects";
@Component({
    props:
    {
        value:{required:true},
        itemComponent:{required:false},
        folderComponent:{required:false},
    },
    watch:{
        value:
        {
            handler()
            {
                this.model = this.prepare(this.value);
            }
        }
    }
})
export default class Tree extends VueComponent
{
    data()
    {
        return {initialized:false, model:null}
    }
    mounted()
    {
        this.model = this.prepare(this.value);
        console.log(this.model);
    }
    prepare(object)
    {
        if(Array.isArray(object))
        {
            return object.map((item)=>this.prepare(item));
        }
        if(object.children)
        {
            if(object.open == undefined)
            {
                object.open = true;
            }
            if (object.__ob__) 
                delete object.__ob__;
            object.children = this.prepare(object.children);
        }
        return object;
    }
    onClick(event)
    {
        console.log(event);
    }
}

</script>

<style scoped lang="scss">
ul.tree
{
    padding-left:30px;
}
</style>