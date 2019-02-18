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
          type="primary"
          @click="handleForm"
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
        >
          添加进度
          <i class="el-icon-circle-plus el-icon--right"></i>
        </el-button>
        <el-dropdown @command="dateFile" v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'">
          <el-button type="primary" style="margin-left: 20px;">
            导入/导出
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="dbIn">数据库导入</el-dropdown-item>
            <el-dropdown-item divided command="fileOut">导出进度</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="8">
        <span class="demonstration">每日进度</span>
        <el-date-picker
          v-model="dateValue"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          @change="changeDate"
        ></el-date-picker>
      </el-col>
      <el-col :span="8" style="text-align: right;">
        <el-autocomplete
          v-model="state"
          placeholder="请输入要搜索的进度"
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

      ref="produceTable"
      empty-text="暂无数据"
      :summary-method="getSummaries"
      show-summary
      @selection-change="handleSelectionChange"
      max-height="580"
    >
      <el-table-column type="selection" width="55" fixed></el-table-column>
      <el-table-column
        prop="produceProductName"
        label="产品名称"
        align="center"
        fixed
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column label="基础信息" align="center">
        <el-table-column prop="produceXiadan" label="下单量" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" :disabled="!scope.row['produceXiadanComment']">
              <template v-for="remark in doRemark(scope.row['produceXiadanComment'])">
                <p>{{remark}}</p>
              </template>
              <div slot="reference" class="name-wrapper">
                <span>{{scope.row['produceXiadan']}}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="produceMugong" label="木工数" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" :disabled="!scope.row['produceMugongComment']">
              <template v-for="remark in doRemark(scope.row['produceMugongComment'])">
                <p>{{remark}}</p>
              </template>
              <div slot="reference" class="name-wrapper">
                <span>{{scope.row['produceMugong']}}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="produceYoufang" label="油房" align="center">
         <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceYoufangComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceYoufangComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceYoufang']}}</span></div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="普通款" align="center">
        <el-table-column prop="produceBaozhuang" label="包装" align="center">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceBaozhuangComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceBaozhuangComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceBaozhuang']}}</span></div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="produceBeijing" label="北京" align="center">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceBeijingComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceBeijingComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceBeijing']}}</span></div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="定制款" align="center">
        <el-table-column prop="produceTeding" label="特定" align="center">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceTedingComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceTedingComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceTeding']}}</span></div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="produceBeijingteding" label="北京特定" align="center">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceBeijingtedingComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceBeijingtedingComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceBeijingteding']}}</span></div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="合同信息" align="center">
        <el-table-column prop="produceBendihetong" label="本地合同" align="center">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceBendihetongComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceBendihetongComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceBendihetong']}}</span></div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="produceWaidihetong" label="外地合同" align="center">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceWaidihetongComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceWaidihetongComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceWaidihetong']}}</span></div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- <el-table-column prop="produceDeng" label="等待" align="center">
        <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              :disabled="!scope.row['produceDengComment']"
            >
              <template v-for="remark in doRemark(scope.row['produceDengComment'])">
                <p>{{remark}}</p>
              </template>
              <div
                slot="reference"
                class="name-wrapper"
              ><span>{{scope.row['produceDeng']}}</span></div>
            </el-popover>
          </template>
      </el-table-column> -->
      <!-- <el-table-column  label="总合同" align="center">
        <template slot-scope="scope">
            <span>{{parseInt(scope.row['produceWaidihetong'])+parseInt(scope.row['produceBendihetong'])}}</span>
          </template>
      </el-table-column> -->
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
            <el-col :span="24">
              <el-button
                size="mini"
                type="success"
                @click="handlePut('update',scope.row)"
                :disabled="ifUpdate"
              >更 新</el-button>
            </el-col>
            <el-col :span="24" style="margin-top: 5px">
              <el-button size="mini" type="primary" @click="handlePut('modify',scope.row)">修 正</el-button>
            </el-col>
            <el-col :span="24" style="margin-top: 5px">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                :disabled="ifRevise"
              >删 除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-between" style="margin-top: 30px;">
      <div>
        <el-popover placement="top" width="160" v-model="visible">
          <p>{{Ids.length > 0 ? '您确定要删除所选的这些产值吗？' : '请先选择要删除的产值'}}</p>
          <div style="text-align: right; margin: 0" v-if="Ids.length>0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="deleteProducts">确定</el-button>
          </div>
          <div style="text-align: right; margin: 0" v-else>
            <el-button size="mini" type="primary" @click="visible = false">确定</el-button>
          </div>
          <el-button
            slot="reference"
            type="warning"
            v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
          >删除所选项</el-button>
        </el-popover>
        <el-button
          @click="toggleSelection()"
          style="margin-left: 30px;"
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
        >取消选择</el-button>
        <el-button
          @click="centerDialogVisible=true"
          style="margin-left: 30px;"
          type="danger"
          v-if="$store.getters.getUserInfo.userInfoRoles !== 'USER'"
        >清空该日数据</el-button>
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
    <el-dialog title="注意" :visible.sync="centerDialogVisible" width="30%">
      <span>是否清空{{clearTip}}的数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clearDateData">确 定</el-button>
      </span>
    </el-dialog>
    <produce-update :dataPut="dataPut" @update="handleUpdate"></produce-update>

    <el-dialog
      :title="dateVisible===1 ? '请选择导入数据' : '请选择导出数据'"
      :visible.sync="dateVisible1"
      width="30%"
      :show-close="false"
    >
      <el-date-picker
        v-model="inOutValue"
        align="right"
        type="date"
        :placeholder="dateVisible===1 ? '选择导入日期' : '选择导出日期'"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dateVisible = 0">取 消</el-button>
        <el-tooltip :disabled="inOutValueTip" content="日期不能为空" placement="top" effect="light">
          <el-button type="primary" @click="dbImport">确 定</el-button>
        </el-tooltip>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dateParse, roleTrans, doProduce, downloadFile } from "../utils/util";
