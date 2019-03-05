const Router = require("koa-router")
const user = require("../control/user")
const article = require("../control/article")
const comment = require("../control/comment")
const admin = require("../control/admin")
const upload = require("../util/upload")
const router = new Router();


// 首页
router.get("/", user.kepLogin, article.getList)

// 处理返回用户登录 注册
router.get(/^\/user\/(?=reg|login)/,async (ctx)=>{
  const show = /reg$/.test(ctx.path)
  // show 为 true 显示 否则 login显示
  await ctx.render("register",{show})
})

// 处理用户注册的 post
router.post("/user/reg", user.reg)

// 处理用户登录的 post
router.post("/user/login", user.login);

// 处理用户登出的 get
router.get("/user/logout", user.logout)

// 处理发表文章的 get
router.get("/article", user.kepLogin, article.addPage)

// 文章的添加 post
router.post("/article", user.kepLogin, article.add)

// 分页
router.get("/page/:id", article.getList)

// 文章详情页
router.get("/article/:id", user.kepLogin, article.details)

// 提交发表评论
router.post("/comment", user.kepLogin, comment.add)

// 后台
// 文章 评论 头像上传
router.get("/admin/:id", user.kepLogin, admin.index)

// 后台 上传头像
router.post("/upload", user.kepLogin, upload.single("file"), user.upload)

// 后台  获取评论
router.get("/user/comments", user.kepLogin, comment.comlist)

// 后台 删除评论
router.del("/comment/:id", user.kepLogin, comment.del)

// 后台 获取文章
router.get("/user/articles", user.kepLogin, article.artList)

// 后台 删除个人文章
router.del("/article/:id", user.kepLogin, article.del)

//  404
router.get("*", async (ctx)=>{
  await ctx.render("404",{
    title: "404"
  })
})

module.exports = router;