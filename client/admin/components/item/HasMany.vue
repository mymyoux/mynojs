<template>
 <div class="item has-many">
    <myno-admin-item-item-search v-if="edition && !selected" :value="item" :header="header" @input="onSelect">
      <div slot="pre" @click="onCreate">
      create new
      </div>
    </myno-admin-item-item-search>
      <div>
        <div class="item child has-many">
          <div v-for="item, j in relations" class="row row-has-many">
              <div v-for="header, i in headers" class="column column-has-many">
                <component v-if="header.pivot" :key="'row-'+i+'-'+j" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="header.editable && ~editing.indexOf(item)" :name="header.column" v-model="item.pivot[header.column]"  v-validate="header.validators" class="item-has-many">
                </component>
                <component v-else :key="'row-'+i+'-'+j" :is="'myno-admin-item-item-'+header.type" :header="header" :edition="header.editable  && ~editing.indexOf(item)" :name="header.column" v-model="item[header.column]"  v-validate="header.validators" class="item-has-many">
                </component>
              </div>
              <template v-if="!~editing.indexOf(item)">
                <div @click="onEdit(item)" class="cross" :key="'edit'">
                    edit
                </div>
                  <div @click="onRemove(item)" class="cross" :key="'remove'">
                    x
                </div>
              </template>
              <template v-else>
                <div @click="onSave(item)" class="cross" :key="'save'">
                    save
                </div>
                <div @click="onCancel(item)" class="cross" :key="'cancel'">
                    cancel
                </div>
              </template>
          
          </div>
        </div>
      </div>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
import { api } from "myno/client/io/API";
import {Objects} from "myno/common/utils/Objects";
@Component({
  name:'myno-admin-item-item-hasMany',
  components: {
  },
  props:
  {
      value:{required:true},
      header:{required:true},
      edition:{required:false, default:true},
      parentId:{required:false},
      parentResource:{required:false},
  },
  watch:
  {
    value()
    {
      this.item = this.value
      this.loadRelations();
    }
  }
})
export default class hasMany extends VueComponent
{
  created()
  {
    window['a'] = this;
    api().path('admin/'+this.parentResource+'/viewable-many').param('column',this.header.column).then((headers)=>
    {
      this.headers = headers;
    });
    this.loadRelations();
    this.selected = this.item;

  }
  loadRelations()
  {
    if(!this.parentId || !this.parentResource)
    {
      return;
    }
     api().path('admin/'+this.parentResource+'/get-many').param('adminmodelid', this.parentId).param('admincolumn', this.header.column).then((relations)=>
    {
      this.relations = relations;
      //this.emit('input', this.relations);
    });
  }
    data()
    {
      return {
        item:null,
        headers:[],
        search:null,
        selected:null,
        relations:[],
        results:[],
        editing:[],
        save:[]
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
       api().path('admin/'+this.parentResource+'/add-many')
       .param('adminmodelid', this.parentId)
       .param('admincolumn', this.header.column)
       .param('adminrelationid', item.id)
       .then((relation)=>
       {
         debugger;
         if(!item.pivot)
         {
           item.pivot = this.getDefaultPivot();
         }
            this.relations.push(item);
       }, (error)=>
       {
            event('toaster', {message:"can\'t add this element", type:'error'});
       });
      //this.selected = item;
      //this.emit('input', item);
    }
    onEdit(item)
    {
      if(~this.editing.indexOf(item))
      {
          return;
      }
       let cls = item.constructor;
      let clone = new cls;
      for(var p in item)
      {
        clone[p] = Objects.clone(item[p]);
      }
      this.save.push(clone);
      //this.item = clone;
      
      this.editing.push(item);
    }
    onSave(item)
    {
      let index = this.editing.indexOf(item);
      if(!~index)
        return;

      let old = this.save[index];
      this.save.splice(index, 1);
      this.editing.splice(index, 1);
      api().path('admin/'+this.parentResource+'/update-many')
      .param('adminmodelid', this.parentId)
      .param('admincolumn', this.header.column)
      .param('adminrelationid', item.id)
      .params(item.pivot)
      .param('old',old.pivot)
      .then((relation)=>
       {
         debugger;
       }, (error)=>
       {
            event('toaster', {message:"can\'t remove this element", type:'error'});
       });
    }
    onCancel(item)
    {
      let index = this.editing.indexOf(item);
      if(~index)
      {
        this.editing.splice(index, 1);
        let indexRelation = this.relations.indexOf(item);
        this.relations.splice(indexRelation, 1, this.save[index]);
        this.save.splice(index, 1);
      }
    }
    onRemove(item)
    {
        let index = this.relations.indexOf(item);
        if(!~index)
        {
          return;
        } 


        this.relations.splice(index, 1);
        api().path('admin/'+this.parentResource+'/remove-many')
        .param('old',item)
       .param('adminmodelid', this.parentId)
       .param('admincolumn', this.header.column)
       .param('adminrelationid', item.id)
       .then((relation)=>
       {
       }, (error)=>
       {
            event('toaster', {message:"can\'t remove this element", type:'error'});
       });
    }
    onCreate()
    {
      this.emit('create', this.header);
    }
    getDefaultPivot()
    {
      return this.headers.filter(function(item)
      {
        return item.pivot;
      }).reduce(function(previous, item)
      { 
        previous[item.column] = null;
        return previous;
      }, {});
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.item.has-many
{
    display:flex;
    flex-direction:column;
}
  .has-many.child
  {
    display:flex;
    flex-direction: column;
    .row
    {
      display:flex;
    }
  }
  .cross
  {
    cursor:pointer;
  }
</style>
