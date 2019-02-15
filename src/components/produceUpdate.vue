<template>
    <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="form" :rules="rules" ref="produceForm">
            <el-form-item label="产品名称" :label-width="formLabelWidth" disabled prop="name">
                <el-input v-model="form.name" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item style="text-align: left" label="更改字段"  :label-width="formLabelWidth" prop="variate">
                <el-select v-model="form.variate" placeholder="请选择" @change="selectChange" >
                    <el-option
                            v-for="item in variates"
                            :key="item.label"
                            :label="item.label"
                            :value="item.label">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px;margin-left: 5px;">{{ item.value }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" style="text-align: left" prop="switch" v-if="ifSwitch">
                <el-switch
                        v-model="form.switch"
                        inactive-text="入库"
                        active-text="出货"
                        >
                </el-switch>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" style="text-align: left" prop="switch1" v-if="ifSwitch1">
                <el-switch
                        v-model="form.switch1"
                        inactive-text="入库北京"
                        active-text="工厂出货"
                        >
                </el-switch>
            </el-form-item>
            <el-form-item label="当前数量" :label-width="formLabelWidth" disabled style="text-align: left;" prop="curNum">
                <el-input v-model="form.curNum" autocomplete="off" disabled style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item :label="numName" style="text-align: left"  :label-width="formLabelWidth" prop="num">
                <el-input-number v-model.number="form.num" controls-position="right" @change="handleChange"></el-input-number>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth" prop="comment">
                <el-input type="textarea" v-model="form.comment"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submit('produceForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item.vue";
    import {produceModel} from "../utils/models"

    export default {
        components: {ElFormItem},
        data() {
            return {
                form: {
                    name: '',
                    variate: '',
                    num:'',
                    comment: '',
                    switch:false,
                    switch1: false,
                    curNum:''
                },
                rules: {
                    variate: [
                        {required: true, message: '请选择更改的字段', trigger: 'change'},
                    ],
                    comment: [
                        {required: true, message: '请填写备注', trigger: 'change'},
                    ],
                    num: [
                        {type: 'number', required: true, message: '请输入数量', trigger: 'change'}
                    ]
                },
                formLabelWidth: '120px',
                ifSwitch: "",
                ifSwitch1: ""
            };
        },
        props:['dataPut'],
        watch: {
          dataPut: function(newVal, oldVal){
              this.form.name = newVal.row.produceProductName
          }
        },
        computed:{
            visible: {
                get:function () {
                    if(!this.dataPut.visible){
                        /*this.form ={
                                name: '',
                                variate: '',
                                num:'',
                                comment: '',
                                switch:false,
                                curNum:''
                            }*/
                        try{
                            this.$refs["produceForm"].resetFields()
                            this.ifSwitch = ""
                            this.ifSwitch1 = ""
                        }catch(e){

                        }

                    }
                    return this.dataPut.visible
                },
                set:function (v) {
                    if(!v){
                        /*this.form ={
                            name: '',
                            variate: '',
                            num:'',
                            comment: '',
                            switch:false,
                            curNum:''
                        }*/
                        try{
                            this.$refs["produceForm"].resetFields()
                            this.ifSwitch = ""
                            this.ifSwitch1 = ""
                        }catch(e){

                        }
                    }
                    this.dataPut.visible = v
                }
            },
            title(){
                console.log(this.dataPut)
                return this.dataPut.type==="update" ? "更新产值" : "错误修正"
            },
            numName(){
                return this.dataPut.type==="update" ? "更新值" : "修改为"
            },
            variates(){
                let temp = this.dataPut.row
                return [
                    {label: '下单量', value: `当前下单:${temp.produceXiadan}`},
                    {label: '木工量', value: `当前木工:${temp.produceMugong}`},
                    {label: '油房量', value: `当前油房:${temp.produceYoufang}`},
                    {label: '包装量', value: `当前包装:${temp.produceBaozhuang}`},
                    {label: '北京', value: `当前北京:${temp.produceBeijing}`},
                    {label: '特定量', value: `当前特定:${temp.produceTeding}`},
                    {label: '北京特定', value: `当前北京特定:${temp.produceBeijingteding}`},
                    {label: '本地合同量', value: `当前本地合同:${temp.produceBendihetong}`},
                    {label: '外地合同量', value: `当前外地合同:${temp.produceWaidihetong}`},
                    {label: '等待', value: `当前等待:${temp.produceDeng}`},
                ]
            }
        },
        methods:{
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$emit('update', this.form, this.dataPut)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            selectChange(e){
               // console.log(produceModel)
                //this.form.comment = this.dataPut.row[produceModel.get(e)+ 'Comment']
                this.form.curNum = this.dataPut.row[produceModel.get(e)]
                if((e==="北京" || e==="北京特定") && this.dataPut.type==="update"){
                    this.ifSwitch1 = ""
                    this.ifSwitch = true
                } else if((e==="包装量" || e==="特定量") && this.dataPut.type==="update"){
                    this.ifSwitch = ""
                    this.ifSwitch1 = true
                } else {
                    this.ifSwitch = ""
                    this.ifSwitch1 = ""
                }
            },
            handleChange(){

            }
        }
    }
</script>