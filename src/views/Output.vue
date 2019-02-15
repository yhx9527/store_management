<style>
.el-table .cover-row {
  background: #ecf5ff;
}
.demonstration {
  margin-right: 5px;
  font-weight: 500;
}
</style>
<template>
  <div>
    <el-row type="flex" style="margin-bottom: 30px;">
      <el-col :span="8" style="text-align: left">
        <el-button
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
          type="primary"
          @click="dateVisible = true"
        >导出产值
          <i class="el-icon-circle-plus el-icon--right"></i>
        </el-button>
      </el-col>
      <el-col :span="8">
        <span class="demonstration">每月产值</span>
        <el-date-picker
          v-model="dateValue"
          align="right"
          type="month"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          @change="changeDate"
        ></el-date-picker>
      </el-col>
      <el-col :span="8" style="text-align: right;">
        <el-autocomplete
          v-model="state"
          placeholder="请输入要搜索的产值"
          clearable
          prefix-icon="el-icon-search"
          @select="selectName"
          select-when-unmatched
          :fetch-suggestions="querySearchAsync"
        ></el-autocomplete>
      </el-col>
    </el-row>

    <el-table
      :data="content"
      tooltip-effect="dark"
      style="width: 100%"
      ref="produceTable"
      empty-textv="暂无数据"
      :summary-method="getSummaries"
      show-summary
      :row-class-name="tableRowClassName"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @selection-change="handleSelectionChange"
      @expand-change="openDetail"
      max-height="650"
    >
      <el-table-column type="index" width="50" fixed></el-table-column>
      <el-table-column
        prop="outputProductName"
        label="产品名称"
        align="center"
        fixed
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column prop="outputXiadan" label="下单量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputMugong" label="木工数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputYoufang" label="油房" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputBaozhuang" label="包装" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputBaozhuangTotalPrice" label="包装总价格" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputTeding" label="特定" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputTedingTotalPrice" label="特定总价格" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputBeijing" label="北京" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outputBeijingteding" label="北京特定" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateTime" label="最近修改" width="220" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
      >
        <template slot-scope="scope">
          <el-row>
            <!--el-col :span="24" >
                            <el-button
                                    size="mini"
                                    type="success"
                                    @click="handlePut('update',scope.row)">更新</el-button>
            </el-col-->
            <el-col :span="24" style="margin-top: 5px">
              <el-button size="mini" type="primary" @click="handlePut('modify',scope.row)">修 正</el-button>
            </el-col>
            <!--el-col :span="24" style="margin-top: 5px">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-col-->
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 30px;text-align: right;">
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

    <output-update :dataPut="dataPut" @update="handleUpdate"></output-update>

    <el-dialog title="请选择导出数据" :visible.sync="dateVisible" width="30%">
      <el-date-picker
        v-model="inOutValue"
        align="right"
        type="month"
        placeholder="选择导出月份"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dateVisible = false">取 消</el-button>
        <el-tooltip :disabled="inOutValueTip" content="月份不能为空" placement="top" effect="light">
          <el-button type="primary" @click="exportMonth">确 定</el-button>
        </el-tooltip>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { doOutput, downloadFile } from "../utils/util";
import { outputModel } from "../utils/models";
import { Message } from "element-ui";
import ElRow from "element-ui/packages/row/src/row";
import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
import ElCol from "element-ui/packages/col/src/col";
import params from "../classes/config.params";
import outputUpdate from "../components/OutputUpdate.vue";

