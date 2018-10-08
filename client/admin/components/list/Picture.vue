<template>
 <div class="item">
    <div v-if="!item">&nbsp;</div>
    <img v-else-if="item && typeof item == 'string'" :src="item">
    <img v-else-if="item && path" :src="path">
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
@Component({
  components: {
  },
  props:
  {
      value:{required:true}
  },
   watch:
  {
    value()
    {
        this.item = this.value;
    }
  }
})
export default class Picture extends VueComponent
{
   created()
  {
    this.item = this.value;
  }
    data()
    {
      return {
        item:null,
        path:null
      }
    }  
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

 img{
    max-width:20px;
    max-height:20px;
  }
</style>
