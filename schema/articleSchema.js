const {Schema} = require("./conection")
const ObjectId = Schema.Types.ObjectId;

const ArticleSchema = new Schema({
  title: String,
  tips: String,
  author: {
    type: ObjectId,
    ref: "users"  //关联 users 的表
  },
  content: String,
  commentNum: Number
},{
  versionKey:false,
  timestamps: {
    createdAt: "create"
  }
})

ArticleSchema.post("remove",doc=>{

  const User = require("../models/user")
  const Comment = require("../models/comment")

  const {_id:artId, author:authorId} = doc
  // 用户的文章计数器 -1
  User.updateOne({_id:authorId},{$inc:{articleNum:-1}}).exec()

  // 删除文章下的所有评论
  Comment.find({article:artId})
    .then(data=>{
      data.forEach(item=>item.remove())
    })

})


module.exports = ArticleSchema