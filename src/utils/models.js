const produceModel = new Map([
    ["木工量", "produceMugong"],
    ["下单量", "produceXiadan"],
    ["油房量", "produceYoufang"],
    ["包装量", "produceBaozhuang"],
    ["北京", "produceBeijing"],
    ["特定量", "produceTeding"],
    ["本地合同量", "produceBendihetong"],
    ["外地合同量", "produceWaidihetong"],
    ["北京特定", "produceBeijingteding"],
    ["等待", "produceDeng"]
])
const outputModel = new Map([
    ["下单", "outputXiadan"],
    ["木工", "outputMugong"],
    ["油房", "outputYoufang"],
    ["包装", "outputBaozhuang"],
    ["特定", "outputTeding"],
    ["工厂出货", "outputFactoryOutput"],
    ["特定工厂出货", "outputTedingFactoryOutput"],
    ["北京入库", "outputBeijingInput"],
    ["北京剩余", "outputBeijingStock"],
    ["北京特定入库", "outputBeijingtedingInput"],
    ["北京特定剩余", "outputBeijingtedingStock"]
])
const auths = new Map([
    ['ADMIN', '管理员'],
    ['OPERATOR', '操作员'],
    ['USER', '普通用户']
])
export {
    produceModel,
    outputModel,
    auths
}