<style scoped>
</style>
<template>
  <div>
    <el-row type="flex" style="margin-bottom: 30px;">
      <el-col :span="6" style="text-align: left;" :offset="2">
        <el-button
          type="primary"
          @click="visible=true"
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
          style="margin-right: 20px;"
        >添加类别</el-button>
        <el-tag type="success">类别总数:{{content.length}}件</el-tag>
      </el-col>
      <!-- <el-col :span="6" style="text-align: left;"> -->
      <!--el-autocomplete
                        v-model="state"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入要搜索的产品名称"
                        clearable
                        prefix-icon="el-icon-search"
                        @select="selectName"
                        select-when-unmatched
      ></el-autocomplete-->
      <!-- <el-button type="primary" @click="visible=true" v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'">添加类别</el-button>
      </el-col>-->
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table
          :data="content"
          tooltip-effect="dark"
          style="width: 100%"
          ref="categoryTable"
          max-height="650"
        >
          <el-table-column type="index" width="80"></el-table-column>
          <el-table-column prop="categoryName" label="类别名称" width="200"></el-table-column>
          <el-table-column prop="updateTime" label="最近修改" width="250"></el-table-column>
          <el-table-column
            label="操作"
            align="center"
            v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
          >
            <template slot-scope="scope">
              <!-- <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">更 新</el-button> -->

              <el-popover placement="top" width="400" trigger="click" v-model="scope.row.ifpopover">
                <el-form
                  label-position="left"
                  label-width="80px"
                  :model="categoryForm"
                  :rules="rules"
                  ref="categoryForm"
                  hide-required-asterisk
                >
                  <el-form-item label="修改名称" prop="categoryName">
                    <el-input v-model="categoryForm.categoryName"></el-input>
                  </el-form-item>
                  <el-form-item style="text-align: right;">
                    <el-button @click="scope.row.ifpopover=false">取消</el-button>
                    <el-button type="primary" @click="submitForm('categoryForm', scope)">更新</el-button>
                  </el-form-item>
                </el-form>
                <el-button
                  slot="reference"
                  @click="handleEdit(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >更 新</el-button>
                <!-- <el-button slot="reference">click 激活</el-button> -->
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!-- <el-col :span="10" :offset="2">
                <el-card class="box-card" style="position: fixed;width: 20vw;" v-show="ifadd">
                    <div slot="header" class="clearfix">
                        <span>类别表单</span>
                    </div>
                    <el-form label-position="left" label-width="80px" :model="categoryForm"
                             :rules="rules" ref="categoryForm" hide-required-asterisk>
                        <el-form-item label="类别修改" prop="categoryName">
                            <el-input v-model="categoryForm.categoryName"></el-input>
                        </el-form-item>
                        <el-form-item style="text-align: right;">
                            <el-button @click="ifadd=false">取消</el-button>
                            <el-button type="primary" @click="submitForm('categoryForm')">更新</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
      </el-col>-->
    </el-row>
    <el-dialog title="添加类别" :visible.sync="visible">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="类别名称" label-width="120px" prop="categoryName">
          <el-input v-model="addForm.categoryName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateParse } from "../utils/util";
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
    var checkName = async (rule, value, callback) => {
      let data = await this.$apis.category_check(value);
      console.log("check", data);
      if (data) {
        callback(new Error(data));
      } else {
        callback();
      }
    };
    return {
      content: [],
      state: "",
      pageName: "",
      categoryForm: {
        categoryName: "",
        categoryId: ""
      },
      addForm: {
        categoryName: ""
      },
      visible: false,
      ifadd: false,
      rules: {
        categoryName: [
          { required: true, message: "请输入类别名", trigger: "blur" },
          { validator: checkName, trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    this.getList();
  },
  methods: {
    async getList() {
      let data = await this.$apis.category_get();
      if (data) {
        data.forEach(item => {
          item.updateTime = dateParse(item.categoryUpdateTime);
          item.ifpopover = false
        });
        this.content = data.reverse();
        this.$store.commit("setCategories", data);
      }
      return data;
    },
    async querySearchAsync(queryString, cb) {
      this.contenting = this.content.filter(item => {
        return (
          item.productName.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        );
      });
      let temp = this.contenting.map(item => {
        return { value: item.productName };
      });
      cb(temp);
    },
    selectName(data) {
      this.contenting = this.contenting.filter(item => {
        return (
          item.productName.toLowerCase().indexOf(data.value.toLowerCase()) > -1
        );
      });
    },
    handleEdit(index, row) {
      console.log("row", row);
      this.resetForm("categoryForm");
      this.ifadd = true;
      this.categoryForm.categoryName = row.categoryName;
      this.categoryForm.categoryId = row.categoryId;
    },
    submitForm(formName, scope) {
      let that = this;
      this.$refs[formName].validate(async valid => {
        console.log(valid);
        scope.row.ifpopover = false
        if (valid) {
          let data = await that.$apis.category_update(that.categoryForm);
          that.resetForm(formName);
          //that.ifadd = false;
          that.getList();
        } else {
          console.log("productForm submit error!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addCategory(formName) {
      let that = this;
      this.$refs[formName].validate(async valid => {
        console.log(valid);
        if (valid) {
          let data = await that.$apis.category_add(that.addForm);
          that.resetForm(formName);
          this.visible = false;
          that.getList();
        } else {
          console.log("categoryForm submit error!!");
          return false;
        }
      });
    }
  },
  watch: {
    ifadd(newVal, oldVal) {
      console.log(newVal);
      if (newVal === false) {
        this.resetForm("categoryForm");
      }
    },
    visible(newVal) {
      console.log("visible ", newVal);
      if (newVal === false) {
        this.resetForm("addForm");
      }
    }
  },
  computed: {}
};
</script>