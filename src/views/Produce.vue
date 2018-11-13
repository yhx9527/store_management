<style>
    .el-table .cover-row {
        background: #ecf5ff;
    }
</style>
<template>
    <div>
        <el-row type="flex" style="margin-bottom: 30px;">
            <el-col :span="8" style="text-align: left">
                <el-button type="primary" @click="handleForm">添加产值<i class="el-icon-circle-plus el-icon--right"></i></el-button>
            </el-col>
            <el-col :span="12" :offset="4">
                <el-autocomplete
                        v-model="state"
                        placeholder="请输入要搜索的产值"
                        clearable
                        prefix-icon="el-icon-search"
                        @select="selectName"
                        select-when-unmatched
                ></el-autocomplete>
            </el-col>
        </el-row>

        <el-table :data="content"
                  tooltip-effect="dark"
                  :span-method="objectSpanMethod"
                  style="width: 100%"
                  ref="produceTable"
                  empty-textv="暂无数据"
                  :row-class-name="tableRowClassName"
                  @cell-mouse-enter="cellMouseEnter"
                  @cell-mouse-leave="cellMouseLeave"
                  @selection-change="handleSelectionChange"
                  @expand-change="openDetail"
                 >
            <el-table-column
                    type="selection"
                    width="55"
                    fixed>
            </el-table-column>
            <el-table-column
                    prop="produceProductName"
                    label="产品名称"  align="center"
                    fixed show-overflow-tooltip
                    width="150">
            </el-table-column>
            <el-table-column label="基础信息" align="center">
                <el-table-column
                        prop="produceXiadan"
                        label="下单量" show-overflow-tooltip>
                </el-table-column >
                <el-table-column
                        prop="produceMugong"
                        label="木工数" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="produceYoufang"
                        label="油房" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="produceBaozhuang"
                        label="包装" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="produceBeijing"
                        label="北京" show-overflow-tooltip>
                </el-table-column>
            </el-table-column>
            <el-table-column label="特定信息"  align="center">
                <el-table-column
                        prop="produceTeding"
                        label="特定" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="produceBeijingteding"
                        label="北京特定" show-overflow-tooltip>
                </el-table-column>
            </el-table-column>
            <el-table-column label="合同信息"  align="center">
                <el-table-column
                        prop="produceBendihetong"
                        label="本地合同" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="produceWaidihetong"
                        label="外地合同" show-overflow-tooltip>
                </el-table-column>
            </el-table-column>
            <el-table-column
                    prop="produceDeng"
                    label="等待"  align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    label="最近修改"
                    width="220"  align="center">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"  align="center" fixed="right">
                <template slot-scope="scope">
                    <el-row>
                        <el-col :span="24" style="margin-bottom: 5px">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        </el-col>
                        <el-col :span="24" style="margin-top: 5px">
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </el-col>
                    </el-row>

                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="space-between" style="margin-top: 30px;">
            <div >
                <el-popover
                        placement="top"
                        width="160"
                        v-model="visible">
                    <p>{{Ids.length > 0 ? '您确定要删除所选的这些产值吗？' : '请先选择要删除的产值'}}</p>
                    <div style="text-align: right; margin: 0" v-if="Ids.length>0">
                        <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteProducts">确定</el-button>
                    </div>
                    <div style="text-align: right; margin: 0" v-else>
                        <el-button size="mini" type="primary" @click="visible = false">确定</el-button>
                    </div>
                    <el-button slot="reference" type="danger">删除所选项</el-button>
                </el-popover>
                <el-button @click="toggleSelection()" style="margin-left: 30px;">取消选择</el-button>
            </div>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    background>
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
    import {dateParse,roleTrans,doProduce} from '../utils/util'
    import {Message} from 'element-ui'
    import ElRow from "element-ui/packages/row/src/row";
    import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {
            ElCol,
            ElButton,
            ElRow},
        data: function () {
            return {
                content: [],
                details: new Map(),
                currentPage: 1,
                pageSize: 10,
                total: 0,
                pageName: '',
                Ids: [],
                state: '',
                visible: false,
                rowIndex:[]
            }
        },
        async created() {
            this.cutPage()
        },
        methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if ([0,12,13].includes(columnIndex)) {
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
                this.pageSize =  val
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val
                console.log(`当前页: ${val}`);
            },
            async cutPage(page=this.currentPage, pageSize=this.pageSize, name=this.pageName){
                let data = await this.$apis.produce_get(page, pageSize, name)
                if (data) {
                    this.content = doProduce(data.content)
                    this.total = data.totalElements
                }
                return data
            },
            handleSelectionChange(e) {
                console.log('多选',e)
                let temp = []
                e.forEach(item=>{
                    temp.push(item.produceId)
                })
                this.Ids = temp
            },
            async openDetail(e) {
                console.log('详情',e)
                let data = await this.$apis.produce_detail(e.produceId)

            },
            handleEdit(index, row){
                this.$router.push({name: 'userForm', params: {userInfo: row,userInfoId: row.userInfoId}})
            },
            async handleDelete(index, row){
                let temp = [row.produceId]
                let data = await this.$apis.produce_delete(temp)
                if(data !== null){
                    this.cutPage()
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
            async deleteProducts(){
                this.visible = false
                if (this.Ids.length > 0){
                    let data = await this.$apis.produce_delete(this.Ids)
                    if(data !== null){
                        this.cutPage()
                    }
                } else {
                    Message.info('没有删除项')
                }
            },
            async querySearchAsync(queryString,cb) {
                let data = await this.$apis.produce_get(this.currentPage, this.pageSize, queryString)
                let temp = data.content.map(item=>{
                    return {value: item.produceName}
                })
                this.pageName = queryString
                console.log(this.pageName)
                cb(temp)
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            selectName(item){
                this.pageName = item.value
                this.cutPage()
            },
            handleForm(){
                this.$router.push({name: 'userForm'})
            },
            cellMouseEnter: function(e){
                if(e.index%2 === 0){
                    this.rowIndex = [parseInt(e.index) + 1, e.index]
                } else {
                    //console.log(e.index)
                    this.rowIndex = [parseInt(e.index) - 1, e.index]
                }
            },
            cellMouseLeave(e){
                this.rowIndex = []
            },
            tableRowClassName({row, rowIndex}){
                if(this.rowIndex.indexOf(rowIndex) > -1){
                    //console.log(rowIndex)
                    return 'cover-row'
                }
            }
        },
        watch: {
            currentPage: function (newVal, oldVal) {
                this.cutPage(newVal, this.pageSize)
            },
            pageSize: function (newVal, oldVal) {
                this.cutPage(this.currentPage, newVal)
            }
        },
        computed: {
        }
    }
</script>