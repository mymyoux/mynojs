<template>
 <div class="item">
    <input v-if="edition && !item" type="file" @change="onChange" @input="onInput">
    <template v-else>
        <div v-if="!item">-</div>
        <img v-else-if="item && typeof item == 'string'" :src="item">
        <img v-else-if="item && path" :src="path">
        <div v-if="item && edition" @click="onRemove">
              x
        </div>
    </template>
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
      this.computePicture();
    }
  }
})
export default class Picture extends VueComponent
{
  created()
  {
    this.computePicture();
  }
  computePicture()
  {
     let value = this.value;
    if(!value)
    {
      this.item = value;
      return;
    }
    if(this.value && this.value.substring(0, 7) == 'public/')
    {
      value = '/storage/'+this.value.substring(7);
    }
    if(value.substring(0, 4) != 'http')
    {
      if(value.substring(0, 1) != '/')
      {
          value = '/'+value;
      }
      value = api().getBaseURL()+value;
    }
    this.item = value;
  }
    data()
    {
      return {
        item:null,
        path:null
      }
    }  
    onInput()
    {
      Vue.nextTick(()=>
      {
        this.emit('input', this.item);
      })
    }
    onChange(event)
    {
      this.path = null;
      this.item = event.currentTarget.files[0];
      let item = this.item;
      if(this.item)
      {
        let reader = new FileReader();
        reader.readAsDataURL(this.item);
        reader.onload = (event)=>
        {
          //image changed
          if(item !== this.item)
          {
            return;
          }
          this.path = event.target.result;
        }
      }

    }
    onRemove()
    {
      this.path = null;
      this.item = null;
      this.emit('input', null);
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  img{
    max-width:200px;
    max-height:200px;
  }
</style>
