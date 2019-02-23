import paramsConfig from './config.params'
import axios from 'axios'
import {
    Message
} from 'element-ui'
import {
    Notification
} from 'element-ui';
import store from '../store'
import router from '../router'
import {apiDomain} from '../config'
const qs = require('qs')

class Interface {
    constructor() {
        let that = this
        axios.defaults.baseURL = apiDomain
        axios.defaults.timeout = 15000
        axios.defaults.ifIntercept = true
        axios.defaults.maxContentLength = Infinity
        //axios.defaults.headers.Authorization = 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InRlc3QiLCJ1c2VyVHJ1ZU5hbWUiOiJ6enoiLCJ1c2VySWQiOjEsImlzcyI6ImluZm8iLCJleHAiOjE1NDE5MTcwNjd9.BnvKzbi9Nanv_mDwfyroD167jZhXTwfls8Apj9BwxPU'
        axios.interceptors.response.use(function (response) {
            console.log(response)
            if (response.config.ifIntercept) {
                if (response.data.status === 0) {
                    if (response.config.method !== 'get') {
                        console.log('msg   ', response.config.msg)
                        Message.success(response.config.msg || '操作成功')
                    }
                    return response.data.data
                } else {
                    if (response.config.method !== 'get') {
                        console.log('上传', response.data.msg)
                        Message.warning(response.data.msg)
                    }
                    if (response.data instanceof Blob) {
                        return response.data
                    }
                    return null
                }
            } else {
                if (response.data.status === 0) {
                    return response.data.data
                } else {
                    return response.data.msg
                }
            }
        }, function (error) {
            console.log('错误了', error.resolve)
            if (error.response) {
                that.errorHandle(error.response)
            } else {
                console.log('error', JSON.stringify(error))
                Notification({
                    title: '网络错误',
                    message: '您的网络连接超时，请检查网络',
                    position: 'top-left',
                    type: 'error'
                })
            }

        })
    }

    /**
     * api接口异常处理
     */
    errorHandle(error) {
        if (error) {
            switch (error.status) {
                case 500:
                    Message.error('服务器异常')
                    break;
                case 400:
                    Message.warning('请求无效')
                    break;
                case 401:
                    store.commit('clear')
                    router.replace({
                        name: 'login'
                    })
                    Message.warning('登录过期,请重新登录')
                    break;
                case 403:
                    Message.error('拒绝访问')
                    break;
                case 404:
                    Message.warning('找不到页面')
                    break;
                case 502:
                    Message.info('服务器升级中...')
                    break;
            }
        }

    }

