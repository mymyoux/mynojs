<template>
    <ul ref="root" v-on:selectall.prevent.stop="onSelectAll" @scroll.passive="onScroll"  v-on:up="onKeyboardUp" v-on:down="onKeyboardDown">
            <div ref="items" v-for="item,i in filtered" :key="i" v-wheel="onWheel" @mousedown="onMouseDown($event, item, i)"  @mouseup="onMouseUp($event, item)"   @mousemove="onMouseMove($event, item, i)"  @dblclick="onDoubleClick($event, item)"
            :class="{selected:item.selected}"
            >
                <slot  name="item" :item="item" :index="i" :filter="filter">
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
import {VueComponent, Component, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import { Objects } from "../../common/utils/Objects";
import { Strings } from "../../common/utils/Strings";
@Component({
    props: 
    {
        items:{required:true},
        value:{required:false},
        search:{required:false},
        multiOnSelect:{required:false, default:false},
        scrollBottom:{required:false, default:300}
    },
    watch:{
        search:
        {
            handler()
            {
                if(typeof this.search != "string")
                    this.filter = this.search;
            }
        },
        value:
        {
            handler()
            {
                let value = this.value;
                if(!value)
                {
                    value = [];
                }
                if(!Array.isArray(value))
                {
                    value = [value];
                }
                
                if(this.selected.length != value || !this.selected.every((item, index)=>
                {
                    return item === value[index];
                }))
                {
                    this.selected.forEach((item)=>item.selected = false);
                    this.selected = value;
                    this.selected.forEach((item)=>item.selected = true);
                }
            }
        },
        items:
        {
            handler()
            {
                this._loadMoreEmitted = false;
                this._updateScrollBottom();
            }
        },
        scrollBottom:
        {
            handler()
            {
                this._updateScrollBottom();
            }
        }
    }
})
export default class List extends VueComponent
{
     _mouseStart = null;
    _mouseLast = null;
    _itemChanged = [];
    _lastScroll = -1;
    _scrollBottom = 0;
    _loadMoreEmitted = false;
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
        this._lastScroll = -1;
        this._loadMoreEmitted = false;
     
    }
    _updateScrollBottom()
    {
        let options = this.scrollBottom;
        if(typeof options == "string")
        {
            if(Strings.endsWith(options, "vp"))
            {
                //percent of viewport
                options = parseFloat(options);
                options = this.$refs.root.clientHeight*options;
            }else
            if(Strings.endsWith(options, "px"))
            {
                //percent of viewport
                options = parseFloat(options);
            }else
            if(Strings.endsWith(options, "%"))
            {
                //percent of viewport
                options = parseFloat(options);
                options = this.$refs.root.clientHeight*options;
            }
        }else
        {
            options = parseFloat(options);
        }
        
        if(isNaN(options))
        {
            console.warn('scrollBottom options is incorrect');
            options = 0;
        }
        this._scrollBottom = options;
    }
    mounted()
    {
        this._updateScrollBottom();
        if(typeof this.search != "string")
            this.filter = this.search;
    }
    onSelection(event)
    {
        let selected = this.selected.slice();
        this.$emit('item-selection', event, selected);
        this.emit('input',selected);
        this.onClick(event, this.selected[this.selected.length-1])
    }
    select(item)
    {
        this.selected.forEach((item)=>item.selected = false)
        item.selected = true;
        this.selected = [item];
    }
    @Event('window:resize', {debounce:100})
    onResize(event)
    {   
        this._updateScrollBottom();
    }
    onClick(event, item)
    {
        this.$emit('item-click', event, item);
    }
    onDoubleClick(event, item)
    {
        this.$emit('item-dblclick', event, item);
    }
    onWheel(event)
    {
        const height = this.$refs.root.clientHeight;
        const scrollTotal = this.$refs.root.scrollHeight;
        const scroll = this.$refs.root.scrollTop;
        if(scrollTotal<= height && event.deltaY>0 && this._lastScroll != scroll)
        {
            this._loadMoreEmitted = true;
            this.$emit('load-more', event);
            this.$emit('bottom', event);
            this._lastScroll = scroll;
        }
        if(event.deltaY > 0 && scrollTotal-scroll <= height && !this._loadMoreEmitted)
        {
            this._loadMoreEmitted = true;
            this.$emit('load-more', event);
        }
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
        
        if(direction == "down")
        {
            const bottom = scrollTotal - scroll - height;
            if(bottom <= this._scrollBottom && !this._loadMoreEmitted)
            {
                this._loadMoreEmitted = true;
                console.log('load-more');
                this.$emit('load-more', event);
            }
            if(scrollTotal-scroll <= height)
            {
                console.log('bottom');
                this.$emit('bottom', event);
            }
        }else
        {
            this._loadMoreEmitted = false;
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
            index = this.filtered.indexOf(item);
        }
        if(!~index)
        {
            console.warn('item not found');
            return;
        }
        if(index<0)
        {
            index = 0;
        }else
         if(index>=this.filtered.length)
        {
            index = this.filtered.length-1
        }

        let element = this.$refs.items[index];
        if(!element)
        {
            debugger;
            return;
        }
        let parent = element.parentNode;
        if(element.offsetTop< parent.scrollTop)
        {
            parent.scrollTop = element.offsetTop;
        }else
        if(element.offsetTop+element.offsetHeight>parent.scrollTop+parent.offsetHeight)
        {
            parent.scrollTop = element.offsetTop+element.offsetHeight - parent.offsetHeight;//parent.scrollLeft + parent.offsetWidth - element.offsetWidth;
        }
    }
    get filtered()
    {
        if(!this.filter)    
            return this.items;
        return this.items.filter((item)=>
        {
            return item.selected || this.filter.test(item)
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
    onKeyboardUp()
    {
         if(!this.filtered.length)
            return
        event.preventDefault();
        let index;
        if(this.selected.length)
        {
            let current = this.selected[this.selected.length-1];
            index = this.filtered.indexOf(current);
        }else
        {
            index = this.filtered.length;
        }
        index--;
        if(index<0)
        {
            index = this.filtered.length-1;
        }

        if(event.shiftKey || (event.original && event.original.shiftKey))
        {
            let current = index+1;
            if(current>= this.filtered.length)
            {
                current =0;
            }
            if(this.selected.length > 1)
            {
                if(this.filtered[index].selected )
                {
                    let indexselected = this.selected.indexOf(this.filtered[current]);
                    if(~indexselected)
                    {
                        this.selected.splice(indexselected, 1);
                    }
                    this.filtered[current].selected  = false;
                }
            }
            if(!this.filtered[index].selected)
            {
                this.filtered[index].selected =  true;
                this.selected.push(this.filtered[index]);
            }
        }else
        {
            this.selected.forEach((item)=>item.selected = false);
            this.filtered[index].selected =  true;
            this.selected = [this.filtered[index]];
        }
        
        this.onSelection();



        this.scrollTo(index);

    }
    onKeyboardDown()
    {
        if(!this.filtered.length)
            return
        event.preventDefault();
        let index;
        if(this.selected.length)
        {
            let current = this.selected[this.selected.length-1];
            index = this.filtered.indexOf(current);
        }else
        {
            index = -1;
        }
        index++;
        if(index>=this.filtered.length)
        {
            index = 0;
        }

         if(event.shiftKey || (event.original && event.original.shiftKey))
        {
            let current = index-1;
            if(current< 0)
            {
                current = this.filtered.length-1;
            }
            if(this.selected.length > 1)
            {
                if(this.filtered[index].selected )
                {
                    let indexselected = this.selected.indexOf(this.filtered[current]);
                    if(~indexselected)
                    {
                        this.selected.splice(indexselected, 1);
                    }
                    this.filtered[current].selected  = false;
                }
            }
            if(!this.filtered[index].selected)
            {
                this.filtered[index].selected =  true;
                this.selected.push(this.filtered[index]);
            }
        }else
        {
            this.selected.forEach((item)=>item.selected = false);
            this.filtered[index].selected =  true;
            this.selected = [this.filtered[index]];
        }
        
        this.onSelection();
            
        this.scrollTo(index);
    }
    onMouseDown(event, model)
    {
        if(event.which != 1)
        {
            return;
        }
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
        if (!event.shiftKey && (this.multiOnSelect || event.metaKey || event.ctrlKey)) {
            this._mouseLast = index;
            this._mouseStart = index;
        }
        else {
            if (!event.shiftKey  && !event.metaKey && !event.ctrlKey) {
                this.selected.forEach((item) => {
                    delete item._previousSelected;
                    //item.selected = false;
                });
                //this.selected = [];
                // this.$getProp('list').models.forEach((item)=>
                // {
                //     item.selected = false;
                // });
                this._mouseStart = index;//this._mouseLast;
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
       let  index =  this.filtered.indexOf(model);
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
    onMouseUp(event, model, index = null) {
        if (this._mouseStart == null) {
            return;
        }
         index = index != null ? index: this.filtered.indexOf(model);
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
            model = this.filtered[index];
            this.selected.forEach((item)=>item.selected = false);
            this.selected = [model];
            model.selected = true;
            //index1 = index2 = this._mouseStart;
            //shortcut
            this._mouseStart = null;
            this.onSelection();
            return;
        }
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
