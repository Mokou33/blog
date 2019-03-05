const User = require("../models/user")
const Article = require("../models/article")
const Comment = require("../models/comment")

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
  const data = await Comment
    .find({from:uid})
    .sort("-create")
    .populate("article", "title")

  ctx.body = {
    code:0,
    count: data.length,
    data
  }
}

// 删除评论
exports.del = async (ctx) => {
  // 删除评论 用户表评论计数-1， 文章表评论计数-1
  const commentId = ctx.params.id

  let res = {
    state: 1,
    message: "删除评论成功"
  }

  // 找到评论对应的文章id和评论者的id
   await Comment.findById(commentId)
    .then(data => data.remove())
    .catch(err=>{
      res = {
        state: 0,
        message: err
      }
    })

    ctx.body = res

}
