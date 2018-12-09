<template>
        <div :style="{
                    'background-color':color
                }" class="toast">

        <i class="material-icons icon" v-if="icon">
            {{icon}}
        </i>
        <i v-else>
        </i>
        <div class="text">
            <slot>
            </slot>
        </div>
        <i class="material-icons close" v-if="dismissible" @click="dismiss">
            cancel
        </i>
        <i v-else>
        </i>
        

 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
import { api } from "myno/client/io/API";
import { config } from "myno/common/env/Configuration";
var count = 0;
@Component({
  components: {
  },
  props:
  {
      icon:{

      },
      color:{

      },
      dismissible:
      {
          type:Boolean,
          default:false
      }
  }
})

export default class Login extends VueComponent
{
    created ()
    {
    }
    data()
    {
        return {
        };
    }
    dismiss()
    {
        this.$emit('dismissed');
    }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toast{
    border-radius: 0;
    box-shadow: 1px 1px 10px rgba(0,0,0,0.62);
    color: #fff;
    display: flex;
    font-size: 14px;
    margin: 4px auto;
    padding: 16px;
    position: relative;
    justify-content: space-between;

    background-color:rgb(127, 175, 234);
    &:hover{
        $scale: 1.005;
        transform:scaleX($scale)  scaleY($scale);
    }
}
.text{
    word-break: break-all;
    margin-left: 10px;
    margin-right: 10px;
}
.close{
    color: rgba(0, 0,0, 0.3);
    cursor:pointer;
    &:hover{
            color: rgba(0, 0,0, 0.5);
    }
}
</style>
