const {db} = require("../schema/conection")
const UserSchema =  require("../schema/userSchema")
const encrypto = require("../util/encrypto")
// 创建 model
const User = db.model("users", UserSchema)




// zhuce
exports.reg = async (ctx) => {
  console.log("这是处理用户注册的中间件");
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