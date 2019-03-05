const {db} = require("../schema/conection")

const commentSchema = require("../schema/commentSchema")
const Comment = db.model("commments", commentSchema)

module.exports = Comment