import { produceModel } from "../utils/models";
import { Message } from "element-ui";
import ElRow from "element-ui/packages/row/src/row";
import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
import ElCol from "element-ui/packages/col/src/col";
import params from "../classes/config.params";
import ProduceUpdate from "../components/produceUpdate.vue";

export default {
  components: {
    ElCol,
    ElButton,
    ElRow,
    ProduceUpdate
  },
  data: function() {
    return {
      content: [],
      remarks: ["1232131", "1231231231231", "sdafdafdadfdfsfsdfdfsfsd"],
      details: new Map(),
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageName: "",
      year: params.year,
      month: params.month,
      day: params.day,
      Ids: [],
      state: "",
      visible: false,
      rowIndex: [],
      dateValue: new Date(),
      inOutValue: "",
      centerDialogVisible: false,
      dateVisible: 0,
      ifUpdate: false,
      ifRevise: false,
      dataPut: {
        type: "update",
        row: {},
        visible: false
      },
      summary: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      doRemark(data) {
        return data ? data.split("###") : [];
      }
    };
  },
  async created() {
    this.cutPage();
    this.summary = await this.$apis.produce_total(
      this.day,
      this.month,
      this.year
    );
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 12, 13].includes(columnIndex)) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
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
      month = this.month,
      day = this.day
    ) {
      let data = await this.$apis.produce_get(
        page,
        pageSize,
        name,
        day,
        month,
        year
      );
      if (data) {
        this.content = doProduce(data.content);
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
    handleDelete(index, row) {
      this.$confirm(
        "此操作将删除产品 " + row.produceProductName + " 的进度, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          let temp = [row.produceId];
          let data = await this.$apis.produce_delete(temp);
          if (data !== null) {
            this.cutPage();
          }
        })
        .catch(() => {});
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
      let data = await this.$apis.produce_get(
        this.currentPage,
        this.pageSize,
        queryString,
        this.day,
        this.month,
        this.year
      );
      let temp = data.content.map(item => {
        return { value: item.produceProductName };
      });
      this.pageName = queryString;
      console.log(this.pageName);
      cb(temp);
    },
    selectName(item) {
      this.pageName = item.value;
      this.cutPage();
    },
    handleForm() {
      this.$router.push({ name: "produce-add" });
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
      let param = produceModel.get(data.variate);
      console.log('传过来', data)
      let form = {
        produceId: tempForm.row.produceId,
        [param]: data.num,
        [`${param}Comment`]: data.comment
      };
      if (tempForm.type === "update") {
        if (
          (data.variate === "北京" || data.variate === "北京特定") &&
          data.switch
        ) {
          console.log('北京')
          let res = await this.$apis.produce_output(form);
        } else if(
          (data.variate === "包装量" || data.variate === "特定量") &&
          data.switch1) {
            console.log('等待接口')
          let res = await this.$apis.produce_output(form);
        } else {
          console.log('包装', data)
          let res = await this.$apis.produce_update(form);
        }
      } else {
        let res = await this.$apis.produce_revice(form);
      }
      this.cutPage();
      this.summary = await this.$apis.produce_total(
        this.day,
        this.month,
        this.year
      );
      //console.log('收到 ',data, form)
    },
    dateFile(e) {
      if (e === "dbIn") {
        this.dateVisible = 1;
      } else if (e === "fileOut") {
        this.dateVisible = 2;
      }
    },
    async dbImport() {
      if (this.inOutValue) {
        let date = new Date(this.inOutValue);
        if (this.dateVisible === 1) {
          let data = await this.$apis.produce_today(
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear()
          );
          this.inOutValue = "";
          this.cutPage();
        } else if (this.dateVisible === 2) {
          let data = await this.$apis.produce_date(
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear()
          );
          //console.log("导出", data)
          const blob = new Blob([data]);
          const fileName = `${date.getFullYear()}年${date.getMonth() +
            1}月${date.getDate()}日进度数据`;
          downloadFile(fileName, blob);
          this.inOutValue = "";
        }
        this.dateVisible = 0;
      }
    },
    getSummaries(param) {
      console.log("合计 ", param);
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index, array) => {
        if (index === 1) {
          sums[1] = `${this.year}年${this.month}月${this.day}日`;
        } else if (index > 1 && index < array.length - 2) {
          sums[index] = this.summary[column.property];
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
      this.summary = await this.$apis.produce_total(
        this.day,
        this.month,
        this.year
      );
      if (date.valueOf() + 24 * 60 * 60 * 1000 < Date.now()) {
        this.ifUpdate = true;
        this.ifRevise = true;
      } else {
        this.ifUpdate = false;
        this.ifRevise = false;
      }
    }
  },
  computed: {
    dateVisible1() {
      return Boolean(this.dateVisible);
    },
    clearTip() {
      return `${this.year}年${this.month}月${this.day}日`;
    },
    inOutValueTip() {
      return this.inOutValue ? true : false;
    }
  }
};
</script>