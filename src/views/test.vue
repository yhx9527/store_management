<style>
    .el-table .success-row {
        background: #f5f7fa;
    }

    .el-table__header tr>th {
        background: #f8f8f8 !important;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #dcdfe6;
        border-color: #dcdfe6;
    }

    .el-checkbox__input.is-focus .el-checkbox__inner {
        background-color: #dcdfe6;
        border-color: #dcdfe6;
    }
</style>
<template>
    <el-table ref="multipleTable" max-height="600" border :span-method="objectSpanMethod" :row-class-name="tableRowClassName"
              @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" :data="tableData" style="width: 80%;margin:0 auto;">
        <el-table-column prop="order_number" label="订单编号" width="200px" align="center">
        </el-table-column>
        <el-table-column label="商品名称" align="center">
            <template slot-scope="scope" width="160">
                <div @click="orderdetail(scope.row.order_number,scope.row.status)">
                    <div class="info">
                        <div>
                            <div>{{scope.row.clothing_name}}</div>
                        </div>
                    </div>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="买家账号" align="center">
            <template slot-scope="scope">
                <p>{{scope.row.username}}</p>
            </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180px" align="center">
            <template slot-scope="scope">
                <p>{{scope.row.addtime.split(" ")[0]}}</p>
                <p>{{scope.row.addtime.split(" ")[1]}}</p>
            </template>
        </el-table-column>
        <el-table-column label="商品价格" align="center">
            <template slot-scope="scope">
                <p>￥{{scope.row.price}}</p>
            </template>
        </el-table-column>
        <el-table-column prop="amount" label="数量" align="center">
        </el-table-column>
        <el-table-column label="订单状态" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.status==0">待付款</div>
                <div v-if="scope.row.status==1">待发货</div>
                <div v-if="scope.row.status==2">已发货</div>
                <div v-if="scope.row.status==3">交易成功</div>
                <div v-if="scope.row.status==4">已取消订单</div>
                <div v-if="scope.row.status==5">交易完成</div>
                <div v-if="scope.row.status==6">交易关闭</div>
                <div v-if="scope.row.status==7">处理中</div>
                <div v-if="scope.row.status==8">退款成功</div>
                <div v-if="scope.row.status==9">交易OK</div>
                <div v-if="scope.row.status==10">已取消订单</div>
            </template>
        </el-table-column>
        <el-table-column label="总计" align="center">
            <template slot-scope="scope">
                <p>￥{{scope.row.total}}</p>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
    export default {
        data(){
            return {
                tableData: [{
                    finish_time: "0",
                    id: 1054,
                    order_id: 688,
                    order_number: "1523948882.879873",
                    price: "36.00",
                    amount: 2,
                    clothing_id: 45,
                    status: "4",
                    total: "72.00",
                    address_id: 119,
                    user_id: 46,
                    addtime: "2018-04-17 15:08:02",
                    order_type: "2",
                    username: 17621509577,
                    clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                    classify_name: "男童上装"
                },
                    {
                        finish_time: "0",
                        id: 1038,
                        order_id: 660,
                        order_number: "1523859982.1010",
                        price: "36.00",
                        amount: 2,
                        clothing_id: 45,
                        status: "4",
                        total: "72.00",
                        address_id: 109,
                        user_id: 46,
                        addtime: "2018-04-16 14:26:22",
                        order_type: "2",
                        username: 17621509577,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 1030,
                        order_id: 635,
                        order_number: "1523603188.1010",
                        price: "36.00",
                        amount: 20,
                        clothing_id: 45,
                        status: "2",
                        total: "792.00",
                        address_id: 140,
                        user_id: 33,
                        addtime: "2018-04-13 15:06:29",
                        order_type: "2",
                        username: 17737536671,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "2018-04-13 15:07:42",
                        id: 1029,
                        order_id: 635,
                        order_number: "1523603188.1010",
                        price: "36.00",
                        amount: 2,
                        clothing_id: 45,
                        status: "7",
                        total: "792.00",
                        address_id: 140,
                        user_id: 33,
                        addtime: "2018-04-13 15:06:29",
                        order_type: "2",
                        username: 17737536671,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 1005,
                        order_id: 606,
                        order_number: "1523524708.1010",
                        price: "36.00",
                        amount: 2,
                        clothing_id: 45,
                        status: "4",
                        total: "72.00",
                        address_id: 109,
                        user_id: 46,
                        addtime: "2018-04-12 17:18:29",
                        order_type: "2",
                        username: 17621509577,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 1001,
                        order_id: 602,
                        order_number: "1523519854.659426",
                        price: "36.00",
                        amount: 2,
                        clothing_id: 45,
                        status: "4",
                        total: "72.00",
                        address_id: 109,
                        user_id: 46,
                        addtime: "2018-04-12 15:57:34",
                        order_type: "2",
                        username: 17621509577,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 988,
                        order_id: 545,
                        order_number: "1523326439.745645",
                        price: "36.00",
                        amount: 1,
                        clothing_id: 45,
                        status: "4",
                        total: "36.00",
                        address_id: 140,
                        user_id: 33,
                        addtime: "2018-04-10 10:13:59",
                        order_type: "2",
                        username: 17737536671,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 986,
                        order_id: 543,
                        order_number: "1523286363.197641",
                        price: "36.00",
                        amount: 3,
                        clothing_id: 45,
                        status: "4",
                        total: "108.00",
                        address_id: 109,
                        user_id: 46,
                        addtime: "2018-04-09 23:06:03",
                        order_type: "2",
                        username: 17621509577,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "2018-04-17 11:01:42",
                        id: 970,
                        order_id: 530,
                        order_number: "1523245914.1010",
                        price: "36.00",
                        amount: 1,
                        clothing_id: 45,
                        status: "5",
                        total: "108.00",
                        address_id: 140,
                        user_id: 33,
                        addtime: "2018-04-09 11:51:54",
                        order_type: "2",
                        username: 17737536671,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "2018-04-17 11:07:07",
                        id: 969,
                        order_id: 530,
                        order_number: "1523245914.1010",
                        price: "36.00",
                        amount: 2,
                        clothing_id: 45,
                        status: "5",
                        total: "108.00",
                        address_id: 140,
                        user_id: 33,
                        addtime: "2018-04-09 11:51:54",
                        order_type: "2",
                        username: 17737536671,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 907,
                        order_id: 428,
                        order_number: "1522755736.123802",
                        price: "36.00",
                        amount: 1,
                        clothing_id: 45,
                        status: "10",
                        total: "36.00",
                        address_id: 140,
                        user_id: 33,
                        addtime: "2018-04-03 19:42:16",
                        order_type: "2",
                        username: 17737536671,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 884,
                        order_id: 405,
                        order_number: "1522749320.739114",
                        price: "36.00",
                        amount: 1,
                        clothing_id: 45,
                        status: "10",
                        total: "36.00",
                        address_id: 140,
                        user_id: 33,
                        addtime: "2018-04-03 17:55:20",
                        order_type: "2",
                        username: 17737536671,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 823,
                        order_id: 366,
                        order_number: "1522659064.1010",
                        price: "36.00",
                        amount: 2,
                        clothing_id: 45,
                        status: "4",
                        total: "2104.00",
                        address_id: 137,
                        user_id: 63,
                        addtime: "2018-04-02 16:51:04",
                        order_type: "2",
                        username: 17737536677,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    },
                    {
                        finish_time: "0",
                        id: 820,
                        order_id: 365,
                        order_number: "1522658505.1010",
                        price: "36.00",
                        amount: 3,
                        clothing_id: 45,
                        status: "4",
                        total: "2260.00",
                        address_id: 137,
                        user_id: 63,
                        addtime: "2018-04-02 16:41:45",
                        order_type: "2",
                        username: 17737536677,
                        clothing_name: "象汉姆童装vc小象汉姆童装vc小象汉姆童装vc",
                        classify_name: "男童上装"
                    }
                ],
                rowIndex: '-1',
                OrderIndexArr: [],
                hoverOrderArr: []
            }

        },
        mounted: function () {
            this.getOrderNumber()
        },
        methods: {
            // 获取相同编号的数组
            getOrderNumber: function () {
                var OrderObj = {}
                this.tableData.forEach(function (element, index) {
                    element.rowIndex = index
                    if (OrderObj[element.order_number]) {
                        OrderObj[element.order_number].push(index)
                    } else {
                        OrderObj[element.order_number] = []
                        OrderObj[element.order_number].push(index)
                    }
                }, this);

                for (var k in OrderObj) {
                    if (OrderObj[k].length > 1) {
                        this.OrderIndexArr.push(OrderObj[k])
                    }
                }
            },

            // 合并单元格
            objectSpanMethod: function ({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0 || columnIndex === 3 || columnIndex === 4 || columnIndex === 7 || columnIndex === 8 || columnIndex === 9) {
                    for (var i = 0; i < this.OrderIndexArr.length; i++) {
                        var element = this.OrderIndexArr[i]
                        for (var j = 0; j < element.length; j++) {
                            var item = element[j]
                            if (rowIndex == item) {
                                if (j == 0) {
                                    return {
                                        rowspan: element.length,
                                        colspan: 1
                                    }
                                } else if (j != 0) {
                                    return {
                                        rowspan: 0,
                                        colspan: 0
                                    }
                                }
                            }
                        }
                    }
                }
            },

            tableRowClassName: function ({row, rowIndex}) {
                var arr = this.hoverOrderArr
                for (var i = 0; i < arr.length; i++) {
                    if (rowIndex == arr[i]) {
                        return 'success-row'
                    }
                }
            },

            cellMouseEnter: function (row, column, cell, event) {
                console.log('row', row)
                this.rowIndex = row.rowIndex
                this.hoverOrderArr = []
                this.OrderIndexArr.forEach(function (element) {
                    if (element.indexOf(this.rowIndex) >= 0) {
                        this.hoverOrderArr = element
                    }
                }, this);
            },

            cellMouseLeave: function (row, column, cell, event) {
                this.rowIndex = '-1'
            }
        }
    }
</script>