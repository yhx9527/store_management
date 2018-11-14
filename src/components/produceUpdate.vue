<template>
    <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="form">
            <el-form-item label="产品名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="下单量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="下单备注" >
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="木工量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="木工备注">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="油房量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="油房备注">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="包装量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="包装备注">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="北京产值量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="北京备注">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="特定量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="特定备注">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="北京特定量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="北京特定备注">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="本地合同量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="本地合同">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="外地合同量" :label-width="formLabelWidth" style="text-align: left;">
                <el-input-number v-model="num8" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="外地合同备注">
                <el-input type="textarea" v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '120px',
                put: this.dataPut
            };
        },
        props:['dataPut'],
        computed:{
            visible: {
                get:function () {
                    return this.dataPut.visible
                },
                set:function (v) {
                    this.dataPut.visible = v
                }
            },
            title(){
                return this.dataPut.type==="update" ? "更新产值" : "错误修正"
            }
        },
        methods:{
            submit(){
                this.$emit('update')
            }
        }
    }
</script>