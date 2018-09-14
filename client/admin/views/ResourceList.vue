<template>
 <div class="list">
    <div>{{$route.params.resource}}</div>
    <component v-for="item, i in components" :is="item.component" :key="$route.params.resource+i" :resource="$route.params.resource">

    </component>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
import { config } from "myno/common/env/Configuration";
import { api } from "myno/client/io/API";
import List from "../components/List";

@Component({
  components: {
    'myno-admin-list':List
  },
  props:
  {
  },
  watch: {
    '$route' (to, from) {
        this.loadStructure();
    }
  }
})
export default class ResourceList extends VueComponent
{
    created()
    {
      this.loadStructure();
    }
    data()
    {
        return {
            components:[]
        };
    }
    loadStructure()
    {
      let resource = this.$route.params.resource;
       api().path('admin/'+resource+'/components').then((components)=>
       {
          this.components = components;
       })
    }
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
