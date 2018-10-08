<template>
 <div class="item">
    <myno-admin-item-item-search v-if="edition && !selected" :value="item" :header="header" @input="onSelect">
      <div slot="pre" @click="onCreate">
      create new
      </div>
    </myno-admin-item-item-search>
    <div v-else>
      <div class="item belongs-to">
        <template v-if="item">
          <div v-for="header, i in headers" class="row row-belongs-to">
            <component :key="'row-'+i" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="false" :name="header.column" v-model="item[header.column]"  v-validate="header.validators" class="item-belongs-to">
            </component>
          </div>
          <div v-if="edition && selected === item" @click="onRemove()" class="cross">
              x
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
    api().path('admin/'+this.header.resource+'/viewable').then((headers)=>
    {
      this.headers = headers;
    });
    this.selected = this.item;

  }
    data()
    {
      return {
        item:null,
        headers:[],
        search:null,
        selected:null,
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
        console.log(this.results);
      });
    }
    onSelect(item)
    {
      this.selected = item;
      this.emit('input', item);
    }
    onRemove()
    {
      this.selected = null;
      this.emit('input', null);
      Vue.nextTick(()=>
      {
        if(this.$refs.search)
        {
          this.$refs.search.focus();
          this.$refs.search.select();
        }
      })
    }
    onCreate()
    {
      this.emit('create', this.header);
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .belongs-to
  {
    display:flex;
  }
   .cross
  {
    cursor:pointer;
  }
</style>
