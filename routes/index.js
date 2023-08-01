const express = require('express');
const {articleModel} = require("../model/articleModel");
const {defaultRes, paramsError} = require("../utils");
const router = express.Router();

/* GET home page. */
router.get('/api/getArticleList', async function (req, res, next) {
  const list = await articleModel.find()
  defaultRes(list, res)
});

router.get("/api/getArticle", async (req, res, next) => {
  const id = req.query.id
  if(!id) {
    paramsError(res)
    return
  }
  const data = await articleModel.findOne({
    id
  })
  defaultRes(data, res)
})

router.use("/api", express.static("./public/md"))

module.exports = router;
