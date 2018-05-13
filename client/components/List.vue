<template>
    <ul>
            <div v-for="item,i in items" :key="i" @click="onClick($event, item)" @dblclick="onDoubleClick($event, item)">
                <slot  name="item" :item="item" :index="i">
                            {{item.name}}
                </slot>
            </div>
    </ul>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../mvc/VueComponent";
import Vue from 'vue';
import { Objects } from "../../common/utils/Objects";
@Component({
    props: 
    {
        items:{required:true}
    }
})
export default class List extends VueComponent
{
    data()
    {
        return {

        };
    }
    onClick(event, item)
    {
        this.$emit('item-click', event, item);
    }
    onDoubleClick(event, item)
    {
        this.$emit('item-dblclick', event, item);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul
{
    display:flex;
    flex-direction: column;
    overflow-y: scroll;
    height:100%;
    div
    {
        padding:5px;
        cursor:pointer;
    }
}
</style>
