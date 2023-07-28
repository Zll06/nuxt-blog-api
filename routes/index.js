const express = require('express');
const {articleModel} = require("../model/articleModel");
const {defaultRes} = require("../utils");
const router = express.Router();

/* GET home page. */
router.get('/api/getArticleList', async function (req, res, next) {
  const list = await articleModel.find()
  defaultRes(list, res)
});

router.use(express.static("./public/md"))

module.exports = router;
