<style scoped>
</style>
<template>
  <el-card style="width: 50vw;margin:auto;margin-top: 30px;" shadow="hover">
    <h2 slot="header">我的资料</h2>
    <el-form
      :model="userInfoForm"
      status-icon
      :rules="rules"
      ref="userInfoForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="userInfoName">
        <el-input v-model="userInfoForm.userInfoName"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="userInfoTrueName">
        <el-input v-model="userInfoForm.userInfoTrueName"></el-input>
      </el-form-item>
      <el-form-item style="text-align: left;">
        <el-button type="primary" @click="submitForm('userInfoForm')">确认修改</el-button>
        <el-button @click="resetForm('userInfoForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
export default {
  data() {
    // var checkName = async (rule, value, callback) => {
    //   let data = await this.$apis.user_check_name(value);
    //   if (data === null) {
    //     callback(new Error("该用户名已存在"));
    //     return false;
    //   } else {
    //     callback();
    //   }
    // };
    return {
      ifadd: true,
      userInfoForm: {
        userInfoName: "",
        userInfoTrueName: ""
      },
      rules: {
        userInfoName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          //{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          //{ trigger: "blur", validator: checkName }
        ],
        userInfoTrueName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const data = this.$apis.user_other_update(this.userInfoForm)
          this.$store.commit('setUserInfo', this.userInfoForm)
        } else {
          console.log("userInfoForm submit error!!");
          return false;
        }
      });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    }
  },
  mounted() {
      const userInfo = this.$store.getters.getUserInfo
      console.log('用户资料')
      Object.assign(this.userInfoForm, userInfo)
  }
};
</script>
