<template>
 <div class="item">
    {{value?value:'&nbsp;'}}
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
export default class Integer extends VueComponent
{
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
