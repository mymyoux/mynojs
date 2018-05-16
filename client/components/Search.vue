
<script>
// <template>
//   <input type="search" v-model="search" @search="onChange" @keyup="onKeyUp" class="mousetrap">
// </template>


import {VueComponent, Component, Prop, Watch, Emit,Event} from "../mvc/VueComponent";
import Vue from 'vue';
import { Objects } from "../../common/utils/Objects";
import { SearchHelper } from "../helpers/SearchHelper";

@Component({
    name:"tables",
    props:
    {
        value:{required:false},
        searchProp:{required:false, default:null},
        realtime:{required:false, default:false},
        object:{required:false, default:true}
    },
    watch:
    {
        value:
        {
            deep:true,
            handler()
            {
                this.updateValue();
            }
        },
        object:
        {
            handler()
            {
                   this.updateAsObject();
            }
        },
        searchProp:
        {
            handler()
            {
                this._defaultRealTimeSearch.prop = this.searchProp;
                this._defaultChangeSearch.prop = this.searchProp;
            }
        },
        realtime:
        {
            handler()
            {
                this.updateRealtime();
            }
        }
    },
  
})
export default class Search extends VueComponent
{
  created()
  {
      this._realtime = null;
      this.updateValue();
      this.updateRealtime();
      this.updateAsObject();
  }
  updateRealtime()
  {
      this._realtime = typeof this.realtime == "string"?this.realtime == "true":this.realtime;
  }
  updateAsObject()
  {
      this._asObject = typeof this.object == "string"?this.object == "true":this.object;
  }
  updateValue()
  {
      this.search = this.value;
      if(this.value && typeof this.value != "string")
      {
          this.search = this.value.value;
          this._searchObject = this.value;
      }
      if(!this._searchObject)
      {
          this._searchObject = new SearchObject();
      }
      if(this.searchProp)
      {
          this._searchObject.prop = this.searchProp;
      }
  }
  render(h)
  {
      let data = {};
      let children = null;
      let tag = "input";

        if( this.$slots.default &&  this.$slots.default.length)
        {
            var vNode = this.$slots.default[0];
            children  = vNode.children || vNode.text
            data = vNode.data;
            tag = vNode.tag;
            if(vNode.componentOptions && vNode.componentOptions.tag)
            {
                tag = vNode.componentOptions.tag;
            }
        }
        const isComponent = tag != "input";
        let on = {
               search:this.onChange.bind(this),
               change:()=>
               {
                   if(isComponent)
                   {
                       this.onChange();
                   }
               },
               input:  (event)=> {
                    //this.$emit('input', event.target.value)
                    if(isComponent)
                    {
                        this.search = event;
                        this.onKeyUp();
                    }else
                    {
                        this.search = event.target.value;
                    }
                }
        }
        if(this._realtime)
        {
             on.keyup = this.onKeyUp.bind(this);
        }
        data = Objects.merge(
           data,
           {

           attrs:
           {
           },
           class:
           {
               mousetrap:true
           },
            domProps: {
                value: this.search
            },
           on:on
       });
       if(isComponent)
       {
           data = Objects.merge(data, {
               props:
               {
                   value:this.search
               }
           })
       }else
       {
                   data = Objects.merge(data, {
                       domProps:
                       {
                           value:this.search
                       }
                   })

       }
       if(!data.attrs.type)
       {
           data.attrs.type = "search";
       }
       return h(tag,data,children);
  }
    data()
    {
        return {
            search:null
        };
    }
    mounted()
    {
    }
    onChange()
    {
        this._searchObject.value = this.search;
        if(!this._realtime)
        {
            this.emit('input', this._asObject?this._searchObject:this.search);
        }
        this.emit('change', this._asObject?this._searchObject:this.search);
    }
    onKeyUp()
    {
        if(!this._realtime)
        {
            return;
        }
        this._searchObject.value = this.search;
        this.emit('input', this._asObject?this._searchObject:this.search);
    }
}
class SearchObject
{
    prop = null;
    value = null;
    getItemValue(item)
    {
        if(this.prop)
        {
            return item[this.prop];
        }
        return item;
    }
    transform(item)
    {
        return SearchHelper.transform(this.getItemValue(item), this.value);
    }
    match(item)
    {
        return SearchHelper.match(this.getItemValue(item), this.value);
    }
    test(item)
    {
        return SearchHelper.test(this.getItemValue(item), this.value);
    }
}
/**
 *    this.search = {
            transform(item)
            {
                return SearchHelper.transform(item.name, value);
            },
            match(item)
            {
                return SearchHelper.match(item.name, value);
            },
            test(item)
            {
                return SearchHelper.test(item.name, value);
            },
        }
 */


</script>
