<template>
    <div class="container">

        <div class="panel panel-default register">
            <h2>Signup</h2>
            <div class="panel-body">
                <form class="form-horizontal" method="POST"  :action="base_href+'/login/manual/callback'">

                    <connectors type="signup"></connectors>

                    <p class="or">or</p>

                     <form>
                        <v-text-field
                        v-validate="'required|email'"
                        v-model="email"
                        :error-messages="errors.collect('email')"
                        label="E-mail"
                        data-vv-name="email"
                        required
                        ></v-text-field>
                        <v-text-field
                        v-validate="'required'"
                        v-model="password"
                        :error-messages="errors.collect('password')"
                        label="Password"
                        type="password"
                        data-vv-name="password"
                        required
                        ></v-text-field>
                        <v-btn @click="login">log in</v-btn>
                    </form>
                </form>
            </div>
        </div>
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
            base_href:config('php.url')?config('php.url'):''
        };
    }
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    $light-grey: #e8e8e8;
    $medium-grey: #565656;
    $green: #66ce97;

    .register {
        width: 500px;
        margin: auto;
        padding: 20px;
        position: relative;

        h2 {
            font-family: "Open Sans",Helvetica,Arial,sans-serif;
            font-size: 1.3rem;
            margin-bottom: 30px;
            letter-spacing: .5px;
        }

        .row {
            margin: 0 0 20px 0;
        }

        input {
            height: 45px;
            border-radius: 0;
            border-color: $light_grey;
            &::-webkit-input-placeholder {
                color: grey;
                font-size: 0.9em;
            }
        }

        .or {
            /deep/ &:before {
                content: '';
                width: 50%;
                background: #e8e8e8;
                height: 1px;
                position: absolute;
                left: calc(50% + 20px);
                z-index: 99;
                margin-top: 12px;
            }
            /deep/ &:after {
                content: '';
                width: 50%;
                background: #e8e8e8;
                height: 1px;
                position: absolute;
                left: -20px;
                z-index: 99;
                margin-top: 12px;
            }
        }
        .btn {
            width: 200px;
            border-radius: 0;
            background: $green;
            border-color: transparent;
        }
    }

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

