<template>
    <el-dialog title="产值修正" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="form" :rules="rules" ref="outputForm">
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
            <el-form-item label="当前数量" :label-width="formLabelWidth" disabled style="text-align: left;" prop="curNum">
                <el-input v-model="form.curNum" autocomplete="off" disabled style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item label="修改为" style="text-align: left"  :label-width="formLabelWidth" prop="num">
                <el-input-number v-model.number="form.num" controls-position="right" @change="handleChange"></el-input-number>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submit('outputForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item.vue";
    import {outputModel} from "../utils/models"

    export default {
        components: {ElFormItem},
        data() {
            return {
                form: {
                    name: '',
                    variate: '',
                    num:'',
                    comment: '',
                    curNum:''
                },
                rules: {
                    variate: [
                        {required: true, message: '请选择更改的字段', trigger: 'change'}
                    ],
                    num: [
                        {type: 'number', required: true, message: '请输入数量', trigger: 'change'}
                    ]
                },
                formLabelWidth: '120px',
                ifSwitch: ""
            };
        },
        props:['dataPut'],
        watch: {
            dataPut: function(newVal, oldVal){
                this.form.name = newVal.row.outputProductName
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
                            this.$refs["outputForm"].resetFields()
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
                            this.$refs["outputForm"].resetFields()
                        }catch(e){

                        }
                    }
                    this.dataPut.visible = v
                }
            },
            variates(){
                let temp = this.dataPut.row
                return [
                    {label: '下单', value: `当前下单:${temp.outputXiadan}`},
                    {label: '木工', value: `当前木工:${temp.outputMugong}`},
                    {label: '油房', value: `当前油房:${temp.outputYoufang}`},
                    {label: '包装', value: `当前包装:${temp.outputBaozhuang}`},
                    {label: '特定', value: `当前特定:${temp.outputTeding}`},
                    {label: '工厂出货', value: `当前工厂出货:${temp.outputFactoryOutput}`},
                    {label: '特定工厂出货', value: `当前特定工厂出货:${temp.outputTedingFactoryOutput}`},
                    {label: '北京入库', value: `当前北京入库:${temp.outputBeijingInput}`},
                    {label: '北京剩余', value: `当前北京剩余:${temp.outputBeijingStock}`},
                    {label: '北京特定入库', value: `当前北京特定入库:${temp.outputBeijingtedingInput}`},
                    {label: '北京特定剩余', value: `当前北京特定入库剩余:${temp.outputBeijingtedingStock}`},
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
                this.form.curNum = this.dataPut.row[outputModel.get(e)]
            },
            handleChange(){

            }
        }
    }
</script>