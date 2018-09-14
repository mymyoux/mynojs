<template>
 <div class="item">
    <input v-if="edition" type="checkbox" v-model="item" @input="onInput">
    <div v-else>
      {{item}}
    </div>
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
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
export default class Boolean extends VueComponent
{
  created()
  {
    this.item = this.value;
  }
    data()
    {
      return {
        item:null
      }
    }  
    onInput()
    {
      Vue.nextTick(()=>
      {
        this.emit('input', this.item);
      })
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
