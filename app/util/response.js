/**
 * 返回Json数据
 * @param code 返回码
 * @param data 返回数据内容
 */
function resJson(code, data) {
    return {
        code: code,
        data: data
    }
}

module.exports = {resJson};

