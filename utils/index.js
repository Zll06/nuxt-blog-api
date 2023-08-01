const defaultRes = function (data, res, status = 200, message = "调用成功", ...args) {
    res.status(status).send({
        data: data,
        status,
        message,
        ...args
    })
}

const paramsError = function (res) {
    res.status(400).send({
        data: null,
        status: 10021,
        message: "参数错误"
    })
}

module.exports.defaultRes = defaultRes
module.exports.paramsError = paramsError