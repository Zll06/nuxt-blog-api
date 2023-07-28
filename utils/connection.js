const mongoose = require('mongoose')

//mongodb://127.0.0.1:27017/link_list
mongoose.connect(`mongodb://localhost:27017/blog`, {
// mongoose.connect(`mongodb://root:root!2023@127.0.0.1:27017/electric_charge_one?authMechanism=DEFAULT&authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        throw err
    } else {
        console.log('数据库连接成功');
    }
})

module.exports = mongoose