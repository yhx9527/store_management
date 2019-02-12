<style>
</style>

<template>
  <el-card style="width: 50vw;margin:auto;margin-top: 30px;" shadow="hover">
    <h2 slot="header">修改密码</h2>
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="pwdForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="oldPass">
        <el-input :type="eyeIcon1=== 'icon-eye' ? 'password' : 'text'" v-model="pwdForm.oldPass" autocomplete="off">
          <template slot="suffix"><i :class="'iconfont ' + eyeIcon1" style="color: #0ff1b0;margin-right: 5px;" @click="handleEye('eyeIcon1')"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass">
        <el-input :type="eyeIcon2=== 'icon-eye' ? 'password' : 'text'" v-model="pwdForm.newPass" autocomplete="off">
          <template slot="suffix"><i :class="'iconfont ' + eyeIcon2" style="color: #0ff1b0;margin-right: 5px;" @click="handleEye('eyeIcon2')"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item style="text-align: left;">
        <el-button type="primary" @click="submitForm('pwdForm')">确认</el-button>
        <el-button @click="resetForm('pwdForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value === this.pwdForm.oldPass) {
        callback(new Error("新密码和旧密码相同"))
      } else {
        callback();
      }
    };
    return {
      pwdForm: {
        oldPass: "",
        newPass: ""
      },
      rules: {
        oldPass: [{ validator: validatePass, trigger: "blur" }],
        newPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      eyeIcon1: 'icon-eye',
      eyeIcon2: 'icon-eye',
      
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const data = await this.$apis.user_change_pwd(this.pwdForm.newPass, this.pwdForm.oldPass)
          this.resetForm(formName)
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEye(type) {
      console.log('眼睛', type)
      if (type === 'eyeIcon1') {
        this.eyeIcon1 = (this.eyeIcon1 === 'icon-eye' ? 'icon-eye-off' : 'icon-eye')
      } else {
        this.eyeIcon2 = (this.eyeIcon2 === 'icon-eye' ? 'icon-eye-off' : 'icon-eye')
      }
    }
  }
};
</script>