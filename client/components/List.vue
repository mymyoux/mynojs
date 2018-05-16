<template>
    <ul ref="root" v-on:selectall.prevent.stop="onSelectAll" @scroll.passive="onScroll">
            <div ref="items" v-for="item,i in filtered" :key="i" @mousedown="onMouseDown($event, item, i)"  @mouseup="onMouseUp($event, item, i)"   @mousemove="onMouseMove($event, item, i)"  @dblclick="onDoubleClick($event, item)"
            :class="{selected:item.selected}"
            >
                <slot  name="item" :item="item" :index="i">
                            <p v-if="filter" v-html="filter.transform(item)"></p>
                            <p v-else>{{item.name}}</p>
                </slot>
            </div>
            <div class="warning">
                    <slot v-if="filter" name="no_match">
                        <p>
                                no match
                        </p>
                    </slot>
                    <slot v-else name="empty">
                        <p>
                                no match
                        </p>
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
        value:{required:false},
        search:{required:false},
        multiOnSelect:{required:false, default:false},
        scrollBottom:{required:false, default:50}
    },
    watch:{
        search:
        {
            handler()
            {
                this.filter = this.search;
            }
        },
        value:
        {
            handler()
            {
                this.selected = this.value?this.value:[];
            }
        }
    }
})
export default class List extends VueComponent
{
     _mouseStart = null;
    _mouseLast = null;
    _itemChanged = [];
    _lastScroll = 0;
    data()
    {
        return {
            filter:null,
            selected:[],
        };
    }
    created()
    {
        
        this._mouseStart = null;
        this._mouseLast = null;
        this._itemChanged = [];
        this._lastScroll = 0;
    }
    mounted()
    {
        this.filter = this.search;
    }
    onSelection(event)
    {
        let selected = this.selected.slice();
        this.$emit('item-selection', event, selected);
        this.emit('input',selected);
        this.onClick(event, this.selected[this.selected.length-1])
    }
   
    onClick(event, item)
    {
        this.$emit('item-click', event, item);
    }
    onDoubleClick(event, item)
    {
        this.$emit('item-dblclick', event, item);
    }
    onScroll(event)
    {
        const scroll = this.$refs.root.scrollTop;
        const scrollTotal = this.$refs.root.scrollHeight;
        const height = this.$refs.root.clientHeight;
        const direction = this._lastScroll - scroll>0?'up':'down';
        
        if(direction == "up" && scroll == 0)
        {
            this.$emit('top', event);
            console.log('top');
        }
        
        if(direction == "down" && scrollTotal-scroll <= height)
        {
            this.$emit('bottom', event);
        }

        this._lastScroll = scroll;
    }
    scrollTo(item)
    {
        let index;
        if(typeof item == "number")
        {
            index = item;
        }else{
            item = this.items.indexOf(item);
        }
        if(!~index)
        {
            console.warn('item not found');
            return;
        }
        if(index<0)
        {
            index = 0;
        }
        let child = this.$refs.items[index];
        if(!child)
        {
            if(index>=this.$refs.items.length)
            {
                child = this.$refs.items[this.$refs.items.length-1];
            }else
            {
                return;
            }
        }
        if(child)
        {
            this.$refs.root.scrollTop = child.offsetTop - this.$refs.root.offsetTop
        }
    }
    get filtered()
    {
        if(!this.search)    
            return this.items;
        return this.items.filter((item)=>
        {
            return item.selected || this.search.test(item)
        });
    }
   
