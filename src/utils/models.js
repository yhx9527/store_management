const produceModel = new Map([["木工量","produceMugong"],["下单量","produceXiadan"],["油房量", "produceYoufang"],["包装量", "produceBaozhuang"],
                ["北京","produceBeijing"],["特定量","produceTeding"],["本地合同量","produceBendihetong"],["外地合同量","produceWaidihetong"],
                ["北京特定", "produceBeijingteding"],["等待","produceDeng"]])
const outputModel = new Map([["木工量","outputMugong"],["下单量","outputXiadan"],["油房量", "outputYoufang"],["包装量", "outputBaozhuang"],
    ["北京","outputBeijing"],["特定量","outputTeding"], ["北京特定", "outputBeijingteding"]])
const auths = new Map([['ADMIN', '管理员'], ['OPERATOR', '操作员'], ['USER', '普通用户']])
    export {
    produceModel,
    outputModel,
    auths
}