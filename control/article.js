const {db} = require("../schema/conection");
const ArticleSchema = require("../schema/articleSchema")

// 创建model
const Article = db.model("article", ArticleSchema)

// 发表文章
exports.addPage = async (ctx) =>{
  await ctx.render("add-article", {
    title: "文章发表页",
    session: ctx.session
  })
}

// 文章的添加
exports.add = async (ctx)=>{
  // 判断是否登录
  if(ctx.session.isNew){ //true 为未登录状态
    return ctx.body = {
      status: 0,
      msg: "用户未登录"
    }
  }

  // 用户登录的情况
  // 这是 post 发送过来的数据
  const data = ctx.request.body
  // tips,  title,  content, author??
  data.author = ctx.session.username;

  // 将数据存入数据库
  await new Promise((resolve, reject)=>{
    new Article(data).save((err, data)=>{
      if(err) return reject(err)
      resolve(data)
    })
  })
  .then(data=>{
    ctx.body = {
      msg: "发表成功",
      status:1
    }
  })
  .catch(err=>{
    ctx.body = {
      msg: "发表失败",
      status:0
    }
  })
}