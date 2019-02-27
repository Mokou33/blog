const Router = require("koa-router")
const user = require("../control/user")

const router = new Router();

router.get("/", async(ctx,next)=>{
  await ctx.render("index",{title: "我是一个正经的标题"})
})

// 处理返回用户登录 注册
router.get(/^\/user\/(?=reg|login)/,async (ctx)=>{
  const show = /reg$/.test(ctx.path)
  // show 为 true 显示 否则 login显示
  await ctx.render("register",{show})
})

// 处理用户登录的 post
router.get("/user/login",async (ctx)=>{
  const data = ctx.request.body;
})

// 处理用户注册的 post
router.post("/user/reg", user.reg)

module.exports = router;