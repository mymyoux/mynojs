<template>
    <div>
        <ul>
            <li v-for="(val,i) in value" :key="i" ref="items"
            :class="{enabled:val.enabled!== false, separator:val.type=='separator', parent:val.submenu}"
            @click="onItemClick(val,i)"
            @mouseover="onItemOver(val,i)"
            @mouseout="onItemOut(val,i)"
            >{{val.label}}</li>
        </ul>
        <context-list v-if="selected" v-model="selected.submenu" :style="{transform: `translate3d(0, ${top}px,0)`}" @close="onItemClick"></context-list>
    </div>
</template>
 
 
<script>
 export default {
     data() {
         return {
             selected:null,
             top:0
         }
     },
     props: {
         value: {
             required:true
         }
     },
     methods:{
         onItemOver(model, index) {
            // if(!model.submenu) {
            //     return
            // }
            this.clearTimeout()
            this.timeoutOver = setTimeout(this.onItemOverAction.bind(this, model, index), 200)
         },
         onItemOut(model, index) {
            // if(!model.submenu) {
            //     return
            // }
            this.clearTimeout()

         },
         clearTimeout() {
             if(this.timeoutOver != null) {
                 clearTimeout(this.timeoutOver)
                 this.timeoutOver = null
             }
         },
         openSubmenu(model, index) {
            this.selected = model
            // this.top = index
            let item = this.$refs.items[index]
            let itemy = item.getBoundingClientRect()
            let parent = item.parentNode.getBoundingClientRect()
            this.top = itemy.y - parent.y
         },
         onItemOverAction(model, index) {
             if(model.submenu) {
                 this.openSubmenu(model, index)
             }else
             {
                 this.selected = false
             }
         },
        onItemClick(model, index) {
            if(model.submenu) {
                this.openSubmenu(model, index)
                return;
            }
            if(model.click && model.enabled !== false)
            {
                this.$emit('close', model)
            }
        }
     }

 } 
</script>


<style scoped lang="scss">
div{
    display: flex;
 
    ul {
        display: flex;
        flex-direction: column;
        li {
            display: flex;
            justify-content: space-between;
            padding: 8px 15px;
            align-items: center;
            color: #c0c0c0;
            border-left: 1px solid #ebebeb;
            border-right: 1px solid #ebebeb;
            background-color: white;
            &.enabled
            {
                color: black;
                cursor: pointer;
                &:hover
                {
                    background-color: #ebebeb;
                }
            }
            &.parent {
                &:after {
                    content: " ";
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 3px 0 3px 6px;
                    border-color: transparent transparent transparent #778596;

                    // border: solid #778596;
                    // border-width: 0 3px 3px 0;
                    // display: inline-block;
                    // padding: 3px;    
                    //  transform: rotate(-45deg);
                }
            }
            &.separator {
                line-height:0;
                padding: 0 0;
                border-bottom: 1px solid #ebebeb;
            }
            &:first-child {
                border-top: 1px solid #ebebeb;
            }
            &:last-child {
                border-bottom: 1px solid #ebebeb;
            }
        }
    }
}
</style>