<template>
    <div class="contextmenu" v-if="value"  :style="{left:x+'px',top:y+'px'}" v-click-outside="onOutside">
       <context-list v-model="value" @close="onItemClick"></context-list>
        <!-- <ul>
            <li v-for="(val,i) in value" :key="i" 
            :class="{enabled:val.enabled!== false, separator:val.type=='separator'}"
            @click="onItemClick(val,i)"
            >{{val.label}}</li>
        </ul> -->
    </div>
</template>
 
<script>

import List from './context/List'

import {VueComponent, Event, Component} from "../mvc/VueComponent";
@Component({
    components:{
        'context-list' :List
    },
    props:
    {
    },
    name:"ContextMenu"
})
export default class ContextMenu extends VueComponent
{
    @Event('show-context-menu')
    show(template)
    {
        window['menu'] = this
        console.log(event)
        this.x = event.x;
        this.y = event.y;
        this.value = template.toTree();
        console.log(this.value)
    }
    onOutside()
    {
        console.log('outside');
        this.close();
    }
    close()
    {
        this.value = null;
    }
    data()
    {
        return {itemComponent:null, folderComponent:null,value:null,
        x:null,
        y:null}
    }
    mounted()
    {
    }
    onItemClick(model, index) {
        console.log(model, model.click, model.enabled)
        if(model.click && model.enabled !== false)
        {
            this.close();
            model.click();
        }
    }
}

</script>

<style scoped lang="scss">
div.contextmenu
{
    position:fixed;
    min-width:100px;
    // height:100px;
    display:inline-block;
}
</style>