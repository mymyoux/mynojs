<template>
  <div class="login">
    <h2>Connectez-vous</h2>
    <h2 v-if="message">
        {{message}}
    </h2>

            <form method="POST" :action="base_href+'/login'" @submit.prevent.stop="onSubmit">

               <connectors type="login"></connectors>

               <b-form-group>
                   <b-form-input id="email"
                                 name="email"
                                 v-validate="'required'"
                                 placeholder="Email" 
                                 v-model="email">
                   </b-form-input>
               </b-form-group>

               <b-form-group>
                   <b-form-input id="password"
                                 name="password"
                                 type="password"
                                 v-validate="'required'"
                                 placeholder="Mot de passe"
                                 v-model="password">
                   </b-form-input>
               </b-form-group>

               <div class="space">
                   <b-form-checkbox id="remember"
                                    value="1"
                                    unchecked-value="0">
                       Se souvenir de moi
                   </b-form-checkbox>
                   <b-button type="submit" value="login" class="submit" >Se connecter</b-button>
               </div>

               <p>Vous n'avez pas de compte ? <router-link to="/register">Inscription</router-link ></p>
           </form>
  </div>
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Event} from "../mvc/VueComponent";
import Vue from 'vue';
import Connectors from 'myno/client/components/Connectors.vue'
import { config } from "../../common/env/Configuration";
import { api } from "myno/client/io/API";
@Component({
  components: {
    Connectors,
  }
})
export default class Login extends VueComponent
{
    data()
    {
        return {
            email:null,
            password:null,
            message:this.$route.params.message,
            base_href:api().getBaseURL()
        };
    }
    onSubmit()
    {
        api().path('auth/login/manual').params({
            email:this.email,
            password:this.password
        }).then((result)=>
        {
            
        },(error)=>
        {
            debugger;
        });
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    $break-mobile: 400px;
    $break-tablet: 768px;
    $light-grey: #e8e8e8;
    $medium-grey: #565656;
    $green: #66ce97;
    .login
    {
        width: 500px;
        margin: auto;
        padding: 20px;

        @media (max-width: $break-tablet) {
            width: 100%;
        }

        h2 {
            font-family: "Open Sans",Helvetica,Arial,sans-serif;
            font-size: 1.3rem;
            margin-bottom: 30px;
            letter-spacing: .5px;
        }

        .section
        {
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

        button {
            padding: 12px 20px;
            font-size: 13px;
            border-radius: 2px;
            border-color: $green;
            background-color:$green;
            text-align: center;
            cursor: pointer;
            text-transform: uppercase;
            line-height: 20px;
            font-weight: 500;
        }

        .space
        {
            display: flex;
            justify-content: space-between;
            /deep/ .custom-checkbox
            {
                /deep/ label {
                    display: flex;
                    align-items: center;
                    font-size: 0.8em;
                    &:before {
                        background: white;
                        border: 1px solid #d2d2d2;
                        border-radius: 0;
                        margin-top: 10px;
                    }
                }
            }
        }

        p {
            margin-top: 20px;
            font-family: "Open Sans",Helvetica,Arial,sans-serif;
            font-size: 13px;
            color: $medium-grey;
            letter-spacing: 0.8px;
            a {
                transition: all 0.25s ease;
                color: $green;
                cursor: pointer;
            }
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
