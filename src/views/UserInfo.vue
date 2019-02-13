<style scoped>
</style>
<template>
  <div>
    <el-row type="flex" style="margin-bottom: 30px;">
      <el-col :span="8" style="text-align: left">
        <el-button type="primary" @click="handleForm">
          添加新用户
          <i class="el-icon-circle-plus el-icon--right"></i>
        </el-button>
      </el-col>
      <el-col :span="12" :offset="4">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入要查找的用户姓名"
          clearable
          prefix-icon="el-icon-search"
          @select="selectName"
          select-when-unmatched
        ></el-autocomplete>
      </el-col>
    </el-row>

    <el-table
      :data="contentArray"
      tooltip-effect="dark"
      style="width: 100%"
      ref="userInfoTable"
      @selection-change="handleSelectionChange"
      @expand-change="openDetail"
      max-height="450"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userInfoTrueName" label="姓名" width="150"></el-table-column>
      <el-table-column prop="userInfoName" label="用户名" width="150"></el-table-column>
      <el-table-column prop="role" label="角色" width="150"></el-table-column>
      <el-table-column prop="addTime" label="加入日期" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.addTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-between" style="margin-top: 30px;">
      <div>
        <el-popover placement="top" width="160" v-model="visible">
          <p>{{Ids.length > 0 ? '您确定要删除所选的这些用户吗？' : '请先选择要删除的用户'}}</p>
          <div style="text-align: right; margin: 0" v-if="Ids.length>0">
            <el-button size="mini" type="text" @click="visible = false">取 消</el-button>
            <el-button type="primary" size="mini" @click="deleteProducts">确 定</el-button>
          </div>
          <div style="text-align: right; margin: 0" v-else>
            <el-button size="mini" type="primary" @click="visible = false">确 定</el-button>
          </div>
          <el-button
            slot="reference"
            type="danger"
            v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
          >删除所选项</el-button>
        </el-popover>
        
        <!-- <el-button type="danger" @click="deleteProducts">删除所选项</el-button> -->
        <el-button @click="toggleSelection()" style="margin-left: 10px;">取消选择</el-button>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-row>
  </div>
</template>

<script>
import { dateParse, roleTrans } from "../utils/util";
import { Message } from "element-ui";
import ElRow from "element-ui/packages/row/src/row";
import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
import ElCol from "element-ui/packages/col/src/col";

export default {
  components: {
    ElCol,
    ElButton,
    ElRow
  },
  data: function() {
    return {
      content: new Map(),
      details: new Map(),
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageName: "",
      Ids: [],
      state: "",
      visible: false
    };
  },
  async created() {
    this.cutPage();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },
    async cutPage(
      page = this.currentPage,
      pageSize = this.pageSize,
      name = this.pageName
    ) {
      let data = await this.$apis.user_get(page, pageSize, name);
      if (data) {
        let content = Array.from(data.content, function(item) {
          item.addTime = dateParse(item.userInfoCreateTime);
          item.updateTime = dateParse(item.userInfoUpdateTime);
          item.role = roleTrans(item.userInfoRoles);
          return [item.userInfoId, item];
        });
        //console.log('map ',content)
        this.content = new Map(content);
        this.total = data.totalElements;
      }
      return data;
    },
    handleSelectionChange(e) {
      console.log("多选", e);
      let temp = [];
      e.forEach(item => {
        temp.push(item.userInfoId);
      });
      this.Ids = temp;
    },
    async openDetail(e) {
      console.log("详情", e);
      let data = await this.$apis.product_detail(e.userInfoId);
    },
    handleEdit(index, row) {
      this.$router.push({
        name: "userForm",
        params: { userInfo: row, userInfoId: row.userInfoId }
      });
    },
    handleDelete(index, row) {
      this.$confirm(
        "此操作将删除用户--" + row.userInfoTrueName + ", 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async     () => {
          let temp = [row.userInfoId];
          let data = await this.$apis.user_delete(temp);
          if (!data) {
            this.cutPage();
          }
        })
        .catch(() => {
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.userInfoTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.userInfoTable.clearSelection();
      }
    },
    async deleteProducts() {
      if (this.Ids.length > 0) {
        let data = await this.$apis.user_delete(this.Ids);
        this.visible = false;
        if (!data) {
          this.cutPage();
        }
      } else {
        Message.info("没有删除项");
      }
    },
    async querySearchAsync(queryString, cb) {
      let data = await this.$apis.user_get(
        this.currentPage,
        this.pageSize,
        queryString
      );
      let temp = data.content.map(item => {
        return { value: item.userInfoTrueName };
      });
      this.pageName = queryString;
      console.log(this.pageName);
      cb(temp);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    selectName(item) {
      this.pageName = item.value;
      this.cutPage();
    },
    handleForm() {
      this.$router.push({ name: "userForm" });
    }
  },
  watch: {
    currentPage: function(newVal, oldVal) {
      this.cutPage(newVal, this.pageSize);
    },
    pageSize: function(newVal, oldVal) {
      this.cutPage(this.currentPage, newVal);
    }
  },
  computed: {
    contentArray: function() {
      return Array.from(this.content.values());
    }
  }
};
</script>