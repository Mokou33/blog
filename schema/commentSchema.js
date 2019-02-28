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


module.exports = CommentSchema;