const {Schema} = require("./conection")

const ArticleSchema = new Schema({
  title: String,
  tips: String,
  author: String,
  content: String,
},{
  versionKey:false,
  timestamps: {
    createdAt: "create"
  }
})

module.exports = ArticleSchema