    /**
     * user-controller 用户信息管理
     */
    user_login(form) {
        let temp = qs.stringify(form)
        // console.log(JSON.stringify(form),temp)
        return new Promise((resolve, reject) => {
            axios.post('/login', temp, {msg: '登录成功'}).then(data => {
                if (data) {
                    axios.defaults.headers.Authorization = `Bearer ${data.token}`
                }
                resolve(data)
            })
        })
    }
    // 获取用户信息列表
    user_get(pageNum = 1, pageSize = paramsConfig.userPageSize, userTrueName = '') {
        let params = {
            pageNum: pageNum,
            userTrueName: userTrueName,
            pageSize: pageSize
        }
        return axios.get('/user', {
            params: params
        })
    }
    // 添加新用户
    user_add(userInfo) {
        return axios.post('/user', userInfo, {msg: '新用户添加成功'})
    }
    // 管理员更新用户用户信息
    user_update(userInfo) {
        return axios.put('/user/admin', userInfo, {msg: '用户信息更新成功'})
    }
    // 用户更新自己的信息
    user_other_update(userInfo) {
        return axios.put('/user/other', userInfo, {msg: '本人信息更新成功'})
    }
    // 删除用户
    user_delete(userIds) {
        return axios.delete('/user', {
            params: {
                userIds: userIds
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, {
                    arrayFormat: 'brackets'
                })
            },
            msg: '用户删除成功'
        },
        {
            msg: '用户删除成功'
        })
    }
    // 检查用户名是否可用
    user_check_name(username) {
        return axios.get('/user/check', {
            params: {
                username: username
            }
        })
    }
    // 修改密码
    user_change_pwd(newPass, oldPass) {
        return axios.put('/user/pass', qs.stringify({
            newPass: newPass,
            oldPass: oldPass
        }), {
            msg: '密码修改成功，请重新登录'
        })
    }
    // 重置密码
    user_reset_pwd(userInfoId, pass = '123456') {
        return axios.post('/user/reset', qs.stringify({
            userInfoId: userInfoId,
            pass: pass
        }), {
            msg: '用户密码重置成功'
        })
    }

    /**
     * output-controller 产值管理api
     */
    // 获取产值
    output_get(pageNum = 1,
        pageSize = paramsConfig.outputPageSize,
        productName = '',
        month = paramsConfig.month,
        year = paramsConfig.year) {
        let params = {
            pageNum: pageNum,
            productName: productName,
            year: year,
            month: month,
            pageSize: pageSize
        }
        return axios.get('/output', {
            params: params
        })
    }
    //错误修正
    output_revise(output) {
        return axios.put('/output', output, {msg: '产值修正成功'})
    }
    //导出文件
    output_file(month = paramsConfig.month, year = paramsConfig.year) {
        return axios.get('/output/export', {
            params: {
                month: month,
                year: year
            },
            responseType: 'blob'
        })
    }
    //产值合计
    output_total(month = paramsConfig.month, year = paramsConfig.year) {
        return axios.get('/output/total', {
            params: {
                month: month,
                year: year
            }
        })
    }

    /**
     * produce-controller 生产进度管理
     */
    //获取生产进度列表
    produce_get(pageNum = 1,
        pageSize = paramsConfig.producePageSize,
        productName = '',
        day,
        month,
        year) {
        let params = {
            pageNum: pageNum,
            productName: productName,
            year: year || paramsConfig.year,
            month: month || paramsConfig.month,
            day: day || paramsConfig.day,
            pageSize: pageSize
        }
        return axios.get('/produce', {
            params: params
        })
    }
    //添加新的进度生产进度
    produce_add(produce) {
        return axios.post('/produce', produce, {msg: '进度添加成功'})
    }
    //更新进度
    produce_update(produce) {
        return axios.put('/produce', produce, {msg: '进度更新成功'})
    }
    //删除进度
    produce_delete(produceIds) {
        return axios.delete('/produce', {
            params: {
                produceIds: produceIds
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, {
                    arrayFormat: 'brackets'
                })
            },
            msg: '进度删除成功'
        },
        {
            msg: '删除进度成功'
        })
    }
    //获取生产进度详情
    produce_detail(produceId) {
        return axios.get('/produce', {
            params: {
                produceId: produceId
            }
        })
    }
    //清空所选日期的数据
    produce_delete_date(day = paramsConfig.day, month = paramsConfig.month, year = paramsConfig.year) {
        return axios.delete('/produce/all', {
            params: {
                day: day,
                month: month,
                year: year
            },
            msg: '所选日期的数据清空成功'
        }, {
            msg: '所选日期的数据清空成功'
        })
    }
    //修改产品
    produce_revice(produce) {
        return axios.put('/produce/change', produce, {msg: '产品修改成功'})
    }
    //导出所选日期的数据
    produce_date(day = paramsConfig.day, month = paramsConfig.month, year = paramsConfig.year) {
        return axios.get('/produce/export', {
            params: {
                day: day,
                month: month,
                year: year
            },
            responseType: 'blob'
        })
    }
    //导入之前某天的数据到今天
    produce_today(day = paramsConfig.day, month = paramsConfig.month, year = paramsConfig.year) {
        let temp = qs.stringify({
            day: day,
            month: month,
            year: year
        })
        return axios.post('/produce/import/db', temp, {msg: '导入成功'})
    }
    //出货
    produce_output(produce) {
        return axios.put('/produce/output', produce, {msg: '出货成功'})
    }
    //进度合计
    produce_total(day, month, year) {
        return axios.get('/produce/total', {
            params: {
                day: day || paramsConfig.day,
                month: month || paramsConfig.month,
                year: year || paramsConfig.year
            }
        })
    }

    /**
     * product-controller产品管理
     */
    //获取所有产品
    product_get(pageNum = 1, pageSize, productName = '', categoryId = '') {
        let params = {
            pageNum: pageNum,
            productName: productName,
            pageSize: pageSize || paramsConfig.productPageSize,
            categoryId
        }
        return axios.get('/product', {
            params: params
        })
    }
    //添加新的产品
    product_add(product) {
        return axios.post('/product', product, {msg: '产品添加成功'})
    }
    //更新产品
    product_update(product) {
        return axios.put('/product', product, {msg: '产品更新成功'})
    }
    //删除产品
    product_delete(productIds) {
        return axios.delete('/product', {
            params: {
                productIds: productIds
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, {
                    arrayFormat: 'brackets'
                })
            },
            msg: '产品删除成功'
        },
        {
            msg: '产品删除成功'
        })
    }
    //获取产品详情
    product_detail(productId) {
        return axios.get('/product/' + productId)
    }
    //检查产品名称是否存在
    product_check(productName) {
        return axios.get('/product/check', {
            params: {
                productName: productName
            }
        })
    }
    //导入excel产品文件
    product_file(multipartFile) {
        return axios.post('/product/import', {
            multipartFile: multipartFile
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            msg: '产品文件导入成功'
        })
    }
    //获取所有产品, 添加新的生产进度使用该接口
    product_get_add(productName) {
        return axios.get('/product/list', {
            params: {
                productName: productName
            }
        })
    }
    //删除产品图片
    product_delete_photo(productId, fileNames) {
        return axios.delete('/product/picture', {
            params: {
                productId: productId,
                fileNames: fileNames
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, {
                    arrayFormat: 'brackets'
                })
            },
            msg: '图片删除成功'
        })
    }
    //批量上传产品图片
    product_post_photo(productId, multipartFiles) {
        console.log('multi', multipartFiles)
        const fd = new FormData()
        fd.append('productId', productId)
        multipartFiles.forEach((item, index) => {
            fd.append(`multipartFiles[]`, item)
        })
        return axios.post('/product/pictures', fd, {
            headers: {
                'content-type': 'multipart/form-data'
            },
            timeout: 30000,
            maxContentLength: Infinity,
            onUploadProgress: progressEvent => {
                let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                console.log('进度 ', progressEvent )
            },
            msg: '图片上传成功'
        })
    }
    /**
     * 产品类别
     */
    category_get() {
        return axios.get('/category')
    }
    category_add(category) {
        return axios.post('/category', category, {msg: '类别添加成功'})
    }
    category_update(category) {
        return axios.put('/category', category, {msg: '类别更新成功'})
    }
    category_check(categoryName) {
        return axios.get('/category/check', {
            params: {
                categoryName: categoryName
            },
            ifIntercept: false
        })
    }
}
export default Interface