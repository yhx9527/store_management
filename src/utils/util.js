function dateParse(data) {
    let date = new Date(data)
    let hours = (date.getHours()).toString().padStart('2', 0)
    let minutes = date.getMinutes().toString().padStart('2', 0)
    return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ${hours}:${minutes}`
}
const roles = new Map([['ADMIN','管理员'],['OPERATOR','操作员'],['USER','普通用户']])
function roleTrans(data) {
    let temp = data.split(',')
    return temp.map(item=>{
        return roles.get(item)
    }).join(',')
}
function doProduce1(data=[]) {
    let i=0
    while(i<data.length){
        let item = data[i]
        if(i % 2 === 0){
            let temp = {produceProductName: '备注',
                produceXiadan: item['produceXiadan'+'Comment'],
                produceMugong: item['produceMugong'+'Comment'],
                produceYoufang: item['produceYoufang'+'Comment'],
                produceBaozhuang: item['produceBaozhuang'+'Comment'],
                produceBeijing: item['produceBeijing'+'Comment'],
                produceTeding: item['produceTeding'+'Comment'],
                produceBeijingteding: item['produceBeijingteding'+'Comment'],
                produceBendihetong: item['produceBendihetong'+'Comment'],
                produceWaidihetong: item['produceWaidihetong'+'Comment'],
                produceDeng: item['produceDeng' + 'Comment'],
                index: i}
            item.updateTime=dateParse(item.produceUpdateTime)
            data.splice(i+1,0,temp)
        }
        item.index=i
        i++
    }
    //console.log(data)
    return data
}
function doProduce(data=[]) {
    data.forEach(item=>{
        item.updateTime = dateParse(item.produceUpdateTime)
    })
    return data
}
function doOutput(data=[]) {
    data.forEach(item=>{
        item.updateTime = dateParse(item.outputUpdateTime)
        item.outputBaozhuangTotalPrice = '￥' + item.outputBaozhuangTotalPrice
        item.outputTedingTotalPrice = '￥' + item.outputTedingTotalPrice
        item.outputMugongTotalPrice = '￥' + item.outputMugongTotalPrice
        item.outputYoufangTotalPrice = '￥' + item.outputYoufangTotalPrice
        item.outputFactoryOutputTotalPrice = '￥' + item.outputFactoryOutputTotalPrice
        item.outputTedingFactoryOutputTotalPrice = '￥' + item.outputTedingFactoryOutputTotalPrice
        item.outputBeijingInputTotalPrice = '￥' + item.outputBeijingInputTotalPrice
        item.outputBeijingStockTotalPrice = '￥' + item.outputBeijingStockTotalPrice
        item.outputBeijingtedingInputTotalPrice = '￥' + item.outputBeijingtedingInputTotalPrice
        item.outputBeijingtedingStockTotalPrice = '￥' + item.outputBeijingtedingStockTotalPrice
        
    })
    return data
}
function downloadFile(fileName, blob) {
    fileName+='.xlsx'
    if('download' in document.createElement('a')){ //在非IE浏览器下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
    }else{ //IE10+下载
        navigator.msSaveBlob(blob, fileName)
    }
}
export {
    dateParse,
    roleTrans,
    doProduce,
    downloadFile,
    doOutput
}