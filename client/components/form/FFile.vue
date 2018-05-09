<template>
    <p>
        <template v-if="electron">
            <input type="button" @click="loadFile" :value="dialogMessage" ref="file">
            <input type="text" :value="file && file.path" disabled>
        </template>
        <template v-else>
            <label v-if="dialogMessage">{{dialogMessage}}</label>
            <input type="file" @change="onFile" ref="file" :placeholder="file && file.path">
            <span v-if="showPrevious && value">{{typeof value == "string"?value:value.path}}</span>
        </template>
   </p> 
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Provide,Event} from "../../mvc/VueComponent";
import Vue from 'vue';
import {Hardware} from "../../../common/env/Hardware";
import FElement from "./FElement";
import electron from "../../../common/electron/Electron";
const {remote} = electron;

@Component({
    $_veeValidate: {
        //not used when using v-model
        value () {
            return this.file;
        }
    },
    props:
    {
        value:{},
        content:{type:Boolean, default:true},
        method:{type:String, default:"Text"},
        dialogMessage:{default:'choose file',type:String},
        dialogProperties:{default:()=>['openFile', 'showHiddenFiles']}
    }
})
export default class FFile extends FElement
{
    data()
    {
        return {electron:Hardware.isElectron(), file:null,showPrevious:null };
    }
    loadFile()
    {
        let result = electron.remote.dialog.showOpenDialog({properties:this.dialogProperties,message:this.dialogMessage});
        if(result)
        {
            this.file =  {path:result[0]}
            if(this.content)
            {
                const fs = remote.require("fs");
                let options = {};
                if(this.method.toLowerCase() == "text")
                {
                    options.encoding = "utf-8";
                }
                this.file.content = fs.readFileSync(this.file.path, options);
            }
            this.showPrevious = false;
            this.$emit('input', this.file)
        }else
        {
            this.file = null;
            this.$emit('input', null);
        }
    }
    onFile()
    {
        let file = this.$refs.file.files[0];

        if(!file)
        {
            this.file = null;
            this.$emit('input', null);
            return;
        }
        var reader = new FileReader();
        reader.onload = ()=>
        {
            this.file = {path:file.name}
            if(this.content)
            {
                this.file.content = reader.result
            }
            this.showPrevious = false;
            this.$emit('input', this.file)
        }
        reader["readAs"+this.method](file);
    }
    mounted()
    {
        if(this.value)
        {
            this.file = typeof this.value == "string"?{path:this.value}:Object.assign({},this.value);
        }
        this.showPrevious = true;
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
