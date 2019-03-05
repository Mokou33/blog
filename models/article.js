const {db} = require("../schema/conection")

const articleSchema = require("../schema/articleSchema")
const Article = db.model("articles", articleSchema)

module.exports = Article