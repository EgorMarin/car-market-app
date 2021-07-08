const AWS = require('aws-sdk')
const stream = require('stream')

const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require('../config/constanst')

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  httpOptions : {
    timeout: 300000 // 5 minutes delay
  },
});

const uploadStream = (params, options = {}) => {
  const pass = new stream.PassThrough();

  return {
    writeStream: pass,
    promise: s3.upload({ ...params, Body: pass }, options).promise()
  };
}

const getExt = (originalname) => originalname.substr(
  originalname.lastIndexOf('.') + 1
)

module.exports = { uploadStream, getExt }