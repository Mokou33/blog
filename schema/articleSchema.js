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
},{
  versionKey:false,
  timestamps: {
    createdAt: "create"
  }
})

module.exports = ArticleSchema