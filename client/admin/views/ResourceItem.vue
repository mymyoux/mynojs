<template>
 <div class="item">
    <div>{{$route.params.resource}}/{{$route.params.id}}</div>
    <input type="button"  v-if="!edition" class="edit" @click="onEdit" value="edit">
    <div class="table">
      <div v-for="header, i in headers" class="row">
          <div class="header">
            {{header.label}}
          </div>
          <div class="item">
            <template v-if="item">
              <component :key="'row-'+i" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="edition && header.editable" :name="header.column" v-model="item[header.column]"  v-validate="header.validators" class="row header">
              </component>
              {{header.validators}}
            <span v-if="errors.has(header.column)" class="error">{{ errors.first(header.column) }}</span>
            </template>
            <div v-else>
              &nbsp;
            </div>
          </div>
      </div>
    </div>
    <div class="buttons" v-if="edition">
      <input type="button" value="cancel" @click="onCancel">
      <input type="button" value="save" @click="onSave">
    </div>
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
  },
  watch: {
    '$route' (to, from) {
        //this.load();
    }
  }
})
export default class ResourceItem extends VueComponent
{
    created()
    {
      this.save = null;
       api().path('admin/'+this.$route.params.resource+'/editable').then((headers)=>
        {
            this.headers = headers.map((item)=>
            {
              item.validators = item.validators?item.validators: {};
              if(!item.editable)
              {
                item.validators = {};
                return item;
              }

              if(item.required)
              {
                  item.validators.required = true;
              }  
              return item;
            });
            if(this.$route.params.id == 'new')
            {
              this.item = this.headers.reduce((item, header)=>
              {
                item[header.column] = null;
                return item;
              }, {});
            }
        });
        if(this.$route.params.id != 'new')
        {
            this.request = api().path('admin/'+this.$route.params.resource+'/edit').param('id',this.$route.params.id).then((item)=>
            {
                this.item = item;
            });
        }else
        {
          this.edition = true;
        }
    }
    onEdit()
    {
      let cls = this.item.constructor;
      let clone = new cls;
      for(var p in this.item)
      {
        clone[p] = this.item[p];
      }
      this.save = this.item;
      this.item = clone;
      this.edition = true;
    }
    onCancel()
    {
      this.item = this.save;
      this.edition = false;
      if(!this.item || !this.item.id)
      {
        this.$router.push({name:'list', params:{resource:this.$route.params.resource}});
      }
    }
    onSave()
    {
      this.$validator.validate().then((result) => {
          if (!result) {
            // do stuff if not valid.
          }else
          {
            this.saving();
          }
        });
    }
    saving()
    {
      this.edition = false;
      let suffix = this.item.id?'update':'create';
      debugger;
      api().path('admin/'+this.$route.params.resource+'/'+suffix).params(this.item).param('adminmodelid',this.item.id).then((item)=>
      {
        this.item = item;
        if(this.$route.params.id == 'new')
        {
          this.$router.replace({name:'item', params:{resource:this.$route.params.resource, id:this.item.id}});
        }
      });
    }
    data()
    {
        return {
            item:null,
            headers:[],
            edition:false
        };
    }
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.table
{
  display:flex;
  flex-direction:column;
  .header
  {
    width:200px;
  }
}

</style>
