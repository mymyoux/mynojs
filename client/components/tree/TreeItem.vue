<template>
  <li>
     <template v-if="model.children && model.children.length">
            <div v-if="!folderComponent" class="item children" :class="{open:model.open}" @click="onClickFolder">{{model.label}}</div>
            <component :is="folderComponent" v-else class="item children" :class="{open:model.open}"  :value="model" @click="onClick">{{model.label}}</component>
    </template>
    <template v-else>
        <div v-if="!itemComponent" class="item" @click="onClickItem">{{model.label}}</div>
        <component v-else :is="itemComponent" class="item" :value="model"></component>
    </template>
      <ul v-if="model.children && model.children.length && model.open">
          <tree-item v-for="item, i in model.children" :model="item" :key="i"  :item-component="itemComponent"  :folder-component="folderComponent"></tree-item>
      </ul>
  </li>
</template>

<script>


import {VueComponent, Event, Component} from "../../mvc/VueComponent";
@Component({
    props:
    {
        model:{required:true},
        itemComponent:{required:false},
        folderComponent:{required:false},   
    }
})
export default class TreeItem extends VueComponent
{
    mounted()
    {
    }
    onClickFolder(event)
    {
        this.model.open = !this.model.open;
    }
    onClickItem(event)
    {
        this.emit("item-select", this.model);
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