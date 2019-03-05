const User = require("../models/user")
const Article = require("../models/article")
const Comment = require("../models/comment")
// const Comment = db.model("comments", CommentSchema)
// 发表文章页
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
  data.author = ctx.session.uid;
  data.commentNum = 0 //初始化评论计数器

  // 将数据存入数据库
  await new Promise((resolve, reject)=>{
    new Article(data).save((err, data)=>{
      if(err) return reject(err)

      // console.log(data);
      // 更新用户文章计数
      User.updateOne({_id:data.author},{$inc:{articleNum:1}},err => {
          if(err) return console.log(err);
          // console.log("评论计数器更新成功");
        })
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

// 文章的获取
exports.getList = async (ctx) => {

  // 查询文章对应作者的头像
  //  id   ctx.params.id
  let page = ctx.params.id || 1  // 获取动态路由的 id 默认为第一页
  page --;

  // 获取 表的最大数量
  const maxNum = await Article.estimatedDocumentCount((err,num)=>err? console.log(err):num)

  const data= await Article
    .find()
    .sort("-create")  // 按创建时间降序
    .skip(5 * page) // 跳过
    .limit(5)   // 帅选跳过的之后的5条
    .populate({
      path: "author",
      select: "_id username avatar"
    })  // mongoose 用于联表查询
    // 需要 then 或 exec（）来调用执行
    .then(data => data)
    .catch(err => console.log(err))

    // 打印从数据库取出的文章及关联的数据
    // console.log(data);

  await ctx.render("index", {
    title: "简易博客首页",
    session: ctx.session,
    artList: data,
    maxNum
  })
}

// 文章详情页
exports.details = async (ctx) => {
  // 获取  动态路由：id（和文章_id一样）
  const _id = ctx.params.id

  // 查询文章的作者，内容，头像
  const article = await Article
    .findById(_id)  //直接通过 _id 去查找， find（）需要传对象
    .populate({     //联表查询 users 表的数据
      path: "author",
      select: "_id username avatar"
    })
    .then(data => data)
    .catch(err => console.log(err))
    // console.log(data);

  // 查找文章关联的评论数据
  const comment = await Comment
    .find({article: _id})
    .sort("-create")
    .populate({
      path: "from",
      select: "username avatar"
    })
    .then(data => data)
    .catch(err => console.log(err))


  await ctx.render("article",{
    title: "",
    session: ctx.session,
    article,
    comment
  })
}

// 获取个人文章
exports.artList = async(ctx) =>{
  // 文章 分类  评论数
  const uid = ctx.session.uid;
  const data = await Article.find({author:uid})

  ctx.body = {
    code: 0,
    count: data.length,
    data
  }

}

// 删除个人文章
exports.del = async (ctx) =>{
  // 删除文章 文章计数器 -1
  const id = ctx.params.id

  let res = {
    state: 1,
    message: "删除成功"
  }
  // 删除文章
  await Article.findById(id)
    .then(data=>data.remove())
    .catch(err=>{
      res = {
        state:0,
        message: err
      }
    })

  ctx.body = res
}
