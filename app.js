const Koa = require("koa");
const static = require("koa-static");
const views = require("koa-views");
const logger = require("koa-logger");
const router = require("./routers/routers")
const body = require("koa-body");
const session = require("koa-session");
const {join} = require("path")

const app  = new Koa();

app.keys = ["feiyue da shuai bi"]
// session 配置对象
const CONFIG = {
  key: "Sid", //key值
  maxAge: 36e5, //失效时间
  overwrite: true, //是否覆盖
  httpOnly: true, //前端是否可读
  // signed: true, //默认为true
  rolling: true //是否更新
}

// 注册日志
// app.use(logger())

// 注册 session
app.use(session(CONFIG, app))

// 处理 post 数据
app.use(body())

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