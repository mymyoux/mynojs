<template>
    <div class="resizer" @mousedown="onMouseDown" ref="resizer">&nbsp;</div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import Connectors from 'myno/client/components/Connectors.vue'
import { bus } from "../../common/events/Bus";

@Component({
    name:"horizontal-resizer"
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
        this.resizing  = { y:event.pageY,  startHeight:target.offsetHeight};
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
        target.style.height  = (this.resizing.startHeight+event.pageY-this.resizing.y)+"px";
        target.style.minHeight  = (this.resizing.startHeight+event.pageY-this.resizing.y)+"px";
        bus.trigger("window:resize", event);

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
        target.style.height  = (this.resizing.startHeight+event.pageY-this.resizing.y)+"px";
        target.style.minHeight  = (this.resizing.startHeight+event.pageY-this.resizing.y)+"px";
        bus.off('window:mouseup', this.onMouseUp, this);
        bus.off('window:mousemove', this.onMouseMove, this);
        bus.trigger("window:resize", event);
    }
    beforeDestroy() {
        bus.off('window:mouseup', this.onMouseUp, this);
        bus.off('window:mousemove', this.onMouseMove, this);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.resizer
{
    position:relative;
    &::after{
        content: " ";
        position:absolute;
        top:-3px;
        left:0;
        width:100%;
        cursor:row-resize;
        height:6px;
        //background:red;
    }
}
</style>
