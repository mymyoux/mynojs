<template>
  <li>
      <div class="item" :class="{children:model.children && model.children.length, open:model.open}" @click="onClick">{{model.label}}</div>
      <ul v-if="model.children && model.children.length && model.open">
          <tree-item v-for="item, i in model.children" :model="item" :key="i"></tree-item>
      </ul>
  </li>
</template>

<script>


import {VueComponent, Event, Component} from "../../mvc/VueComponent";
@Component({
    props:
    {
        model:{required:true}   
    }
})
export default class TreeItem extends VueComponent
{
    mounted()
    {
    }
    onClick(event)
    {
        //this.$emit('click',event)`
        this.model.open = !this.model.open;
        console.log(this.model.open);
    }
}

</script>
<style scoped lang="scss">
.item
{
    position:relative;
    text-align: left;
    &.children
    {
        cursor:pointer;
        &::before{
            content:"+";
            position:absolute;
            transform:translate3d(-10px, 0, 0)
        }
        &.open::before{
            content:"-";
        }
    }
}
ul
{
    padding-left:30px;
}
</style>