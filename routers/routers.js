const Router = require("koa-router")

const router = new Router();

router.get("/", async(ctx,next)=>{
  await ctx.render("index",{title: "我是一个正经的标题"})
})

router.get(/^\/user\/(?=reg|login)/,async (ctx)=>{
  const show = /reg$/.test(ctx.path)
  // show 为 true 显示 否则 login显示
  await ctx.render("register",{show})
})

module.exports = router;