<style >
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.upload {
  text-align: left;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.box-card {
  margin-top: 20px;
}
.dels {
  float: left;
  margin-top: 10px;
}
.tableImg {
  transform: scale(1); /*图片原始大小1倍*/
  transition: all ease 0.5s;
} /*图片放大所用时间*/
.tableImg:hover {
  transform: scale(3);
  position: relative;
  z-index: 100;
}
.el-table .cell {
  overflow: visible;
}
.el-table__body-wrapper {
  overflow: visible;
}
.el-table--fit {
  overflow: visible;
}
</style>
<template>
  <div>
    <el-carousel :interval="5000" type="card" height="300px">
      <el-carousel-item v-for="item in images" :key="item">
        <div @click="handlePicturePreview(item)" style="height:100%;width:100%;">
          <img :src="item" height="100%" width="100%">
        </div>
      </el-carousel-item>
    </el-carousel>
    <el-row>
      <el-button type="danger" round @click="dialogDel = true" class="dels">批量删除</el-button>
    </el-row>
    <el-card
      class="box-card"
      v-loading="loading"
      element-loading-text="拼命上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div slot="header" class="clearfix">
        <el-button
          style="float: left; padding: 3px 0; color: #f56c6c;"
          type="text"
          @click="clear"
        >清空</el-button>
        <span class="title">{{product.productName}}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="submitUpload">上传服务器</el-button>
      </div>
      <el-upload
        :action="action"
        list-type="picture-card"
        ref="upload"
        :headers="headers"
        :data="data"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-change="handleFile"
        :on-remove="handleRemove"
        :auto-upload="false"
        name="multipartFile"
        multiple
        :file-list="fileList"
        class="upload"
      >
        <div slot="tip" class="el-upload__tip">每张图片大小不超过2M，每次上传大小不超过10M</div>
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
      <span slot="footer" class="dialog-footer">
        <el-button type @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="delSinglePic(dialogImageUrl)" :loading="singleLoading">删 除</el-button>
      </span>
    </el-dialog>

    <el-dialog title="产品图片" :visible.sync="dialogDel">
      <el-table
        ref="picTable"
        :data="images"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="()=>{return !delLoading}"></el-table-column>
        <el-table-column label="图片" align="center" header-align="center">
          <template slot-scope="scope">
            <img :src="scope.row" width="100" height="100" class="tableImg">
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;text-align: left;">
        <el-popover placement="top" width="160" v-model="visible">
          <p>{{Ids.length > 0 ? '您确定要删除所选的这些图片吗？' : '请先选择要删除的图片'}}</p>
          <div style="text-align: right; margin: 0" v-if="Ids.length>0">
            <el-button size="mini" type="text" @click="visible = false">取 消</el-button>
            <el-button type="primary" size="mini" @click="delPic" :loading="delLoading">确 定</el-button>
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
        <!-- <el-button @click="delPic" type="danger">删除所选项</el-button> -->
        <el-button @click="toggleSelection()" style="margin-left: 10px;">取消选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {apiDomain, imgDomain} from '../config.js'

export default {
  data() {
    return {
      images: [],
      productId: "",
      product: {},
      headers: {
        Authorization: "Bearer " + this.$store.state.token
      },
      data: {},
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogDel: false,
      Ids: [],
      visible: false,
      loading: false,
      delLoading: false,
      time1: '',
      time2: '',
      singleLoading: false,
      action: apiDomain+'/product/pictures'
    };
  },
  async created() {
    console.log("route", this.$route);
    //this.product = this.$route.params.product;
    this.productId = this.$route.params.productId;
    this.data = { productId: this.productId };
    this.fresh(this.productId);
  },
  methods: {
    async fresh(productId) {
      let data = await this.$apis.product_detail(this.productId);
      this.product = data;
      if (data.productImg) {
        let images = data.productImg.split(",");
        images.forEach((item, index, arr) => {
          arr[index] = `${imgDomain}/${item}`;
        });
        this.images = images;
      } else {
        this.images = [];
      }
    },
    handleSuccess(e) {
      if (e.status === 0) {
        this.$message.success("图片上传成功");
        this.fresh(this.productId);
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleError(error) {
      if (error) {
        switch (error.status) {
          case 500:
            Message.error("服务器异常");
            break;
          case 400:
            Message.warning("请求无效");
            break;
          case 401:
            this.$store.commit("clear");
            router.replace({ name: "login" });
            Message.warning("登录过期,请重新登录");
            break;
          case 403:
            Message.error("拒绝访问");
            break;
          case 404:
            Message.warning("找不到页面");
            break;
          case 502:
            Message.info("服务器升级中...");
            break;
        }
      }
    },
    async submitUpload() {
      //this.$refs.upload.submit();
      if (this.fileList.length > 0) {
        this.loading = true;
        let fileList = this.fileList.map(item => {
          return item.raw;
        });
        console.log("文件", fileList);
        let data = await this.$apis.product_post_photo(
          this.productId,
          fileList
        );
        if (!data) {
          this.fileList = [];
        }
        this.loading = false;
        this.fresh(this.productId);
      }
    },
    clear() {
      this.fileList = [];
    },
    handlePicturePreview(file) {
      console.log("hhhhh", file);
      this.dialogVisible = true;
      this.dialogImageUrl = file;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.picTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.picTable.clearSelection();
      }
    },
    handleSelectionChange(e) {
      console.log("多选", e);
      let temp = [];
      e.forEach(item => {
        temp.push(item.split("/")[3]);
      });
      this.Ids = temp;
    },
    async delPic() {
      if (this.Ids.length > 0) {
        this.delLoading = true;
        let data = await this.$apis.product_delete_photo(
          this.productId,
          this.Ids
        );
        this.delLoading = false;
        this.visible = false;

        if (!data) {
          this.fresh(this.productId);
        }
      } else {
        this.delLoading = false;
        Message.info("没有删除项");
      }
    },
    async delSinglePic(img) {
      let file = img.split("/")[3];
      this.singleLoading = true;
      let data = await this.$apis.product_delete_photo(this.productId, [file]);
      this.singleLoading = false;
      this.dialogVisible = false;
      this.fresh(this.productId);
    },
    handleFile(file, fileList) {
      console.log("文件列表", fileList);
      if (file.size > 2 * 1024 * 1024) {
        fileList.pop();
        console.log("过滤掉2m以上");
        this.debounceShow('已过滤掉超过2M的图片', 'time1')
      }
      while (this.calcuSize(fileList) > 10 * 1024 * 1024) {
        fileList.pop();
        console.log("限制10m");
        this.debounceShow('图片总大小超过10M的部分已过滤', 'time2')
      }
      this.fileList = fileList;
    },
    calcuSize(fileList) {
      let sum = 0;
      if (fileList.length > 0) {
        fileList.reduce((sum, item) => {
          return parseInt(sum.size) + parseInt(item.size);
        });
      }
      return sum;
    },
    debounceShow(text, time) {
      const that = this;
      if(this[time]) {
        clearTimeout(this[time])
      }
      this[time] = setTimeout(function() {
        that.$notify({
          type: "warning",
          title: "注意",
          message: text,
          position: "bottom-left"
        });
      });
    },
    handleRequest(a, b) {
      console.log("自定义", a, b);
    }
    // previewPic(img) {
    //    const h = this.$createElement;
    //     this.$msgbox({
    //       title: '图片预览',
    //       message: h('img', {
    //         attrs: {
    //           src: img,
    //           width: '100vw'
    //         }
    //       }),
    //       showCancelButton: true
    //     }).then(action => {
    //     });
    // }
  }
};
</script>
