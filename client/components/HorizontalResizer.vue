<template>
    <div class="resizer" @mousedown="onMouseDown" ref="resizer">&nbsp;</div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import Connectors from 'myno/client/components/Connectors.vue'
import { bus } from "../../common/events/Bus";

@Component({
    name:"horizontal-resizer",
    props:
    {
        top:{default:true, type:Boolean},
        bottom:{default:true, type:Boolean},
        percent:{default:false, type:Boolean},
        height:{default:true, type:Boolean},
        minHeight:{default:true, type:Boolean},
        maxHeight:{default:false, type:Boolean},
       
    }
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
        this.computeHeight();
        bus.trigger("window:resize", event);

    }
    // @Event("window:resize",{debounce:50})
    // onResize()
    // {
    //     debugger;
    //     this.computeHeight();
    // }
    computeHeight()
    {
        let index = Array.from(this.$refs.resizer.parentNode.children).indexOf(this.$refs.resizer);
        if(!~index)
        {
            return;
        }
        let height = this.$refs.resizer.parentNode.clientHeight - this.$refs.resizer.clientHeight;
        let percent = (this.resizing.startHeight+event.pageY-this.resizing.y)/height;
        if(this.top)
        {
            let top = this.$refs.resizer.parentNode.children[index-1];
            if(top)
            {
                if(this.percent)
                {
                    if(this.height)
                    {
                        top.style.height  = Math.round(percent*100)+"%";
                    }
                    if(this.minHeight)
                    {
                        top.style.minHeight  = Math.round(percent*100)+"%";
                    }
                    if(this.maxHeight)
                    {
                        top.style.maxHeight  = Math.round(percent*100)+"%";
                    }
                }else
                {
                    if(this.height)
                    {
                        top.style.height  = Math.round(percent*height)+"px";
                    }
                    if(this.minHeight)
                    {
                        top.style.minHeight  = Math.round(percent*height)+"px";
                    }
                    if(this.maxHeight)
                    {
                        top.style.maxHeight  = Math.round(percent*height)+"px";
                    }
                }
            }
        }
        if(~index && this.bottom)
        {
            let bottom = this.$refs.resizer.parentNode.children[index+1];
            if(bottom)
            {
                percent = 1 - percent;
                if(this.percent)
                {
                    if(this.height)
                    {
                        bottom.style.height  = Math.round(percent*100)+"%";
                    }
                    if(this.minHeight)
                    {
                        bottom.style.minHeight  = Math.round(percent*100)+"%";
                    }
                    if(this.maxHeight)
                    {
                        bottom.style.maxHeight  = Math.round(percent*100)+"%";
                    }
                }else
                {
                    if(this.height)
                    {
                        bottom.style.height  = Math.round(percent*height)+"px";
                    }
                    if(this.minHeight)
                    {
                        bottom.style.minHeight  = Math.round(percent*height)+"px";
                    }
                    if(this.maxHeight)
                    {
                        bottom.style.maxHeight  = Math.round(percent*height)+"px";
                    }
                }
            }
        }
    }
    onMouseUp()
    {
        this.computeHeight();
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
    width:100%;
    background:lightgray;
    height:1px;
    
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
