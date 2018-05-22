<template>
    <div class="component-tags">
        <section class="configure" v-if="configure">
            <autocomplete v-on:autocompleteLoad="onAutocompleteLoad" v-on:autocompleteSelected="onAutocompleteSelected" :search_prop="search_prop" :list_autocomplete="list_autocomplete">
            </autocomplete>

            <input v-if="add" type="text" v-model="name" class="add" placeholder="Add a new tag..." @keydown.enter="addByName()" />
        </section>

        <section class="list">
            <slot name="item" v-for="tag in list" :item="tag" slot-scope="_">
                <span class="item">
                    {{ tag[search_prop] }}
                    <span class="delete" @click="deleteTag(tag)" v-if="configure">X</span>
                </span>
            </slot>
        </section>
   </div> 
</template>

<script>
import {VueComponent, Component} from "../mvc/VueComponent";
import Vue from 'vue';
import { SearchHelper } from "myno/client/helpers/SearchHelper";
import Autocomplete from 'myno/client/components/Autocomplete.vue'

@Component({
    components: {
        Autocomplete
    },
    props:
    {
        configure:{type:Boolean, default:true},
        add:{type:Boolean, default:false},
        min:{type:Number},
        max:{type:Number},
        value:{},
        search_prop:{
            required: false,
            type: String,
            default: 'name'
        },
        delete: {
            required: false,
            type: Boolean,
            default: true
        },
        list_autocomplete:{

        }
    },
     watch: {
        list_autocomplete()
        {
        },
        value (newVal, oldVal) {
            this.list = newVal;
        },
        list (newVal, oldVal) {
            this.$emit('input', newVal);
        },
    }
})
export default class Tags extends VueComponent
{
    // to ovveride
    onAutocompleteLoad(search)
    {
        this.$emit('autocompleteLoad', search);
    }

    onAutocompleteLoadMore(search)
    {
        this.$emit('autocompleteLoadMore', search);
    }

    data()
    {
        return {
            val:null,
            localLabel:null,
            list:[],
            name: null,
        };
    }

    deleteTag( tag )
    {
        for (var i in this.list)
        {
            if (this.list[i][this.search_prop] === tag[this.search_prop])
            {
                this.list.splice(i, 1);
            }
        }
    }
    onAutocompleteSelected(item)
    {
        if (item.selected)
        {
            this.addTag(item);
        }
        else
        {
            this.deleteTag(item);
        }
    }

    addByName()
    {
        var tag = {
            id : null
        };

        tag[this.search_prop] = this.name;
        this.addTag(tag);

        this.name = null;
    }

    addTag(item)
    {
        if (this.max && this.list.length >= this.max)
            return false;

        var exist = this.list.filter((tag) => {
            return tag[this.search_prop] === item[this.search_prop];
        });

        if (!exist.length)
            this.list.push(item);
        
        return true;
    }

  
    mounted()
    {
        if(this.value)
        {
            this.list = this.value;
        }
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .configure
    {
        display: flex;
        flex-direction: column;
    }
    .list
    {
        .item
        {
            margin: 0 5px;
            background: #6db6ff;
            padding: 5px 8px;
            border-radius: 5px;
        }
    }
</style>
