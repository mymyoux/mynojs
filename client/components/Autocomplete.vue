<template>
    <div class="component-autocomplete" v-click-outside="onHide">
        <search v-model="search" :search-prop="search_prop" :realtime="true" placeholder="Search" @change="onSearch" @click="onVisible(true)">
        </search>

        <div @click="onSearch(search)" class="search-btn">
            <slot name="input-search">
                Search
            </slot>
        </div>

        <list ref="list" :items="data_list" class="list" @load-more="loadMore" scroll-bottom="1vp" :search="search" v-if="visible">
            <li slot="item" class="item" slot-scope="_" @click="onSelected(_.item)">
                {{ _.item[search_prop] }}
            </li>
        </list>
   </div> 
</template>

<script>
import {VueComponent, Component} from "../mvc/VueComponent";
import Vue from 'vue';
import { SearchHelper } from "myno/client/helpers/SearchHelper";
import { Buffer } from 'myno/common/buffer/Buffer';


@Component({
    props:
    {
        list_autocomplete: {
            required: true
        },
        search_prop:{
            required: true,
            type: String
        }
    },
     watch: {
        list_autocomplete (newVal, oldVal) {
            this.onVisible(true);
            this.data_list = newVal;
        },
        search : {

            deep: true,
            handler: Buffer.debounce(function(search) {
                    this.$emit('autocompleteLoad', search);
                }, 300)
        }
    }
})
export default class Autocomplete extends VueComponent
{
    created()
    {
      this.search = {
        value:"",
          transform(item, property)
          {
            if(!item[property])
              return item[property]
              return SearchHelper.transform(item[property], this.value);
          },
          match(item)
          {
              return SearchHelper.match(item.firstname, this.value);
          },
          test(item)
          {
            return true;
          }
      }
    }

    onHide()
    {
        this.onVisible(false);
    }

    onVisible(visible)
    {
        this.visible = visible;
    }

    onSelected(item)
    {
        this.onVisible(false);
        this.$emit('autocompleteSelected', item);
    }

    onSearch(search)
    {
        this.$emit('autocompleteLoad', search);
    }

    loadMore()
    {
        this.$emit('autocompleteLoadMore');
    }

    data()
    {
        return {
            search:null,
            loading:false,
            data_list : [],
            visible: false
        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .component-autocomplete
    {
        position: relative;
        display: flex;
        justify-content: space-between;

        .list
        {
            position: absolute;
            overflow-y: auto;
            width: 100%;
            top: 30px;
            left: 0;
            background: #e4e4e4;
            z-index: 4;
            list-style: none;
            padding: 0;
            margin: 0;
            height: auto;
            max-height: 200px;

            .item
            {
                margin: 5px 10px;
            }
        }

        .search-btn
        {
            color: red;
            // margin-left
        }
    }
</style>