export default {
  components: {
    ElCol,
    ElButton,
    ElRow,
    outputUpdate
  },
  data: function() {
    return {
      content: [],
      details: new Map(),
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageName: "",
      year: params.year,
      month: params.month,
      Ids: [],
      state: "",
      visible: false,
      rowIndex: [],
      dateValue: new Date(),
      inOutValue: "",
      centerDialogVisible: false,
      dateVisible: false,
      dataPut: {
        type: "update",
        row: {},
        visible: false
      },
      summary: {},
      pickerOptions: {
        disabledDate(date) {
          return date > Date.now();
        }
      }
    };
  },
  async created() {
    this.cutPage();
    this.summary = await this.$apis.output_total(this.month, this.year);
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
      name = this.pageName,
      year = this.year,
      month = this.month
    ) {
      let data = await this.$apis.output_get(page, pageSize, name, month, year);
      if (data) {
        this.content = doOutput(data.content);
        this.total = data.totalElements;
      }
      return data;
    },
    handleSelectionChange(e) {
      console.log("多选", e);
      let temp = [];
      e.forEach(item => {
        temp.push(item.produceId);
      });
      this.Ids = temp;
    },
    async openDetail(e) {
      console.log("详情", e);
      let data = await this.$apis.produce_detail(e.produceId);
    },
    async handleDelete(index, row) {
      let temp = [row.produceId];
      let data = await this.$apis.produce_delete(temp);
      if (data !== null) {
        this.cutPage();
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.produceTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.produceTable.clearSelection();
      }
    },
    async deleteProducts() {
      this.visible = false;
      if (this.Ids.length > 0) {
        let data = await this.$apis.produce_delete(this.Ids);
        if (data !== null) {
          this.cutPage();
        }
      } else {
        Message.info("没有删除项");
      }
    },
    async querySearchAsync(queryString, cb) {
      let data = await this.$apis.output_get(
        this.currentPage,
        this.pageSize,
        queryString,
        this.month,
        this.year
      );
      let temp = data.content.map(item => {
        return { value: item.outputProductName };
      });
      this.pageName = queryString;
      console.log(this.pageName);
      cb(temp);
    },
    selectName(item) {
      this.pageName = item.value;
      this.cutPage();
    },
    cellMouseEnter: function(e) {
      if (e.index % 2 === 0) {
        this.rowIndex = [parseInt(e.index) + 1, e.index];
      } else {
        //console.log(e.index)
        this.rowIndex = [parseInt(e.index) - 1, e.index];
      }
    },
    cellMouseLeave(e) {
      this.rowIndex = [];
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.rowIndex.indexOf(rowIndex) > -1) {
        //console.log(rowIndex)
        return "cover-row";
      }
    },
    changeDate(e) {},
    async clearDateData() {
      let data = await this.$apis.produce_delete_date(
        this.day,
        this.month,
        this.year
      );
      this.centerDialogVisible = false;
      this.cutPage();
    },
    handlePut(type, row) {
      this.dataPut = {
        type,
        row,
        visible: true
      };
    },
    async handleUpdate(data, tempForm) {
      this.dataPut = {
        type: "update",
        row: {},
        visible: false
      };
      let param = outputModel.get(data.variate);
      //console.log(form, param,data)
      let form = {
        outputId: tempForm.row.outputId,
        [param]: data.num
      };
      let res = await this.$apis.output_revise(form);
      this.cutPage();
      this.summary = await this.$apis.output_total(this.month, this.year);
      //console.log('收到 ',data, form)
    },
    async exportMonth() {
      if (this.inOutValue) {
        let date = new Date(this.inOutValue);
        let data = await this.$apis.output_file(
          date.getMonth() + 1,
          date.getFullYear()
        );
        console.log("导出", data);
        if (data.size > 0) {
          const blob = new Blob([data]);
          const fileName = `${date.getFullYear()}年${date.getMonth() +
            1}月产值数据`;
          downloadFile(fileName, blob);
        } else {
            Message.warning('当月无产值数据')
        }

        this.inOutValue = "";
        this.dateVisible = false;
      }
    },
    getSummaries(param) {
      console.log("合计 ", param);
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index, array) => {
        if (index === 1) {
          sums[1] = `${this.year}年${this.month}月`;
        } else if (index > 1 && index < array.length - 2) {
          if (
            column.property === "outputBaozhuangTotalPrice" ||
            column.property === "outputTedingTotalPrice"
          ) {
            sums[index] = "￥" + this.summary[column.property];
          } else {
            sums[index] = this.summary[column.property];
          }
        } else if (index === 0) {
          sums[0] = "合计";
        } else {
          sums[index] = "";
        }
      });
      return sums;
    }
  },
  watch: {
    currentPage: function(newVal, oldVal) {
      this.cutPage(newVal, this.pageSize);
    },
    pageSize: function(newVal, oldVal) {
      this.cutPage(this.currentPage, newVal);
    },
    async dateValue(newVal, oldVal) {
      let date = new Date(newVal);
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
      this.cutPage();
      this.summary = await this.$apis.output_total(this.month, this.year);
    }
  },
  computed: {
    clearTip() {
      return `${this.year}年${this.month}月${this.day}日`;
    },
    inOutValueTip() {
      return this.inOutValue ? true : false;
    }
  }
};
</script>