const Koa = require("koa");
const static = require("koa-static");
const views = require("koa-views");
const logger = require("koa-logger");
const router = require("./routers/routers")
const body = require("koa-body");
const session = require("koa-session");
const compress = require("koa-compress")
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

// 注册资源压缩模块 koa-compress
app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))
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

{
  const {db} = require("./schema/conection")
  const userSchema = require("./schema/userSchema")
  const User = db.model("users", userSchema)
  const encrypto = require("./util/encrypto")

  // 项目启动是 检查是否存在管理员，如果没有，则创建
  User
    .find({username: "admin"})
    .then(data => {
      if (data.length === 0) { //管理员不存在
        new User({
          username: "admin",
          password: encrypto("admin"),
          role: 666,
          articleNum: 0,
          commentNum: 0
        })
        .save()
        .then(data => {
          console.log("创建管理员用户名 -> admin , 密码 -> admin");
        })
        .catch(err => {
          console.log("管理员账号检查失败");
        })
      }else{
        // 如果存在管理员 ，，则直接在控制台输出
        console.log("管理员用户名 -> admin , 密码 -> admin");
      }
    })
    .catch(err=>{
      console.log(err);
    })
}