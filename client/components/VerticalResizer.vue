<template>
    <div class="resizer" @mousedown="onMouseDown"  @touchstart="onMouseDown" ref="resizer">&nbsp;</div>
</template>

<script>
import { VueMixinComponent} from "../mvc/VueComponent";
import { bus } from "../../common/events/Bus";

export default {
    name:"vertical-resizer",
    mixins: [VueMixinComponent],
    data()
    {
        return {
        };
    },
    beforeDestroy() {
        bus.off('window:mouseup', this.onMouseUp, this);
        bus.off('window:touchend', this.onMouseUp, this);
        bus.off('window:mousemove', this.onMouseMove, this);
        bus.off('window:touchmove', this.onMouseMove, this);
        bus.trigger("window:resize", event);
    },
    methods:
    {

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
            bus.on('window:touchend', this.onMouseUp, this);
            bus.on('window:mousemove', this.onMouseMove, this);
            bus.on('window:touchmove', this.onMouseMove, this);
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
        },
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
    
    
        },
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
            bus.off('window:touchend', this.onMouseUp, this);
            bus.off('window:mousemove', this.onMouseMove, this);
            bus.off('window:touchmove', this.onMouseMove, this);
            bus.trigger("window:resize", event);
        }
    }
}
</script>

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
