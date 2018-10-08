<template>
 <div class="search">
     <input type="search" ref="search" v-model="search" @keyup="onKeyPress">
      <ul class="results">

        <slot name="pre">
          
        </slot>
          <div v-for="item in results" class="row">
            <div v-for="header, i in headers" class="row"  @click="onSelect(item)"> 
                <component :key="'row-'+i" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="false" :name="header.column" v-model="item[header.column]"  class="row header">
                </component>
            </div>
          </div>
      </ul>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
import { api } from "myno/client/io/API";

@Component({
  components: {
  },
  props:
  {
      value:{required:true},
      header:{required:true},
  },
  watch:
  {
    value()
    {
      this.item = this.value;
    }
  }
})
export default class Search extends VueComponent
{
  created()
  {
    this.item = this.value;
    api().path('admin/'+this.header.resource+'/viewable').then((headers)=>
    {
      this.headers = headers;
    });
  }
    data()
    {
      return {
        item:null,
        headers:[],
        search:null,
        results:[]
      }
    }  
    onInput()
    {
      Vue.nextTick(()=>
      {
        this.emit('input', this.item);
      })
    }
    onKeyPress(event)
    {
      if(!this.search)
      {
        this.results  = [];
        return;
      }
      api().path('admin/'+this.header.resource+'/search').param('search', this.search).then((results)=>
      {
        this.results = results;
      });
    }
    onSelect(item)
    {
      this.emit('input', item);
      this.results = [];
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.results
{
  display:flex;
  flex-direction:column;
  .row
  {
    display:flex;
  }
}
</style>
