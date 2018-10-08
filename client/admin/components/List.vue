<template>
 <div class="list">
 <div class="table">
    <div class="buttons">
        <input type="button" value="create" @click="onCreate">
    </div>
    <div v-for="header in headers" class="column">
        <div class="header">{{header.label}}</div>
        <router-link v-for="item,j in items" :key="header.column+'-'+j"  :to="'/item/'+$route.params.resource+'/'+item.id">
            <component  :is="'myno-admin-item-list-'+header.type" :value="item[header.column]">
            </component>
        </router-link>
    </div>
 </div>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
import { config } from "myno/common/env/Configuration";
import { api } from "myno/client/io/API";


import String from "./list/String";
import Integer from "./list/Integer";
import Picture from "./list/Picture";
@Component({
  components: {
      'myno-admin-item-list-string':String,
      'myno-admin-item-list-integer':Integer,
      'myno-admin-item-list-picture':Picture,
  },
  props:
  {
      resource:{required:true}
  }
})
export default class List extends VueComponent
{
    created()
    {
        api().path('admin/'+this.$route.params.resource+'/listable').then((headers)=>
        {
            this.headers = headers;
        });
        this.request = api().path('admin/'+this.$route.params.resource+'/list').withapidata().then((result)=>
        {
            this.items = result.data;
        });
    }
    data()
    {
        return {
            headers:[],
            items:[]
        };
    }
    onCreate()
    {
        this.$router.push({name:'item',params:{'id':'new',resource:this.$route.params.resource}});
    }
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.table
{
    display:flex;
    .column
    {
        display:flex;
        flex-direction: column;
        .header
        {
            background:green;
        }
    }
}
</style>
