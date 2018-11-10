<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
<template>
  <!--div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div-->
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="12"><div style="text-align: left;font-weight: bold;font-size: 24px;">仓库后台管理系统</div></el-col>
        <el-col :span="12">
          <div style="text-align: right">
            <span>管理员</span>
            <el-dropdown>
              <i class="el-icon-setting" style="margin-left: 5px;font-size: 20px;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>门户网站</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item>登出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div></el-col>
      </el-row>

    </el-header>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1']" default-active="product" router>
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-goods"></i>产品管理</template>
            <el-menu-item index="product">所有产品</el-menu-item>
            <el-menu-item index="fileinproduct">导入产品文件</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-time"></i>进度管理</template>
            <el-menu-item index="produce">进度列表</el-menu-item>
            <el-menu-item index="fileinproduce">导入进度文件</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-document"></i>产值管理</template>
            <el-menu-item index="output">所有产值</el-menu-item>
            <el-menu-item index="fileout">导出产值文件</el-menu-item>
        </el-submenu>
          <el-menu-item index="userinfo"><i class="el-icon-view"></i>所有用户</el-menu-item>
      </el-menu>
    </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import ElCol from "element-ui/packages/col/src/col";

export default {
  name: 'home',
  components: {
      ElCol,
      HelloWorld
  },
    data() {
        const item = {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
        };
        return {
            tableData: Array(20).fill(item)
        }
    }
}
</script>

