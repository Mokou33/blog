const {db} = require("../schema/conection")

// 去用户的 Schema， 为了拿到操作 users 表的实例对象
const UsertSchema = require("../schema/userSchema")
const User = db.model("users", UsertSchema)

const ArticleSchema = require("../schema/articleSchema")
const Article = db.model("article", ArticleSchema)

const commentSchema = require("../schema/commentSchema")
const Comment = db.model("commments", commentSchema)


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
