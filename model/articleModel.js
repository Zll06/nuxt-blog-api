const mongoose = require('../utils/connection')

const articleSchema = new mongoose.Schema({
    title: {
        type: 'string',
        required: true
    },
    path: {
        type: 'string',
        required: true
    }
})

const articleModel = mongoose.model("blog_article", articleSchema, "blog_article")

module.exports.articleModel = articleModel