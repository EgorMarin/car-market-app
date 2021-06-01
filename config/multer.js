const multer = require('multer');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../public/images`)
  },
  filename: function (req, file, cb) {
    const fileName = `${Math.random()}-${file.originalname}`;

    cb(null, fileName)
  }
})

const imageUploader = multer({ storage: diskStorage })

module.exports = { imageUploader }