const User = require("../models/user")
const Article = require("../models/article")
const Comment = require("../models/comment")

const fs = require("fs")
const {join} = require("path")


// 后台管理页面
exports.index = async (ctx) =>{
  //判断是否登录或地址栏进入
  if(ctx.session.isNew){ //从地址栏进入显示404
    // 没有登录
    ctx.status = 404
    return await ctx.render("404", {title: "404"})
  }

  // 获取动态路由
  const id = ctx.params.id;

  const arr = fs.readdirSync(join(__dirname,"../views/admin"))

  let flag = false
  arr.forEach(item=>{
    const name = item.replace(/^(admin\-)|(\.pug)$/g, "")
    if (name === id) {
      flag = true
    }
  })

  // 根据传过来的id进行动态渲染
  if (flag) {
    await ctx.render("./admin/admin-" + id, {
      role: ctx.session.role
    })
  } else {
    await ctx.render("404", {
      title: "404"
    })
  }
}