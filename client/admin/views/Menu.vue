<template>
 <div class="menu">
   menu
   <ul>
    <li v-if="menu" v-for="item in menu">
      <router-link :to="item.url">{{item.label}}</router-link>
    </li>
   </ul>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
import { config } from "myno/common/env/Configuration";
import { api } from "myno/client/io/API";
@Component({
  components: {
  },
  props:
  {
    content:{required:true}
  },
  watch:
  {
    content(oldValue, newValue)
    {
      this.menu = this.content;
    }
  }
})
export default class Menu extends VueComponent
{
    created()
    {
    }
    data()
    {
        return {
            menu:null
        };
    }
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
