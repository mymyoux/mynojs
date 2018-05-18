<template>
    <div class="resizer" @mousedown="onMouseDown" ref="resizer">&nbsp;</div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import Connectors from 'myno/client/components/Connectors.vue'
import { bus } from "../../common/events/Bus";

@Component({
    name:"vertical-resizer"
})
export default class VerticalResizer extends VueComponent
{
    resizing;
    data()
    {
        return {
        };
    }
    onMouseDown(event)
    {
        let index = Array.from(this.$refs.resizer.parentNode.children).indexOf(this.$refs.resizer);
        if(index<=0)
        {
            console.warn("no left element");
            debugger;
        }
        let target = this.$refs.resizer.parentNode.children[index-1];
        this.resizing  = { x:event.pageX,  startWidth:target.offsetWidth};
        bus.on('window:mouseup', this.onMouseUp, this);
        bus.on('window:mousemove', this.onMouseMove, this);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
    }
    onMouseMove()
    {
        let index = Array.from(this.$refs.resizer.parentNode.children).indexOf(this.$refs.resizer);
        if(index<=0)
        {
            console.warn("no left element");
            debugger;
        }
        let target = this.$refs.resizer.parentNode.children[index-1];
        target.style.minWidth  = (this.resizing.startWidth+event.pageX-this.resizing.x)+"px";


    }
    onMouseUp()
    {
        let index = Array.from(this.$refs.resizer.parentNode.children).indexOf(this.$refs.resizer);
        if(index<=0)
        {
            console.warn("no left element");
            debugger;
        }
        let target = this.$refs.resizer.parentNode.children[index-1];
        target.style.minWidth  = (this.resizing.startWidth+event.pageX-this.resizing.x)+"px";
        bus.off('window:mouseup', this.onMouseUp, this);
        bus.off('window:mousemove', this.onMouseMove, this);
        bus.trigger("window:resize", event);
    }
    beforeDestroy() {
        bus.off('window:mouseup', this.onMouseUp, this);
        bus.off('window:mousemove', this.onMouseMove, this);
        bus.trigger("window:resize", event);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.resizer
{
    position:relative;
    height:100%;
    background:lightgray;
    width:1px;
    
    &::after{
        content: " ";
        position:absolute;
        right:-3px;
        height:100%;
        cursor:col-resize;
        width:6px;
        top:0;
    }
}
</style>
