<style scoped>

</style>
<template>
    <div>
        <div class="m-pagi">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                content: new Map(),
                currentPage: 1,
                pageSize: 20,
                total: 0
            }
        },
        async created() {
            this.cutPage()
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize =  val
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val
                console.log(`当前页: ${val}`);
            },
            async cutPage(page=1, pageSize, name){
                let data = await this.$apis.produce_get(page, pageSize, name)
                if (data) {
                    let content = Array.from(data.content, function (item) {
                        return [item.productId, item]
                    })
                    //console.log('map ',content)
                    this.content = new Map(content)
                    this.total = data.totalElements
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
        }
    }
</script>