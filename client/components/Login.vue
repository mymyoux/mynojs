<template>
  <div class="login">
    <h1>Login</h1>
    <h2 v-if="message">
        {{message}}
    </h2>
           <form>
                <input type="email">
                <input type="password">
                <input type="submit" value="login">
           </form>
           <a href="https://local.yborder.com/login/twitter">Twitter</a>
  </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';


@Component
export default class Login extends VueComponent
{
    data()
    {
        return {
            message:this.$route.params.message
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
