<template>
    <ul>
            <div v-for="item,i in items" :key="i" @click="onClick($event, item)" @dblclick="onDoubleClick($event, item)" v-if="!filter || filter.test(item)">
                <slot  name="item" :item="item" :index="i">
                            <p v-if="filter" v-html="filter.transform(item)"></p>
                            <p v-else>{{item.name}}</p>
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
        items:{required:true},
        search:{required:false}
    },
    watch:{
        search:
        {
            handler()
            {
                this.filter = this.search;
            }
        }
    }
})
export default class List extends VueComponent
{
    data()
    {
        return {
            filter:null
        };
    }
    mounted()
    {
        this.filter = this.search;
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
ul /deep/ b
{
    font-weight: bold !important;
}
</style>
