<template>
  <input type="search" v-model="search" @search="onChange" @keyup="onKeyDown" class="mousetrap">
</template>

<script>


import {VueComponent, Component, Prop, Watch, Emit,Event} from "../mvc/VueComponent";
import Vue from 'vue';


@Component({
    name:"tables",
    props:
    {
        value:{required:false}   
    },
    watch:
    {
        value:
        {
            handler()
            {
                this.search = this.value;
            }
        }
    }
  
})
export default class Tables extends VueComponent
{
  beforeMounted()
  {
  }
    data()
    {
        return {
            search:null
        };
    }
    mounted()
    {
        this.search = this.value; 
    }
    onChange()
    {
        this.emit('search-realtime', this.search);
        this.emit('input', this.search);
    }
    onKeyDown()
    {
        this.emit('search-realtime', this.search);
        // Vue.nextTick(()=>{
        // })
    }
      
}

</script>
