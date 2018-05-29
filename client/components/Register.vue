<template>
    <div class="container">
<<<<<<< HEAD
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Register</div>
                    <div class="panel-body">
                        <form class="form-horizontal" method="POST" :action="base_href+'/register'">
                        
                            <f-input name="email" type="text" label="Email"></f-input>
                            <f-input name="first_name" type="text" label="First Name"></f-input>
                            <f-input name="last_name" type="text" label="Last Name"></f-input>
                            <f-input name="password" type="password" label="Password"></f-input>
                            <f-input name="password_confirmation" type="password" label="Confirmation"></f-input>

                            <div class="form-group">
                                <div class="col-md-6 col-md-offset-4">
                                    <button type="submit" class="btn btn-primary">
                                        Register
                                    </button>
                                </div>
                            </div>
                        </form>
=======
<<<<<<< HEAD
        <div class="panel panel-default register">
            <h2>S'enregistrer</h2>
            <div class="panel-body">
                <form class="form-horizontal" method="POST" action="https://local.yborder.com/register">

                    <connectors></connectors>

                    <p class="or">ou</p>

                    <b-form-group>
                        <b-form-input id="email" name="email" required v-validate="'email|email-unique'" placeholder="Email">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group>
                        <b-form-input id="last_name" name="last_name" required v-validate="'required'" placeholder="Nom">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group>
                        <b-form-input id="first_name" name="first_name" required v-validate="'required'" placeholder="Prénom">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group>
                        <b-form-input id="password" name="password" required v-validate="'required'" type="password" placeholder="Mot de passe">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group>
                        <b-form-input id="password_confirmation" name="password_confirmation" required type="password" v-validate="'required'" placeholder="Confirmation Mot de passe">
                        </b-form-input>
                    </b-form-group>


                    <div class="form-group">
                        <button type="submit" class="btn btn-primary">
                            S'enregistrer
                        </button>
>>>>>>> ad27ef29c8c583f24d21659263704c24e24eb3b0
                    </div>

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
            base_href:config('php.url')
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

