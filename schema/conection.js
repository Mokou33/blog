const mongoose = require("mongoose")

const db = mongoose.createConnection("mongodb://localhost:27017/bolgpro",{useNewUrlParser: true})

// 替换 mongoose 自实现的 Promise
mongoose.Promise = global.Promise;

// 把Schema取出来
const Schema = mongoose.Schema;

// 监听连接状态
db.on("error",()=>{
  console.log("数据库连接失败");

})
db.on("open",()=>{
  console.log("数据库连接成功");

})

module.exports = {
  db,
  Schema
}