<style scoped>
  div.el-table th{
    display: table-cell !important;
  }
</style>
<template>
  <div>
    <el-row type="flex" style="margin-bottom: 30px;">
      <el-col :span="8" style="text-align: left">
        <el-button
          type="primary"
          @click="handleForm"
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
        >
          添加产品
          <i class="el-icon-circle-plus el-icon--right"></i>
        </el-button>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <el-select v-model="categoryId" placeholder="选择产品类别" style="margin-right: 30px;">
          <el-option
            v-for="item in categoryArr"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          ></el-option>
        </el-select>
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

    <el-table
      :data="contentArray"
      tooltip-effect="dark"
      ref="productTable"
      @selection-change="handleSelectionChange"
      @expand-change="openDetail"
      max-height="580"
    >
      <el-table-column type="selection" width="55" fixed></el-table-column>
      <el-table-column prop="productName" label="产品名称" width="150" fixed></el-table-column>
      <el-table-column prop="categoryName" label="产品类别" width="150"></el-table-column>
      <el-table-column prop="productSize" label="产品尺寸" width="150"></el-table-column>
      <el-table-column prop="productPrice" label="产品价格" width="150"></el-table-column>
      <el-table-column prop="productComment" label="备注"></el-table-column>
      <!-- <el-table-column
                prop="addTime"
                label="创建日期"
                width="200">
            <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.addTime }}</span>
            </template>
      </el-table-column>-->
      <el-table-column prop="updateTime" label="最近修改" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
          <el-button size="mini" type="success" @click="handlePhoto(scope.$index, scope.row)">加 图</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删 除</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column type="expand">
            <template slot-scope="props">

            </template>
      </el-table-column>-->
    </el-table>
    <el-row type="flex" justify="space-between" style="margin-top: 30px;">
      <div>
        <!-- <el-button
          type="danger"
          @click="deleteProducts"
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
        >删除所选项</el-button>-->
        <el-popover placement="top" width="160" v-model="visible">
          <p>{{productIds.length > 0 ? '您确定要删除所选的这些产品吗？' : '请先选择要删除的产品'}}</p>
          <div style="text-align: right; margin: 0" v-if="productIds.length>0">
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
        <el-button
          @click="toggleSelection()"
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
          style="margin-left: 10px;"
        >取消选择</el-button>
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
    return {
      content: new Map(),
      details: new Map(),
      currentPage: 1,
      pageSize: 10,
      categoryId: "",
      total: 0,
      pageName: "",
      productIds: [],
      state: "",
      productSearch: [],
      category: new Map(),
      categoryArr: [],
      visible: false
    };
  },
  async created() {
    let storeCategory = JSON.parse(
      JSON.stringify(this.$store.state.categories)
    );
    if (storeCategory.length > 0) {
      let temp = storeCategory.map(item => {
        return [item.categoryId, item];
      });
      this.category = new Map(temp);
      this.categoryArr = storeCategory;
    } else {
      let data = await this.$apis.category_get();
      if (data) {
        let temp = data.map(item => {
          return [item.categoryId, item];
        });
        this.category = new Map(temp);
        this.$store.commit("setCategories", data);
        data.unshift({ categoryId: "", categoryName: "全部类别" });
        this.categoryArr = data;
      }
    }
    this.cutPage();
  },
  async mounted() {},
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
      name = this.pageName,
      categoryId = this.categoryId
    ) {
      var that = this;
      let data = await this.$apis.product_get(page, pageSize, name, categoryId);
      if (data) {
        let content = Array.from(data.content, function(item) {
          item.addTime = dateParse(item.productCreateTime);
          item.updateTime = dateParse(item.productUpdateTime);
          item.productSize = item.productSize || "暂无数据";
          if (item.categoryId) {
            console.log("分类", that.category);
            item.categoryName = that.category.get(item.categoryId).categoryName;
          } else {
            item.categoryName = "未分类";
          }
          return [item.productId, item];
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
        temp.push(item.productId);
      });
      this.productIds = temp;
    },
    async openDetail(e) {
      console.log("详情", e);
      let data = await this.$apis.product_detail(e.productId);
    },
    handleEdit(index, row) {
      this.$router.push({
        name: "productForm",
        params: { productId: row.productId }
      });
    },
    handlePhoto(index, row) {
      console.log("row", row);
      this.$router.push({
        name: "photo",
        params: { productId: row.productId }
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否删除产品--" + row.productName, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let temp = [row.productId];
          let data = await this.$apis.product_delete(temp);
          if (!data) {
            this.cutPage();
          }
        })
        .catch(() => {});
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.productTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.productTable.clearSelection();
      }
    },
    async deleteProducts() {
      if (this.productIds.length > 0) {
        let data = await this.$apis.product_delete(this.productIds);
        this.visible = false;
        if (!data) {
          this.cutPage();
        }
      }
      // } else {
      //   Message.info("没有删除项");
      // }
    },
    async querySearchAsync(queryString, cb) {
      let data = await this.$apis.product_get(
        this.currentPage,
        this.pageSize,
        queryString
      );
      let temp = data.content.map(item => {
        return { value: item.productName };
      });
      this.pageName = queryString;
      console.log(this.pageName);
      //console.log('模糊收缩',temp)
      //var results = queryString ? temp.filter(this.createStateFilter(queryString)) : temp;
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
      this.$router.push({ name: "productForm" });
    }
  },
  watch: {
    currentPage: function(newVal, oldVal) {
      this.cutPage(newVal, this.pageSize);
    },
    pageSize: function(newVal, oldVal) {
      this.cutPage(this.currentPage, newVal);
    },
    categoryId: function(newVal, oldVal) {
      this.cutPage();
    }
  },
  computed: {
    contentArray: function() {
      console.log("ca", Array.from(this.content.values()));
      return Array.from(this.content.values());
    }
  }
};
</script>