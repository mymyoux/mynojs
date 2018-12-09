<template>
 <div class="toasts">
        <v-alert v-for="toast in toasts" :key="toast.id" 
                :color="toast.color"
                :type="toast.type"
                :dismissible="toast.closable"
                class="toast"
                @dismissed="onRemove(this)"
                v-show="toast.visible"
                transition="fade-transition"
                v-model="toast.visible"
                @input="onRemove(toast)"
                icon="new_releases"
                >
        {{toast.message}}
        </v-alert>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import { api } from "myno/client/io/API";
import { config } from "myno/common/env/Configuration";
var count = 0;
@Component({
  components: {
  }
})

export default class Login extends VueComponent
{
    created ()
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
            if(!toast.delay)
                continue;
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
        let toast = Object.assign({closable:false, delay:5, count:0, start:Date.now(), progress:false, visible:true, id:count++}, options);
        if(!toast.delay)
        {
            toast.closable = true;
        }
        toast.count = toast.delay;
        if(toast.message && toast.message instanceof Error)
        {
            toast.type = 'error';
            toast.message = toast.message.message;
        }
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
    beforeDestroy()
    {
        this.end();
    }
    mounted(){
        console.log("toaster mounted")
    }
}

global.toaster = (options)=>
{
    eventer('toaster', options);
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
