const {Schema} = require("./conection")

const UserSchema = new Schema({
  username: String,
  password: String,
  avatar: {
    type: String,
    default: "/avatar/default.jpg"
  },
  role: {
    type: Number,
    default: 1
  },
  articleNum: Number,
  commentNum: Number
},{
  versionKey: false
})

// 设置 user remove 的钩子
UserSchema.post("remove", doc=>{

  const {_id} = doc
  // 引入需要操作的 model
  const Article = require("../models/article")
  const Comment = require("../models/comment")

  // 删除该用户下的所有文章
  Article
    .find({author:_id})
    .then(data=>{
      data.forEach(item=>item.remove())
    })

  // 删除该用户下的所有评论
  Comment
    .find({from:_id})
    .then(data=>{
      data.forEach(item=>item.remove())
    })


})


module.exports = UserSchema;
