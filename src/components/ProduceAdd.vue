<style scoped>
</style>
<template>
  <div>
    <el-row type="flex" style="margin-bottom: 30px;">
      <el-col :span="6" style="text-align: left;" :offset="2">
        <el-tag type="success">产品总数:{{content.length}}件</el-tag>
      </el-col>
      <el-col :span="14" style="text-align: right;">
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入要搜索的产品名称"
          clearable
          prefix-icon="el-icon-search"
          @select="selectName"
          select-when-unmatched
        ></el-autocomplete>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table :data="contenting" tooltip-effect="dark" style="width: 100%" ref="productTable">
          <el-table-column type="index" width="80"></el-table-column>
          <el-table-column prop="productName" label="产品名称" width="200"></el-table-column>
          <el-table-column prop="productPrice" label="产品价格" width="150"></el-table-column>
          <el-table-column prop="productComment" label="备注"></el-table-column>
          <el-table-column fixed="right" label="添加进度" width="120">
            <template slot-scope="scope">
              <!-- <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">添加</el-button> -->
              <el-popover placement="right" width="400" trigger="click" v-model="scope.row.ifpop">
                <el-form
                  label-position="left"
                  label-width="80px"
                  :model="produceAddForm"
                  :rules="rules"
                  ref="produceAddForm"
                >
                  <el-form-item label="产品名称">
                    <el-input v-model="produceAddForm.produceProductName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="下单量" prop="produceXiadan" style="text-align: left">
                    <el-input-number
                      v-model.number="produceAddForm.produceXiadan"
                      controls-position="right"
                      :min="1"
                    ></el-input-number>
                  </el-form-item>
                  <el-form-item label="备注" prop="produceXiadanComment">
                    <el-input
                      v-model="produceAddForm.produceXiadanComment"
                      clearable
                      type="textarea"
                    ></el-input>
                  </el-form-item>
                  <el-form-item style="text-align: right;">
                    <el-button @click="scope.row.ifpop = false">取消</el-button>
                    <el-button type="primary" @click="submitForm('produceAddForm', scope)">添加</el-button>
                  </el-form-item>
                </el-form>
                <el-button
                  slot="reference"
                  @click="handleEdit(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >添加</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <!-- <el-col :span="7" :offset="1">
                <el-card class="box-card" style="position: fixed;width: 20vw;" v-show="ifadd">
                    <div slot="header" class="clearfix">
                        <span>进度表单</span>
                    </div>
                    <el-form label-position="left" label-width="80px" :model="produceAddForm"
                             :rules="rules" ref="produceAddForm">
                        <el-form-item label="产品名称">
                            <el-input v-model="produceAddForm.produceProductName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="下单量" prop="produceXiadan" style="text-align: left">
                            <el-input-number v-model.number="produceAddForm.produceXiadan" controls-position="right"  :min="1" ></el-input-number>
                        </el-form-item>
                        <el-form-item label="备注" prop="produceXiadanComment">
                            <el-input v-model="produceAddForm.produceXiadanComment" clearable type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item style="text-align: right;">
                            <el-button @click="ifadd=false">取消</el-button>
                            <el-button type="primary" @click="submitForm('produceAddForm')">添加</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
      </el-col>-->
    </el-row>
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
    var checkXiadan = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error("下单量应大于0"));
      }
      callback();
    };
    var validateMessage = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写备注"));
      } else {
        callback();
      }
    };
    return {
      content: [],
      contenting: [],
      state: "",
      pageName: "",
      produceAddForm: {
        produceProductId: "",
        produceProductName: "",
        produceXiadan: "",
        produceXiadanComment: ""
      },
      ifadd: false,
      rules: {
        produceXiadan: [
          { required: true, message: "请输入下单量", trigger: "blur" },
          { type: "number", message: "下单量必须为数字" },
          { validator: checkXiadan, trigger: "blur" }
        ],
        produceXiadanComment: [
          { required: true, validator: validateMessage, trigger: "blur" }
        ]
      }
    };
  },
  async created() {
    this.getList();
  },
  methods: {
    async getList(name = this.pageName) {
      let data = await this.$apis.product_get_add(name);
      if (data) {
        data.forEach(item => {
          item.ifpop = false;
        });
        this.content = data;
        this.contenting = data;
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
      //console.log("row", row);
      this.resetForm("produceAddForm");
      row.ifpop = !row.ifpop;
      this.produceAddForm.produceProductName = row.productName;
      this.produceAddForm.produceProductId = row.productId;
    },
    submitForm(formName, scope) {
      let that = this;
      console.log("scope", scope);
      this.$refs[formName].validate(async (valid, obj) => {
        if (valid) {
          scope.row.ifpop = false;
          let data = await that.$apis.produce_add(that.produceAddForm);
          if (data) {
            that.resetForm(formName);
            //that.ifadd = false;
          }
        } else {
          //console.log("productForm submit error!!", obj);
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  watch: {
    ifadd(newVal, oldVal) {
      console.log(newVal);
      if (newVal === false) {
        this.resetForm("produceAddForm");
      }
    }
  },
  computed: {}
};
</script>