<template>
 <div class="item">
    {{value}}
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
  }
})
export default class String extends VueComponent
{
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
