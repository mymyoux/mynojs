<template>
 <div class="toasts">
    <transition-group name="fade" tag="p">
        <b-alert v-for="toast,i in toasts" :key="i" 
                :variant="toast.variant"
                :dismissible="toast.closable"
                class="toast"
                :class="{hide:!toast.visible}"
                :show="true"
                @dismissed="onRemove(this)"
                >
        {{toast.message}}
        <b-progress v-if="toast.progress && toast.delay" :key="i" :variant="toast.variant"
                    :max="toast.delay"
                    :value="toast.count"
                    height="4px">
        </b-progress>
        </b-alert>
    </transition-group>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import { config } from "../../common/env/Configuration";
import { api } from "myno/client/io/API";
@Component({
  components: {
  }
})
export default class Login extends VueComponent
{
    created()
    {
        this._timer = null;
    }
    data()
    {
        return {
           toasts:[]
        };
    }
    start()
    {
        if(this._timer === null)
        {
            this._timer = setInterval(this.onTick.bind(this), 100);
        }
    }
    onTick()
    {
        for(var toast of this.toasts)
        {
            toast.count = toast.delay - Math.floor((Date.now() - toast.start)/1000);
            if(toast.count<=-1)
            {
                toast.visible = false;
               // this.onRemove(toast);
            }
            if(toast.count<=-2)
            {
                //toast.visible = false;
                this.onRemove(toast);
            }
        }
    }
    end()
    {
        if(this._timer !== null)
        {
            clearInterval(this._timer);
            this._timer = null;
        }
    }
    @Event('toaster')
    onToaster(options = {})
    {
        if(typeof options == 'string')
        {
            options = {message:options};
        }
        let toast = Object.assign({closable:true, delay:5, count:0, start:Date.now(), progress:false, visible:true}, options);
        toast.count = toast.delay;
        if(toast.message && toast.message instanceof Error)
        {
            toast.type = 'error';
            toast.message = toast.message.message;
        }
        toast.variant = toast.type == 'error'?'danger':toast.type;
        this.toasts.push(toast)
        this.start();
    }
    onRemove(toast)
    {
        let index = this.toasts.indexOf(toast);
        if(index != -1)
            this.toasts.splice(index, 1);
        if(!this.toasts.length)
        {
            this.end();
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.toasts{
    position:fixed;
    width:50%;
    right:10px;
    bottom:0;
    z-index:5;
}
.fade-enter-active, .fade-leave-active {
  transition: all 1s;
}
.toast
{
  transition: all 500ms;
}
.fade-enter /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
 .fade-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  //transform: translateY(-30px);
}
.hide{
    opacity:0;
}
</style>
