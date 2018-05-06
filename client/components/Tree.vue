<template>
  <ul class="tree" v-if="model">
    <tree-item v-for="item,i in model" :model="item" :key="i" @click="onClick"></tree-item>
  </ul>
</template>

<script>


import {VueComponent, Event, Component} from "../mvc/VueComponent";
@Component({
    props:
    {
        value:{required:true}
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