<template>
    <p>
        <template v-if="electron && !formData">
            <input type="button" @click="loadFile" :value="dialogMessage" ref="file">
            <input type="text" :value="file && file.path" disabled>
        </template>
        <template v-else>
            <label v-if="dialogMessage">{{dialogMessage}}</label>
            <input type="file" @change="onFile" ref="file" :placeholder="file && file.path">
            <span v-if="showPrevious && value">{{typeof value == "string"?value:value.path}}</span>
        </template>
        <span class="error" v-if="error">
            {{error}}
        </span> 
   </p> 
</template>

<script>
import {VueComponent, Component, Prop, Watch, Emit, Provide,Event} from "../../mvc/VueComponent";
import Vue from 'vue';
import {Hardware} from "../../../common/env/Hardware";
import FElement from "./FElement";
import electron from "../../../common/electron/Electron";
import { Objects } from "../../../common/utils/Objects";

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
        formData:{type:Boolean, default:false},
        method:{type:String, default:"Text"},
        dialogMessage:{default:'choose file',type:String},
        dialogProperties:{default:()=>['openFile', 'showHiddenFiles']}
    }
})
export default class FFile extends FElement
{
    data()
    {
        return {error:null,electron:Hardware.isElectron(), file:null,showPrevious:null };
    }
    loadFile()
    {
        this.error = null;
        
        let result = electron.remote.dialog.showOpenDialog({properties:this.dialogProperties,message:this.dialogMessage});
        if(result)
        {
                const path = remote.require("path");
            this.file =  {path:result[0], name:path.basename(result[0]), buffer:null, formData:null}
            if(this.content)
            {
                const fs = remote.require("fs");






                let options = {};
                if(this.method.toLowerCase() == "text")
                {
                    options.encoding = "utf-8";
                }
                try
                {
                    if(this.formData)
                    {

                        this.file.buffer = fs.readFileSync(this.file.path);
                        //this.file.buffer = fs.createReadStream(this.file.path);
                    }
                    else{
                        this.file.content = fs.readFileSync(this.file.path, options);
                    }
                }catch(error)
                {
                    this.showPrevious = false;
                    this.error = error.message;
                    return;
                }
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
        this.error = null;
        let file = this.$refs.file.files[0];

        if(!file)
        {
            this.file = null;
            this.$emit('input', null);
            return;
        }
        if(this.formData)
        {
            this.showPrevious = false;
            this.file = {formData:file,path:file.name, buffer:null, name:file.name}
            this.$emit('input', this.file)
            return;
        }
        var reader = new FileReader();
        reader.onload = ()=>
        {
            this.file = {path:file.name,formData:null, buffer:null, name:file.name}
            if(this.content)
            {
                this.file.content = reader.result
            }
            debugger;
            this.showPrevious = false;
            this.$emit('input', this.file)
        }
        reader.onerror = (error)=>
        {
            this.error = "file unreadable";
            this.showPrevious = false;
        }
        reader["readAs"+this.method](file);
    }
    mounted()
    {
        if(this.value)
        {
            this.file = typeof this.value == "string"?{path:this.value,formData:null, buffer:null, name:null}:Objects.assign({formData:null, buffer:null, name:null, path:null},this.value);
        }
        this.showPrevious = true;
        super.mounted();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
