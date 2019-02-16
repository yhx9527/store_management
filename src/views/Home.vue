<style>
.el-header {
  background-image: linear-gradient(135deg, #4da5ff 0%, #74b9ff 100%);
  /* background-image: linear-gradient(to right, #30cfd0 0%, #330867 100%); */
  /* background-image: linear-gradient(to right, #330867 0%, #30cfd0 100%);   */
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  height: 80px;
  line-height: 60px;
  box-shadow: 0px 9px 10px -10px #322044;
}

.el-aside {
  color: #333;
}
.row-bar {
  padding-left: 10px;
  padding-top: 10px;
}
.aside {
  background: #ffffff;
  box-shadow: 5px 0px 7px -7px #333;
}
.el-menu {
  border-right: 0px !important;
}
.container {
  margin-top: 20px;
  background-image: linear-gradient(to bottom, #ffffff, #c2e1ff 100%);
  height: auto;
}
.el-menu-item.is-active {
  color: #409EFF;
  background-color: #ecf5ff;
}
li.el-submenu.is-active {
  background-color: #ecf5ff;
}
li.el-submenu.is-active i.aside-icon {
  color: #409EFF;
}
</style>
<template>
  <!--div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div-->
  <el-container style="height: 100%;">
    <el-header>
      <el-row>
        <el-col :span="12">
          <div style="text-align: left;font-weight: bold;font-size: 24px;">
            <i class="el-icon-star-on"></i> Manage
          </div>
        </el-col>
        <el-col :span="12">
          <div style="text-align: right">
            <span>{{auth}}</span>
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting" style="margin-left: 5px;font-size: 20px;color: #FFFFFF;"></i>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command="Index">门户网站</el-dropdown-item> -->
                <el-dropdown-item command="UserInfo">个人资料</el-dropdown-item>
                <el-dropdown-item command="Pwd">修改密码</el-dropdown-item>
                <el-dropdown-item command="Logout">登 出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="container">
      <el-aside width="65px" class="aside">
        <el-menu
          default-active="/produce"
          router
          menu-trigger="hover"
          :collapse="true"
          text-color=""
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-goods aside-icon"></i>
            </template>
            <el-menu-item-group>
              <span slot="title">产品管理</span>
              <el-menu-item index="/product">所有产品</el-menu-item>
              <el-menu-item index="/product/category">产品类别</el-menu-item>
              <el-menu-item index="/product/filein" v-if="auth_key !== 'USER'">导入产品文件</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-time aside-icon"></i>
            </template>
            <el-menu-item-group>
              <span slot="title">进度管理</span>
              <el-menu-item index="/produce">进度列表</el-menu-item>
              <el-menu-item index="/produce/filein" v-if="auth_key !== 'USER'">导入进度文件</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/output">
            <i class="el-icon-document aside-icon"></i>
            <span slot="title">产值管理</span>
          </el-menu-item>
          <el-menu-item index="/userinfo" v-if="auth_key === 'ADMIN'">
            <i class="el-icon-view aside-icon"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="padding:0">
        <div style="text-align: left;margin-left: 20px;">
          <el-button round size="medium" type="primary" plain @click="back">
            <i class="el-icon-back"></i> 返回
          </el-button>
        </div>
        <!--el-breadcrumb separator-class="el-icon-arrow-right" class="row-bar">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb-->
        <router-view style="padding:20px"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import ElCol from "element-ui/packages/col/src/col";
import { auths } from "@/utils/models";

export default {
  name: "home",
  components: {
    ElCol,
    HelloWorld
  },
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    console.log("userInfo", JSON.stringify(this.$store.getters.getUserInfo));
    let auth_key = this.$store.getters.getUserInfo.userInfoRoles;
    let auth = auths.get(auth_key);
    console.log("auth", auth);
    return {
      tableData: Array(20).fill(item),
      auth: auth,
      auth_key
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "Index":
          break;
        case "UserInfo":
          this.$router.push({ name: "profile" });
          break;
        case "Pwd":
          this.$router.push({ name: "changePwd" });
          break;
        case "Logout":
          //  this.$cookie.erase('token')
          this.$store.commit("clear");
          this.$router.replace({ name: "login" });
          break;
      }
    },
    back() {
      this.$router.back()
    }
  },
  mounted() {
    console.log("路由", this.$route);
  }
};
</script>

