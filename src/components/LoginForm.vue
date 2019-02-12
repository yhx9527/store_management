<style scoped>
    .loginForm{
        width: 90%;
        margin-left: -30px;
        padding-right: 10%;
        margin-top: 10px;

    }
    .loginCard{
        width: 40%;
        margin:0;
        border-radius: 0;
    }
    .loginBtn{
        width: 100%;
        margin-top: 10px;
    }
</style>
<template>
    <el-card shadow="always" class="loginCard" :bodyStyle="{'padding-bottom':'80px','padding-top':'60px'}">
        <h1 slot="header">仓库后台管理系统</h1>
        <el-form ref="loginForm" labelPosition="right" :model="loginForm" :rules="loginRule"  label-width="100px" class="loginForm" statusIcon>
            <el-form-item label="用户名" prop="username">
                <el-input placeholder="请输入用户名" clearable autofocus v-model="loginForm.username" autocomplete="on">
                </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
            </el-form-item>
            <!--el-checkbox v-model="remember">记住密码</el-checkbox-->
            <el-form-item>
                <el-button type="primary" @click="submitForm('loginForm')" class="loginBtn" :loading="loading">登录</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    export default {
        components: {},
        data: function () {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else {
                    callback();
                }
            };
            var validateUsername = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('用户名不能为空'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                loginRule: {
                    username: [
                        { validator: validateUsername, trigger: 'blur'}
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur'}
                    ]
                },
            }
        },
        props: {
            loading: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            submitForm(formName) {
                let that = this
                this.$refs[formName].validate((valid)=>{
                    if (valid) {
                        /*if (that.remember) {
                            that.cookie.set('username', that.loginForm.username)
                            that.cookie.set('password', that.loginForm.password)
                        } else {
                            that.cookie.erase('username')
                            that.cookie.erase('password')
                        }*/
                        that.$emit('login', that.loginForm)
                    } else {
                        console.log('loginform error!!');
                    }
                })
            }
        },
        mounted(){
            /*let username = this.cookie.get('username')
            let password = this.cookie.get('password')
            if (username && password) {
                this.remember = true
                this.loginForm['username'] = username
                this.loginForm['password'] = password
            }*/
        }
    }
</script>