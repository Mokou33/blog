const multer = require("koa-multer")
const {join} = require("path")

const storage = multer.diskStorage({
  // 储存的位置
  destination: join(__dirname,"../public/avatar"),

  // 文件名
  filename(req, file, cb){
    const filename = file.originalname.split(".")  //以 “.” 分割文件名
    cb(null,`${Date.now()}.${filename[filename.length - 1]}`) //时间+后缀
  }
})

module.exports = multer({storage})