<template>
 <div class="item">
    <div v-if="edition">
        <input type="search" v-model="search" @keyup="onKeyPress">
        <ul class="results">


            <template v-for="item in results">
              <div v-for="header, i in headers" class="row">
                  <component :key="'row-'+i" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="false" :name="header.column" v-model="item[header.column]"  v-validate="header.validators" class="row header">
                  </component>
              </div>
            </template>
          

        </ul>
    </div>
    <div v-else>
      <div class="item">
        <template v-if="item">
          <div v-for="header, i in headers" class="row">
            <component :key="'row-'+i" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="false" :name="header.column" v-model="item[header.column]"  v-validate="header.validators" class="row header">
            </component>
        </div>
        </template>
        <div v-else>
          &nbsp;
        </div>
      </div>
    </div>
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
      edition:{required:false, default:true}
  },
  watch:
  {
    value()
    {
      this.item = this.value;
    }
  }
})
export default class BelongsTo extends VueComponent
{
  created()
  {
    this.item = this.value;
    if(this.item)
    {
      api().path('admin/'+this.header.resource+'/viewable').then((headers)=>
      {
        this.headers = headers;
      });
    } 

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
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
