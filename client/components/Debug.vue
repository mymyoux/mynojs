<template>
  <div class="debug">
            <li v-if="isElectron"> 
                electron {{electronVersion}}
                node {{nodeVersion}}
            </li>
            <li> 
                {{browser}}
            </li>
            <li> 
                {{os}} {{osVersion}}
            </li>
            <li v-if="user"> 
                {{user.name}}
            </li>
  </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../mvc/VueComponent";
import Vue from 'vue';
import {Hardware} from "../../common/env/Hardware";
import {Auth} from "../mvc/Auth";
@Component
export default class Debug extends VueComponent
{
    data()
    {
        return {...Hardware.toObject(), user:Auth.user()};
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
