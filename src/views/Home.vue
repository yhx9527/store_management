<style>
.el-header {
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #57606f;
  height: 80px;
  line-height: 60px;
  margin: 5px;
  border-radius: 8px;
}

.el-aside {
  color: #333;
}
.row-bar {
  padding-left: 10px;
  padding-top: 10px;
}
.aside{

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
          <div style="text-align: left;font-weight: bold;font-size: 24px;">仓库后台管理系统</div>
        </el-col>
        <el-col :span="12">
          <div style="text-align: right">
            <span>{{auth}}</span>
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting" style="margin-left: 5px;font-size: 20px;"></i>
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
    <el-container style="margin-top: 20px;">
      <el-aside width="80px" class="aside">
        <el-menu
          :default-openeds="['/product']"
          default-active="product"
          router
          menu-trigger="hover"
          :collapse="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-goods"></i>
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
              <i class="el-icon-time"></i>
            </template>
            <el-menu-item-group>
               <span slot="title">进度管理</span>
               <el-menu-item index="/produce">进度列表</el-menu-item>
               <el-menu-item index="/produce/filein" v-if="auth_key !== 'USER'">导入进度文件</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/output">
            <i class="el-icon-document"></i>
             <span slot="title">产值管理</span>
          </el-menu-item>
          <el-menu-item index="/userinfo" v-if="auth_key === 'ADMIN'">
            <i class="el-icon-view"></i>
             <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main style="padding:0">
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
    }
  },
  mounted() {
    console.log("路由", this.$route);
  }
};
</script>

