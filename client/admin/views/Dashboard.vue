<template>
 <div class="dashboard">
   dashboard
 </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "myno/client/mvc/VueComponent";
import Vue from 'vue';
import { config } from "myno/common/env/Configuration";
import { api } from "myno/client/io/API";
@Component({
  components: {
  }
})
export default class Dashboard extends VueComponent
{
    created()
    {
    }
    data()
    {
        return {

        };
    }
   
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
