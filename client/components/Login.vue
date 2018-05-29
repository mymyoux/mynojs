<template>
  <div class="login">
    <h1>Login</h1>
    <h2 v-if="message">
        {{message}}
    </h2>
           <form method="POST" :action="base_href+'/login'">
                <f-input type="email" name="email" />
                <f-input type="password" name="password" />

                <div class="form-group">
                    <div class="col-md-6 col-md-offset-4">
                        <div class="checkbox">
                            <label>
                                <f-input type="checkbox" name="remember" label="Remember Me : " />
                            </label>
                        </div>
                    </div>
                </div>

                <f-input type="submit" value="login" />
           </form>
            <connectors :base-href="base_href"></connectors>
  </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import Connectors from 'myno/client/components/Connectors.vue'
import { config } from "../../common/env/Configuration";

@Component({
  components: {
    Connectors
  }
})
export default class Login extends VueComponent
{
    data()
    {
        return {
            message:this.$route.params.message,
            base_href:config('php.url')
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
