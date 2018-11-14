<style scoped>

</style>
<template>
    <div>
        <el-row type="flex" style="margin-bottom: 30px;">
            <el-col :span="6" style="text-align: left;">
                <el-tag
                        type="success">
                    产品总数:{{content.length}}件
                </el-tag>
            </el-col>
            <el-col :span="10" style="text-align: right;">
                <el-autocomplete
                        v-model="state"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入要搜索的产品名称"
                        clearable
                        prefix-icon="el-icon-search"
                        @select="selectName"
                        select-when-unmatched
                ></el-autocomplete>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16">
                <el-table :data="contenting"
                          tooltip-effect="dark"
                          style="width: 100%"
                          ref="productTable">
                    <el-table-column
                            type="index"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="productName"
                            label="产品名称"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="productPrice"
                            label="产品价格"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="productComment"
                            label="备注">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="添加进度"
                            width="120">
                        <template slot-scope="scope">
                            <el-button
                                    @click="handleEdit(scope.$index, scope.row)"
                                    type="text"
                                    size="small">
                                添加
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="7" :offset="1">
                <el-card class="box-card" style="position: fixed;width: 20vw;" v-show="ifadd">
                    <div slot="header" class="clearfix">
                        <span>进度表单</span>
                        <!--el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button-->
                    </div>
                    <el-form label-position="left" label-width="80px" :model="produceAddForm"
                             :rules="rules" ref="produceAddForm" hide-required-asterisk>
                        <el-form-item label="产品名称">
                            <el-input v-model="produceAddForm.produceProductName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="下单量" prop="produceXiadan" style="text-align: left">
                            <!--el-input v-model.number="produceAddForm.produceXiadan" clearable></el-input-->
                            <el-input-number v-model.number="produceAddForm.produceXiadan" controls-position="right"  :min="1" ></el-input-number>
                        </el-form-item>
                        <el-form-item label="备注" prop="produceXiadanComment">
                            <el-input v-model="produceAddForm.produceXiadanComment" clearable type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item style="text-align: right;">
                            <el-button @click="ifadd=false">取消</el-button>
                            <el-button type="primary"@click="submitForm('produceAddForm')">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {dateParse} from '../utils/util'
    import {Message} from 'element-ui'
    import ElRow from "element-ui/packages/row/src/row";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {
            ElCol,
            ElButton,
            ElRow},
        data: function () {
            var checkXiadan = (rule, value, callback) =>{
                if(value<=0){
                    callback(new Error('下单量应大于0'))
                }
                callback()
            }
            return {
                content: [],
                contenting: [],
                state: '',
                pageName: '',
                produceAddForm: {
                    produceProductId: '',
                    produceProductName: '',
                    produceXiadan: '',
                    produceXiadanComment: ''
                },
                ifadd: false,
                rules: {
                    produceXiadan: [
                        { required: true, message: '请输入下单量', trigger: 'blur' },
                        { type: 'number', message: '下单量必须为数字'},
                        { validator: checkXiadan, trigger: 'blur' }
                    ]
                }
            }
        },
        async created() {
            this.getList()
        },
        methods: {
            async getList(name=this.pageName){
                let data = await this.$apis.product_get_add(name)
                if (data) {
                    this.content = data
                    this.contenting = data
                }
                return data
            },
            async querySearchAsync(queryString,cb) {
                this.contenting = this.content.filter((item)=>{
                    return item.productName.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                })
                let temp = this.contenting.map(item=>{
                    return {value: item.productName}
                })
                cb(temp)
            },
            selectName(data){
                this.contenting = this.contenting.filter((item)=>{
                    return item.productName.toLowerCase().indexOf(data.value.toLowerCase()) > -1
                })
            },
            handleEdit(index, row){
                console.log('row', row)
                this.resetForm('produceAddForm')
                this.ifadd=true
                this.produceAddForm.produceProductName = row.productName
                this.produceAddForm.produceProductId = row.productId
            },
            submitForm(formName){
                let that = this
                this.$refs[formName].validate(async (valid) => {
                    console.log(valid)
                    if (valid) {
                        let data = await that.$apis.produce_add(that.produceAddForm)
                        if(data){
                            that.resetForm(formName)
                            that.ifadd=false
                        }
                    } else {
                        console.log('productForm submit error!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        watch: {
            ifadd(newVal, oldVal){
                console.log(newVal)
                if(newVal===false){
                    this.resetForm('produceAddForm')
                }
            }
        },
        computed: {
        }
    }
</script>