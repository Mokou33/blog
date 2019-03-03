const {db} = require("../schema/conection")

// 去用户的 Schema， 为了拿到操作 users 表的实例对象
const UsertSchema = require("../schema/userSchema")
const User = db.model("users", UsertSchema)

const ArticleSchema = require("../schema/articleSchema")
const Article = db.model("article", ArticleSchema)

const commentSchema = require("../schema/commentSchema")
const Comment = db.model("commments", commentSchema)

//发表评论
exports.add = async (ctx) => {
  let message = {
    status:0,
    msg:"登录才能发表"
  }

  //  验证用户是否登录
  if (ctx.session.isNew) return ctx.body = message

  // 用户登录了
  const data = ctx.request.body
  data.from = ctx.session.uid

  const _comment = new Comment(data)
  await _comment
    .save()
    .then(data => {
      message = {
        status: 1,
        msg: "评论成功"
      }

      // 更新当前文章的计数器
      Article
        .updateOne({_id:data.article},{$inc:{commentNum:1}},err => {
          if(err) return console.log(err);
          // console.log("评论计数器更新成功");
        })

      // 更新用户评论的计数器
      User
        .updateOne ({_id: data.from},{$inc: {commentNum:1}}, err =>{
          if(err) return console.log(err)
        })


    })
    .catch(err => {
      message = {
        status: 0,
        msg: err
      }
    })

  ctx.body = message

}

// 获取评论
exports.comlist = async (ctx) => {
  const uid = ctx.session.uid
  // 评论内容，文章标题，文章id，评论者id
  const data = await Comment.find({from:uid}).populate("article", "title")

  ctx.body = {
    code:0,
    count: data.length,
    data
  }
}

exports.del = async (ctx) => {

  // 删除评论 用户表评论计数-1， 文章表评论计数-1
  const commentId = ctx.params.id
  // const articleId = ctx.request.body.articleId
  let isOk = true
  let articleId, uid
  // 找到评论对应的文章id和评论者的id
  await Comment.findById(commentId, (err,data)=>{
    if(err){
      console.log(err);
      isOk = false
      return
    }else{
      articleId = data.article
      uid = data.from
      // console.log(data);
    }
  })

  // 删除评论
  await Comment.deleteOne({_id:commentId})

  // 计数器-1
  await User.update({_id: uid}, {$inc: {commentNum: -1}})
  await Article.update({_id: articleId}, {$inc: {commentNum: -1}})

  if(isOk){
    ctx.body = {
      state : 1,
      message: "删除成功"
    }
  }

}
