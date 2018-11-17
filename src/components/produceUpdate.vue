<template>
    <el-dialog :title="title" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="form">
            <el-form-item label="产品名称" :label-width="formLabelWidth" disabled>
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="text-align: left" label="更改字段"  :label-width="formLabelWidth">
                <el-select v-model="form.variate" placeholder="请选择" @change="selectChange">
                    <el-option
                            v-for="item in variates"
                            :key="item.index"
                            :label="item.label"
                            :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px;margin-left: 5px;">{{ item.value }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" style="text-align: left">
                <el-switch
                        v-model="form.switch"
                        inactive-text="入库"
                        active-text="出货">
                </el-switch>
            </el-form-item>
            <el-form-item :label="numName" style="text-align: left"  :label-width="formLabelWidth">
                <el-input-number v-model="form.num" controls-position="right" @change="handleChange"></el-input-number>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.comment"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        data() {
            return {
                form: {
                    name: '',
                    variate: '',
                    num:'',
                    comment: '',
                    switch:false
                },
                formLabelWidth: '120px',
                put: this.dataPut,
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
                console.log(this.dataPut)
                return this.dataPut.type==="update" ? "更新产值" : "错误修正"
            },
            numName(){
                return this.dataPut.type==="update" ? "更新值" : "修改为"
            },
            variates(){
                let temp = this.dataPut.row
                return [
                    {label: '下单量', value: `当前数量:${temp.produceXiadan}`,index:0},
                    {label: '木工量', value: `当前数量:${temp.produceMugong}`,index:1},
                    {label: '油房量', value: `当前数量:${temp.produceYoufang}`,index:2},
                    {label: '包装量', value: `当前数量:${temp.produceBaozhuang}`,index:3},
                    {label: '北京', value: `当前数量:${temp.produceBeijing}`,index:4},
                    {label: '特定量', value: `当前数量:${temp.produceTeding}`,index:5},
                    {label: '本地合同量', value: `当前数量:${temp.produceBendihetong}`,index:6},
                    {label: '外地合同量', value: `当前数量:${temp.produceWaidihetong}`,index:7},
                ]
            }
        },
        methods:{
            submit(){
                this.$emit('update')
            },
            selectChange(e){
                console.log('下拉框 ',e)
            },
            handleChange(){

            }
        }
    }
</script>