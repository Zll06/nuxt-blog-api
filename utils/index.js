const defaultRes = function (data, res, status = 200, message = "调用成功", ...args) {
    res.status(status).send({
        data: data,
        status,
        message,
        ...args
    })
}

module.exports.defaultRes = defaultRes