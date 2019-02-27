const {Schema} = require("./conection")

const UserSchema = new Schema({
  username: String,
  password: String,
},{
  versionKey: false
})

module.exports = UserSchema;
