
<template>
    <ul class="container">
        <div v-for="item, i in value"  @click="onClick(item)" class="item" :class="{dragging:dragging === item, dragover:dragover === item}" draggable="true" @dragstart="onDragStart($event, item)" @drag="onDragMove" @dragend="onDragEnd" ref="item" :key="i" :i="i">
            <slot :item="item">
                <div :key="i">
                    {{item.label}}
                </div>
            </slot>
        </div>
        <div v-if="dragging" class="draggabsolute item"  :style="{left:x+'px'}">
            <slot :item="dragging">
                <div>
                    {{dragging.label}}
                </div>
            </slot> 
        </div>
        <div class="empty" ref="empty">
        </div>
    </ul>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../mvc/VueComponent";
import Vue from 'vue';
import { Objects } from "../../common/utils/Objects";
@Component({
    name:"drag-bar",
    props: 
    {
        value:{required:true,x:null}
    }
})
export default class DragBar extends VueComponent
{
    draggingElement = null;
    data()
    {
        return {
            dragging:null,
            dragover:null,
            x:null,
        };
    }
    onClick(item)
    {
        this.emit('item-click', event, item)
    }
    onDragStart(event, item)
    {
        let target = event.currentTarget;
        this.draggingElement = target;
        this.dragging = item;
        let clone = this.$refs.empty;
        event.dataTransfer.setDragImage(clone,target.clientWidth/2, target.clientHeight/2);
        this.computeAbsolute();
    }
    getX()
    {
         let x = event.offsetX+event.currentTarget.offsetLeft;
        if(x<0)
            x = 0;
        //+scrollX ? 
        return x;
    }
    onDragMove(event)
    {
        if(!event.clientY)
        {
            //ignore when mouse is out window
            return;
        }
        let x = this.getX();
        this.computeAbsolute();
        let index = this.$refs.item.length-1;
        let item;
        let before = false;
        for(let i=0; i<this.$refs.item.length; i++)
        {
            item = this.$refs.item[i];
            if(item.clientWidth+item.offsetLeft>x)
            {
                index = i;
                if(item.clientWidth/2+item.offsetLeft > x)
                {
                    before = true;
                }
                break;
            }
        }
        this.dragover = this.value[index];

        let previous = this.value.indexOf(this.dragging);
        this.value.splice(previous, 1);
        this.value.splice(index,0, this.dragging);

    }
    computeAbsolute(){
        let x = this.getX();
        x -= this.draggingElement.clientWidth/2;
        this.x = x;
    }
    onDragEnd()
    {
        this.dragging = null;
        this.dragover = null;
        //this.draggingElement.style.opacity = 1;
        this.draggingElement = null;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container
{
    display:flex;
    overflow-x:auto;
    position:relative;
    .item
    {
        cursor:pointer;
        position:relative;
        &.dragging
        {
            opacity:0;
        }
    }
   .draggabsolute
   {
       position:absolute;
   }
}
</style>
