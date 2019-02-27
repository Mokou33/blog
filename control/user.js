const {db} = require("../schema/conection")
const UserSchema =  require("../schema/userSchema")
const encrypto = require("../util/encrypto")

// 创建 model
const User = db.model("users", UserSchema)


// 注册
exports.reg = async (ctx) => {
  // console.log("这是处理用户注册的中间件");
  const user = ctx.request.body;
  const username = user.username;
  const password = user.password;

  await new Promise((resolve, reject)=>{
    // 去 User表 里查询
    User.find({username}, (err,res)=>{
      if(err) return reject(err)
      if(res.length !== 0){
        // 查询到数据，则用户名已存在
        resolve("")
      }else{
        // 用户名不存在   需要存到数据库
        const _user = new User({
          username,
          password: encrypto(password)
        })

        _user.save((err,res)=>{
          if(err)  return reject(err)
          resolve(res)
        })
      }
    })
  })
  .then(async (data)=>{
    if(data){
      // 注册成功
      await ctx.render("isOK", {status:"注册成功"})
    }else{
      // 用户名已存在
      await ctx.render("isOK", {status:"用户名已存在"})
    }
  })
  .catch(async (err)=>{
    // 注册失败
    await ctx.render("isOK",{status: "注册失败，请重试"})
  })

}

// 登录
exports.login = async (ctx)=>{
  // console.log("这是登录的中间件");
  const user = ctx.request.body;
  const username = user.username;
  const password = user.password;

  // 将登录的数据与数据库的数据进行查询比对
  await new Promise((resolve, reject)=>{
    // 去 users 表里查询用户
    User.find({username},(err,data)=>{
      if(err) return reject(err)
      if(data.length === 0 ) return reject("用户名不存在")
      // console.log(data);

      // 用户名存在 进行密码比对
      if (data[0].password === encrypto(password)){
        return resolve(data)
      }
      // 密码不一样，则返回空字符串
      resolve("")
    })
  })
  .then(async data =>{
    if(data){
      await ctx.render("isOK", {status: "登录成功"})
    }else{
      await ctx.render("isOK", {status: "密码输入错误"})
    }
  })
  .catch(async err =>{
    await ctx.render("idOK", {status: "登录失败，请重试"})
  })
}