    onSelectAll(event)
    {
        let current = this.selected[this.selected.length-1];
        this.filtered.forEach((item)=>item.selected = true);
        this.selected = this.filtered.slice();
        if(current)
        {
            let index = this.selected.indexOf(current);
            if(~index)
            {
                this.selected.splice(index, 1);
                this.selected.push(current);
            }
        }
        this.onSelection(event);
    }
    onMouseDown(event, model)
    {
        event.preventDefault();
        let index = this.filtered.indexOf(model);
        if(!~index)
        {
            return;
        }
        this._mouseStart = null;
        
        // var offset = this.start?this.start:0;
        // index += offset;

        if (!model)
            return;
        if (!event.shiftKey) {
            this._mouseLast = index;
            this._mouseStart = index;
        }
        else {
            if (!event.metaKey && !event.ctrlKey) {
                this.selected.forEach((item) => {
                    delete item._previousSelected;
                    item.selected = false;
                });
                this.selected = [];
                // this.$getProp('list').models.forEach((item)=>
                // {
                //     item.selected = false;
                // });
                this._mouseStart = this._mouseLast;
                this.onMouseUp(event, model, index);
                return;
            }else
            {
                this._mouseStart = this._mouseLast;
                //this._mouseLast = index;
            }
            //handle like mouseup
        }
        model._previousSelected = model.selected;
        if (!event.metaKey && !event.ctrlKey) {
            this.selected.forEach((item) => {
                delete item._previousSelected;
                item.selected = false;
            });
            this.selected = [];
        }else{
            
        }
            model.selected = !model.selected;
            if (model.selected && !~this.selected.indexOf(model)) {
                this.selected.push(model);
            }
            else if(!model.selected) {
                let index = this.selected.indexOf(model);
                if (index != -1)
                    this.selected.splice(index, 1);
            }
    }
    onMouseMove(event, model) {
        if (this._mouseStart == null) {
            return;
        }
        let index = this.filtered.indexOf(model);
        if(!~index)
        {
            return;
        }
        //no button
        if (event.buttons == 0) {
            this.onMouseUp(event);
            return;
        }
        event.preventDefault();
        var index1 = Math.min(index, this._mouseStart);
        var index2 = Math.max(index, this._mouseStart);
        if(!this.multiOnSelect && !event.ctrlKey && !event.metaKey && !event.shiftKey)
        {
            index1 = index2 = this._mouseStart;
        }
  
        var model;
        for (var p of this._itemChanged) {
            model = this.filtered[p];
            model.selected = model._previousSelected;
            if (model.selected && this.selected.indexOf(model) == -1) {
                this.selected.push(model);
            }
            else
            if(!model.selected) {
                let index = this.selected.indexOf(model);
                if (index != -1)
                    this.selected.splice(index, 1);
            }
        }


     

        this._itemChanged = [];
        for (var i = index1; i <= index2; i++) {
            model = this.filtered[i];
            if (!model)
                continue;
            if (this._itemChanged.indexOf(i) == -1) {
                model._previousSelected = model.selected;
                this._itemChanged.push(i);
            }
            if (event.metaKey || event.ctrlKey) {
                if(i == this._mouseStart)
                {
                    model.selected = !model.selected;
                }
                model.selected = !model.selected;
                if (model.selected) {
                    this.selected.push(model);
                }
                else {
                    let index = this.selected.indexOf(model);
                    if (index != -1)
                        this.selected.splice(index, 1);
                }
            }
            else {
                if (!model.selected)
                    this.selected.push(model);
                model.selected = true;
            }
        }
    }
    onMouseUp(event, model) {
        if (this._mouseStart == null) {
            return;
        }
        let index = this.filtered.indexOf(model);
        if(!~index)
        {
            return;
        }
        this._mouseLast = index;
        event.preventDefault();

        var index1 = Math.min(index, this._mouseStart);
        var index2 = Math.max(index, this._mouseStart);

        if(!this.multiOnSelect && !event.ctrlKey && !event.metaKey && !event.shiftKey)
        {
            this.selected.forEach((item)=>item.selected = false);
            this.selected = [];
            index1 = index2 = this._mouseStart;
        }
        var model;
        for (var p of this._itemChanged) {
            model = this.filtered[p];
            model.selected = model._previousSelected;
            if (model.selected && this.selected.indexOf(model) == -1) {
                this.selected.push(model);
            }
            else 
            if(!model.selected){
                let index = this.selected.indexOf(model);
                if (index != -1)
                    this.selected.splice(index, 1);
            }
            delete model._previousSelected;
        }
        
        this._itemChanged = [];
        
        for (var i = index1; i <= index2; i++) {
            model = this.filtered[i];
            if (!model)
                continue;
            if (event.metaKey || event.ctrlKey) {
                if(i == this._mouseStart)
                {
                    model.selected = !model.selected;
                }
                model.selected = !model.selected;//model._previousSelected;
                if (model.selected && !~this.selected.indexOf(model)) {
                    this.selected.push(model);
                }
                else if(!model.selected){
                    let index = this.selected.indexOf(model);
                    if (index != -1)
                        this.selected.splice(index, 1);
                }
            }
            else {
                if (!model.selected && !~this.selected.indexOf(model))
                    this.selected.push(model);
                model.selected = true;
            }
        }
        this._mouseStart = null;
        this.onSelection();
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
        text-align: left;
        cursor:pointer;
        &:hover
        {
            background-color: #cdd3d9;
        }
        &.selected
        {
            background:#278ffe;
            color:white;
        }
        p{
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
        }
    }
    .warning
    {
        //background:orange;
        color:red;
    }
    div+.warning
    {
        display:none;
    }
}
ul /deep/ b
{
    font-weight: bold !important;
}
</style>
