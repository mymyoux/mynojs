<template>
    <ul v-on:selectall.prevent.stop="onSelectAll">
            <div v-for="item,i in items" :key="i" @mousedown="onMouseDown($event, item, i)"  @mouseup="onMouseUp($event, item, i)"   @mousemove="onMouseMove($event, item, i)"  @dblclick="onDoubleClick($event, item)" v-if="!filter || filter.test(item)"
            :class="{selected:item.selected}"
            >
                <slot  name="item" :item="item" :index="i">
                            <p v-if="filter" v-html="filter.transform(item)"></p>
                            <p v-else>{{item.name}}</p>
                </slot>
            </div>
            <div class="warning">
                    <p v-if="filter">
                            no match
                    </p>
                    <p v-else>
                            empty list
                    </p>
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
     _mouseStart = null;
    _mouseLast = null;
    _itemChanged = [];
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
    }
    mounted()
    {
        this.filter = this.search;
    }
    onSelection(event)
    {
        this.$emit('item-selection', event, this.selected.slice());
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
   
    onSelectAll(event)
    {
        let current = this.selected[this.selected.length-1];
        this.items.forEach((item)=>item.selected = true);
        this.selected = this.items.slice();
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
    onMouseDown(event, model, index)
    {
        event.preventDefault();
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
        // if (this._itemChanged.length || this.template.list.models.filter((item) => item.selected || item._previousSelected != undefined).length || this.template.selected.length) {
        //     console.log('item:' + this._itemChanged.length);
        //     console.log('s:' + this.template.list.models.filter((item) => item.selected || item._previousSelected != undefined).length);
        //     console.log('se:' + this.template.selected.length);
        // }
        // console.log('[Mouse] Mousedown');
       // this._mouseStart = index;
        model._previousSelected = model.selected;
        if (!event.metaKey && !event.ctrlKey) {
            this.selected.forEach((item) => {
                delete item._previousSelected;
                item.selected = false;
            });
            this.selected = [];
        }else{
            
        }
            // this.$getProp('list').models.forEach((item)=>
            // {
            //     item.selected = false;
            // });
            model.selected = !model.selected;
            if (model.selected && !~this.selected.indexOf(model)) {
                this.selected.push(model);
            }
            else if(!model.selected) {
                var index = this.selected.indexOf(model);
                if (index != -1)
                    this.selected.splice(index, 1);
            }
        // }
        // else {
        //     if(event.shiftKey)
        //     {
        //         if (!model.selected && !~this.selected.indexOf(model))
        //             this.selected.push(model);
        //         model.selected = true;

        //     }else
        //     {
        //          model.selected = !model.selected;
        //         if (model.selected && !~this.selected.indexOf(model)) {
        //             this.selected.push(model);
        //         }
        //         else if(!model.selected) {
        //             var index = this.selected.indexOf(model);
        //             if (index != -1)
        //                 this.selected.splice(index, 1);
        //         }
        //     }
        // }
    }
    onMouseMove(event, model, index) {
        if (this._mouseStart == null) {
            return;
        }
        //no button
        if (event.buttons == 0) {
            this.onMouseUp(event);
            return;
        }
        event.preventDefault();
        //   if(this.template.draggable &&  !event.metaKey && !event.ctrlKey && !event.shiftKey)
        // {
        //     return this._onDraggableMouseMove(event, index);
        // }
        //console.log('[Mouse] MouseMove');
        var index1 = Math.min(index, this._mouseStart);
        var index2 = Math.max(index, this._mouseStart);
        console.log(index1 +" -> "+index2);
        var model;
        for (var p of this._itemChanged) {
            model = this.items[p];
            model.selected = model._previousSelected;
            if (model.selected && this.selected.indexOf(model) == -1) {
                this.selected.push(model);
            }
            else
            if(!model.selected) {
                var index = this.selected.indexOf(model);
                if (index != -1)
                    this.selected.splice(index, 1);
            }
        }
        this._itemChanged = [];
        for (var i = index1; i <= index2; i++) {
            model = this.items[i];
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
                    var index = this.selected.indexOf(model);
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
    onMouseUp(event, item, index) {
        // if(this.template.draggable)
        // { 
        //     return;
        // }
        if (this._mouseStart == null) {
            return;
        }
        this._mouseLast = index;
        event.preventDefault();

        var index1 = Math.min(index, this._mouseStart);
        var index2 = Math.max(index, this._mouseStart);

        
        var model;
        for (var p of this._itemChanged) {
            model = this.items[p];
            model.selected = model._previousSelected;
            if (model.selected && this.selected.indexOf(model) == -1) {
                this.selected.push(model);
            }
            else 
            if(!model.selected){
                var index = this.selected.indexOf(model);
                if (index != -1)
                    this.selected.splice(index, 1);
            }
            delete model._previousSelected;
        }
        
        this._itemChanged = [];
        
        for (var i = index1; i <= index2; i++) {
            model = this.items[i];
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
                    var index = this.selected.indexOf(model);
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
        //this.trigger("selection");
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
