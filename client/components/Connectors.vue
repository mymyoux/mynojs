<template>
  <ul>
    <li v-for="connector in connectors">
        <a :href="'/login/' + connector.name">{{ connector.name }}</a>
    </li>
  </ul>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit} from "../../client/mvc/VueComponent";
import Vue from 'vue';
import { api } from "myno/client/io/API";
@Component
export default class Connectors extends VueComponent
{
    data()
    {
        api().path('connector/all').then( (data) => {
            this.connectors = data;
        });

        return {
          connectors: []
        };
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
