<style scoped>
    .upload{

    }
    .file{
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<template>
    <div>
            <el-upload
                    class="upload"
                    drag
                    name="multipartFile"
                    :action="actions"
                    multiple
                    :headers="headers"
                    :on-success="handleSuccess">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将{{title}}拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
            </el-upload>
    </div>
</template>

<script>
    import ElRow from "element-ui/packages/row/src/row";
    import { Message } from 'element-ui';
    import {apiDomain} from '../config.js'
    export default {
        components: {ElRow},
        data: function () {
            return {
                headers: {
                    Authorization: 'Bearer ' + this.$store.state.token
                },
            }
        },
        computed: {
          title(){
              if(this.$route.params.name==='product'){
                  return '产品文件'
              }
              return '进度文件'
          },
          actions(){
              if(this.$route.params.name==='product'){
                  return apiDomain + '/product/import'
              }
              return apiDomain + '/produce/import/excel'
          }
        },
        methods: {
            handleSuccess(req) {
                console.log('file', req)
                if(req.status === 0) {
                    Message.success('文件上传成功')
                } else {
                    let msg = req.msg || '文件上传失败，请检查后重试'
                    Message.error(msg)
                }
            }
        },
        mounted(){
        }
    }
</script>