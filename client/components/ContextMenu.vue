<template>
    <div class="contextmenu" v-if="value"  :style="{left:x+'px',top:y+'px'}" v-click-outside="onOutside">
        <tree  :value="value" :item-component="itemComponent" :folder-component="folderComponent" @item-select="onItemSelect">
           <template slot="item" slot-scope="{item}">
                    <div v-if="item.type == 'separator'">
                        ------
                    </div>
                    <div v-else :class="{enabled:item.enabled!==false}">
                        {{  item.label}}
                    </div>
           </template>
            
        </tree>
    </div>
</template>
 
<script>


import {VueComponent, Event, Component} from "../mvc/VueComponent";
@Component({
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
        console.log(event)
        this.x = event.x;
        this.y = event.y;
        this.value = template.toTree();
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
    onItemSelect(model)
    {
        if(model.click && !model.disabled)
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
    width:100px;
    height:100px;
    background:red;
    div.enabled
    {
        &:hover
        {
            background-color:green;
            cursor:pointer;
        }
    }
}
</style>