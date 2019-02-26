const Koa = require("koa");
const static = require("koa-static");
const views = require("koa-views");
const logger = require("koa-logger");
const {join} = require("path")
const router = require("./routers/routers")

const app  = new Koa();
// 注册日志
app.use(logger())
// 配置静态资源
app.use(static(join(__dirname, "public")))
// 配置视图文件
app.use(views(join(__dirname, "views"), {
  extension: "pug"
}))
// 配置路由

app
  .use(router.routes())
  .use(router.allowedMethods());

// 监听
app.listen(3000,()=>{
  console.log("服务启动成功，监听在3000端口");

})