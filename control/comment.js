const {db} = require("../schema/conection")

// 去用户的 Schema， 为了拿到操作 users 表的实例对象
const UsertSchema = require("../schema/userSchema")
const User = db.model("comments", UsertSchema)

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
        msg: "发表成功"
      }
    })
    .catch(err => {
      message = {
        status: 0,
        msg: err
      }
    })

  ctx.body = message

}
