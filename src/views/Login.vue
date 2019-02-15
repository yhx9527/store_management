
<style scoped>
.loginContainer {
  height: 100%;
}
.middle {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.img {
  height: 400px;
  width: 600px;
  align-self: center;
  box-shadow: 0px 2px 50px 1px #3d4a6a;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  /* background:  #EAEEFA; */
  height: 100%;
  background: #f2eff8;
}
.loginImg {
    height: 90%;
    width: 80%;
    border-radius: 20px;
    background-image: url(https://s2.ax1x.com/2019/02/15/kDh1Te.jpg);
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.form {
  margin-left: 0px;
  height: 500px;
  width: 400px;
  border: 0px !important;
  border-radius: 20px;
  background: hsla(0, 0%, 100%, .3)
}
</style>
<template>
  <div class="login">
    <!-- <img src="../static/images/sky.jpg" class="img"> -->
    <div class="loginImg">
      <login-form @login="submit" class="form" :loading="loading"></login-form>
    </div>
  </div>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";

export default {
  components: {
    LoginForm
  },
  data: function() {
    return {
      loading: false
    };
  },
  methods: {
    async submit(form) {
      this.loading = true;
      let data = await this.$apis.user_login(form);
      this.loading = false;
      if (data) {
        this.$store.commit("setUser", data);
        this.$router.replace({ path: "product" });
      }
      console.log("login", data);
    }
  }
};
</script>
