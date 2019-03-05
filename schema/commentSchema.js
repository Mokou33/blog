const {Schema} = require("./conection")
// 创建 ObjectId
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
  // 头像
  // 内容
  // 文章
  content: String,
  // 关联用户表
  from: {
    type: ObjectId,
    ref: "users"
  },
  // 关联文章表
  article: {
    type: ObjectId,
    ref: "articles"
  }
},{
  versionKey:false,
  timestamps: {
    createdAt: "create"
  }
})

// 设置comment 的 remove 的钩子
CommentSchema.post("remove", (doc)=>{
  // 当前这个回调函数， 一定会在 remove 事件执行触发
  // console.log(1);
  const User = require("../models/user")
  const Article = require("../models/article")

  const {from,article} = doc

  // 对应文章的而作者的 评论计数 -1
  User.updateOne({_id: from},{$inc:{commentNum:-1}}).exec()

  // 对应文章的评论数-1
  Article.updateOne({_id: article},{$inc: {commentNum:-1}}).exec()

})

module.exports = CommentSchema;