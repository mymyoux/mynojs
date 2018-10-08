<template>
<div class="view">
  <myno-admin-resource-item v-if="createnew" :component="true" :resource="createnew.resource" @created="onSubCreated" @cancel="onSubCancel">

  </myno-admin-resource-item>
  <div v-else class="item">
      <div>{{params.resource}}/{{params.id}}</div>
      <input type="button"  v-if="!edition" class="edit" @click="onEdit" value="edit">
      <div class="table">
        <div v-for="header, i in headers" class="row" :class="{'has-many':header.type == 'hasMany'}">

            <div class="header">
              {{header.label}}
            </div>
            <div class="item">
              <template v-if="item">
                <component v-if="header.pivot" :key="'row-'+i" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="edition && header.editable" :name="header.column" v-model="item.pivot[header.column]" :parent-id="item.id" :parent-resource="params.resource" v-validate="header.validators" class="row header" @create="onCreateNew">
                </component>
                <component v-else :key="'row-'+i" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="edition && header.editable" :name="header.column" v-model="item[header.column]" :parent-id="item.id" :parent-resource="params.resource" v-validate="header.validators" class="row header" @create="onCreateNew">
                </component>
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
    component:
    {
      type:Boolean,
      default:false,
      required:false
    },
    id:
    {
      required:false,
      default:'new'
    },
    resource:
    {
      required:false
    }
  },
  watch: {
    '$route' (to, from) {
        if(!this.component)
        {
            this.params = this.$route.params;
        }
    },
    id(to, from)
    {
      if(!this.component)
      {
        return;
      }
      this.params = {
          resource:this.resource,
          id:this.id
        }
    },
    resource(to, from)
    {
      if(!this.component)
      {
        return;
      }
      this.params = {
          resource:this.resource,
          id:this.id
        }
    }
  }
})
export default class ResourceItem extends VueComponent
{
    created()
    {
      if(this.component)
      {
        this.params = {
          resource:this.resource,
          id:this.id
        }
      }else
      {
        this.params = this.$route.params;
      }
      this.save = null;
       api().path('admin/'+this.params.resource+'/editable').then((headers)=>
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
            if(this.params.id == 'new')
            {
              this.item = this.headers.reduce((item, header)=>
              {
                item[header.column] = null;
                return item;
              }, {});
            }
        });
        if(this.params.id != 'new')
        {
            this.request = api().path('admin/'+this.params.resource+'/edit').param('id',this.params.id).then((item)=>
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
        if(this.component)
        {
          this.emit('cancel');
        }else
        {
          this.$router.push({name:'list', params:{resource:this.params.resource}});
        }
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
      api().path('admin/'+this.params.resource+'/'+suffix).params(this.item).param('adminmodelid',this.item.id).then((item)=>
      {
        this.item = item;
        if(this.params.id == 'new')
        {
          if(this.component)
          {
            this.emit('created', this.item);
          }else
          {
            this.$router.replace({name:'item', params:{resource:this.params.resource, id:this.item.id}});
          }
        }
      });
    }
    data()
    {
        return {
            item:null,
            headers:[],
            edition:false,
            params:null,
            createnew:null
        };
    }
    onCreateNew(header)
    {
      this.createnew = header;
    }
    onSubCreated(item)
    {
      this.item[this.createnew.column] = item;
      this.createnew = null;
    }
    onSubCancel()
    {
      this.createnew = null;
    }
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.table
{
  display:flex;
  flex-direction:column;
  .header
  {
    width:200px;
  }
  .row
  {
    display:flex;
    &.has-many
    {
      display:block;
      >.header
      {
       
        font-size:2em;
        width:auto;
      }
    }
  }
}

</style>
