const multer = require('multer');

const ApiError = require('../helpers/apiError')
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `${__dirname}/../public/images`)
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${Math.random()}-${file.originalname}`;

//     cb(null, fileName)
//   }
// })

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true)
  } else {
    return cb(
      new ApiError({
        status: 400,
        message: 'Image',
        key: 'error.wrong-mimetype',
      }),
      false
    )
  }
}

const videoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video')) {
    return cb(null, true)
  } else {
    return cb(
      new ApiError({
        status: 400,
        message: 'Video',
        key: 'error.wrong-mimetype',
      }),
      false
    )
  }
}

const limits = { fileSize: 1024 * 1024 * 10 } // 10 Mb
const videoLimits = { fileSize: 1024 * 1024 * 60 }

const imageUploader = multer({ storage, fileFilter, limits })

const videoUploader = multer({ storage, fileFilter: videoFileFilter, limits: videoLimits })

module.exports = { imageUploader, videoUploader }