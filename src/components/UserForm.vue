<template>
    <div>
        <el-card style="width: 50vw;margin:auto;margin-top: 30px;" shadow="hover">
            <h2 slot="header">{{ifadd ? '添加用户信息' : '更新用户信息'}}</h2>
            <el-form :model="userInfoForm" status-icon :rules="rules" ref="userInfoForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="userInfoName" >
                    <el-input v-model="userInfoForm.userInfoName" :disabled="!ifadd"></el-input>
                </el-form-item>
                <el-form-item label="真实性名" prop="userInfoTrueName">
                    <el-input v-model="userInfoForm.userInfoTrueName"></el-input>
                </el-form-item>
                <el-form-item label="是否查封" prop="userInfoIsLocked" v-if="!ifadd" style="text-align: left;">
                    <el-switch v-model="userInfoForm.userInfoIsLocked"></el-switch>
                </el-form-item>
                <el-form-item label="用户密码" prop="userInfoPass" v-if="ifadd">
                    <el-input v-model="userInfoForm.userInfoPass" placeholder="请输入密码" ></el-input>
                </el-form-item>
                <el-form-item label="用户权限" prop="userInfoRoles">
                    <el-select v-model="userInfoForm.userInfoRoles" placeholder="请选择用户权限" style="float: left;">
                        <el-option label="普通用户(只能查看)" value="USER"></el-option>
                        <el-option label="操作员" value="OPERATOR"></el-option>
                        <el-option label="管理员" value="ADMIN"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="text-align: left;">
                    <el-button :type="ifadd ? 'primary' : 'warning'" @click="submitForm('userInfoForm')">{{ifadd ? '立即添加' : '确认修改'}}</el-button>
                    <el-button @click="resetForm('userInfoForm')" :type="ifadd ? '' : 'danger'">{{ifadd ? '重置' : '重置密码'}}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
    import ElCard from "../../node_modules/element-ui/packages/card/src/main.vue";

    export default {
        components: {ElCard},
        data() {
            var checkName = async (rule, value, callback) =>{
                let data = await this.$apis.user_check_name(value)
                if (data === null){
                    callback(new Error('该用户名已存在'))
                    return false
                } else {
                    callback()
                }

            }
            return {
                ifadd: true,
                userInfoForm: {
                    userInfoName: '',
                    userInfoTrueName: '',
                    userInfoPass: '123456',
                    userInfoRoles: '',
                    userInfoIsLocked: false
                },
                rules: {
                    userInfoName: [
                        { required: true, message: '请输入用户名称', trigger: 'blur'},
                        //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                        {trigger: 'blur',validator: checkName}
                    ],
                    userInfoTrueName: [
                        { required: true, message: '请输入用户真实姓名',trigger: 'blur'},
                    ],
                    userInfoRoles: [
                        {required: true, message: '请选择用户权限',trigger: 'blur'}
                    ],
                    userInfoPass: [
                        {required: true, message: '请输入密码',trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                let that = this
                if(!this.ifadd){
                    this.rules.userInfoName[1].validator=''
                }
                this.$refs[formName].validate(async (valid) => {
                    console.log(valid)
                    if (valid) {
                        if(that.ifadd){
                            let data = await that.$apis.user_add(that.userInfoForm)
                            if(data !== null){
                                that.resetForm(formName)
                            }
                        } else {
                            let form = JSON.parse(JSON.stringify(that.userInfoForm))
                            form.userInfoIsLocked = Number(form.userInfoIsLocked)
                            let data = await that.$apis.user_update(form)
                            if(data){
                                Object.assign(that.userInfoForm, data)
                            }
                        }
                    } else {
                        console.log('productForm submit error!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                if(this.ifadd){
                    this.$refs[formName].resetFields();
                }else{
                    this.userInfoForm.userInfoPass = 123456
                }
            }
        },
        async mounted(){
            let temp = this.$route.path.split('/')
            if (temp.length === 4){
                this.ifadd = false
               // console.log('cehsi ',this,this.userInfoId,this.userInfo)
                //let data = await this.$apis.product_detail(temp[3])
                let userInfo = this.$route.params.userInfo
                userInfo.userInfoIsLocked = Boolean(userInfo.userInfoIsLocked)
                Object.assign(this.userInfoForm, userInfo)
            }
        }
    }
</script>