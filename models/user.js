const {db} = require("../schema/conection")

const UserSchema = require("../schema/userSchema")
const User = db.model("users", UserSchema)

module.exports = User