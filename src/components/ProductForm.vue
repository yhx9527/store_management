<style>

</style>
<template>
    <div>
        <el-row type="flex" justify="center">
            <!-- <el-col :span="6" style="text-align: left">
                <el-card class="box-card" v-if="!ifadd">
                    <div slot="header" class="clearfix">
                        <span>产品图片</span>
                    </div>
                </el-card>
            </el-col> -->
            <el-col :span="10" :offset="1">
                <el-card style=" " shadow="hover">
                    <h2 slot="header">{{ifadd ? '产品添加' : '产品编辑'}}</h2>
                    <el-form :model="productForm" status-icon :rules="rules" ref="productForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="产品名称">
                            <el-input v-model="productForm.productName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="产品价格" prop="productPrice">
                            <el-input v-model.number="productForm.productPrice"></el-input>
                        </el-form-item>
                        <el-form-item label="产品尺寸" prop="productSize">
                            <el-input v-model="productForm.productSize"></el-input>
                        </el-form-item>
                        <el-form-item label="产别类别" prop="categoryId" style="text-align: left">
                            <el-select v-model="productForm.categoryId" clearable placeholder="请选择产品类别">
                                <el-option
                                        v-for="item in options"
                                        :key="item.categoryId"
                                        :label="item.categoryName"
                                        :value="item.categoryId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注" prop="productComment">
                            <el-input type="textarea" v-model="productForm.productComment"></el-input>
                        </el-form-item>
                        <el-form-item style="text-align: left;">
                            <el-button :type="ifadd ? 'primary' : 'warning'" @click="submitForm('productForm')">{{ifadd ? '立即添加' : '确认修改'}}</el-button>
                            <el-button @click="resetForm('productForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
            <!-- <el-col :span="6" :offset="1" style="text-align: left">
                <el-card class="box-card" v-if="!ifadd">
                    <div slot="header" class="clearfix">
                        <span>添加图片</span>
                        <el-button style="float: right; padding: 3px 0" type="text">点击上传</el-button>
                    </div>
                </el-card>
            </el-col> -->
        </el-row>

    </div>
</template>
<script>
    import ElCard from "../../node_modules/element-ui/packages/card/src/main.vue";
    import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item.vue";
    import ElRow from "element-ui/packages/row/src/row";

    export default {
        components: {
            ElRow,
            ElFormItem,
            ElCard},
        data() {
            var checkPrice = (rule, value, callback) =>{
                if(value<=0){
                    callback(new Error('产品价格应大于0'))
                }
                callback()
            }
            return {
                ifadd: true,
                productForm: {
                    productName: '',
                    productPrice: '',
                    productComment: '',
                    categoryId: '',
                    productSize: '',
                    productImg: ''
                },
                rules: {
                    productName: [
                        { required: true, message: '请输入产品名称', trigger: 'blur' },
                        //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    productPrice: [
                        { required: true, message: '请输入产品价格'},
                        { type: 'number', message: '价格必须为数字'},
                        { validator: checkPrice, trigger: 'blur' }
                    ]
                },
                options: this.$store.state.categories
            };
        },
        methods: {
            submitForm(formName) {
                let that = this
                this.$refs[formName].validate(async (valid) => {
                    console.log(valid)
                    if (valid) {
                        if(that.ifadd){
                            let data = await that.$apis.product_add(that.productForm)
                            if(data){
                                that.resetForm(formName)
                            }
                        } else {
                            let data = await that.$apis.product_update(that.productForm)
                            if(data){
                                Object.assign(that.productForm, data)
                            }
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
        async mounted(){
            let temp = this.$route.path.split('/')
            if (temp.length === 4){
                this.ifadd = false
                let data = await this.$apis.product_detail(temp[3])
                Object.assign(this.productForm, data)
            }
        }
    }
</script>