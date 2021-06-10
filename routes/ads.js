const passport = require('passport')
const router = require('express').Router()
const { pick } = require('lodash')
const stream = require('stream')
const streamifier = require('streamifier')
const AWS = require('aws-sdk')
const sharp = require('sharp')
const { v4: uuid } = require('uuid')

const { Ad, User, Model, Brand } = require('../models')
const { checkIfOwner } = require('../middlewares/ads')
const validate = require('../helpers/validationSchemaHelper')
const { createAd } = require('../validations/ads')
const { imageUploader, videoUploader } = require('../config/multer')
const { AWS_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require('../config/constanst')

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'owner'
        },
        {
          model: Model,
          include: Brand
        },
      ]
    })

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

router.post('/', [passport.authenticate('jwt'), validate(createAd)], async (req, res, next) => {
  const { modelId, vehicleType, price, year, vin, description } = req.body
  const userId = req.user.id

  try {
    const ad = await Ad.create({ 
      userId, modelId, vehicleType, price, year, vin, description 
    })

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

router.patch('/:id', [passport.authenticate('jwt'), checkIfOwner], async (req, res, next) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findOne({ where: { id } })

    const fields = pick(req.body, ['year', 'name'])

    Object.keys(fields).forEach(key => {
      return ad[key] = fields[key]
    })

    await ad.save()

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

const uploadStream = ({ Bucket, Key, ContentType, ACL }) => {
  const pass = new stream.PassThrough();

  return {
    writeStream: pass,
    promise: s3.upload({ 
      Bucket,
      Key,
      ContentType,
      Body: pass,
      ACL,
    }).promise()
  };
}

router.post('/photos', imageUploader.single('image') , async (req, res, next) => {
  try {
    const { buffer, mimetype, originalname } = req.file

    const ext = originalname.substr(
      originalname.lastIndexOf('.') + 1
    )

    const { writeStream, promise } = uploadStream({ 
      Bucket: AWS_BUCKET_NAME, 
      Key: `${uuid()}.${ext}`,
      ContentType: mimetype,
      ACL: 'public-read',
    })

    const resizer = sharp().resize(1000);

    streamifier
      .createReadStream(buffer)
      .pipe(resizer)
      .pipe(writeStream)
      .on('finish', async () => {
        const uploaded = await promise
        console.log('uploaded', uploaded);
      })
      .on('error', next)

    res.json('ok')
  } catch (e) {
    next(e);
  }
})

// multipart upload
let partNum = 0;
const partSize = 1024 * 1024 * 5;
const videoFileKey = `${uuid()}-video`
const multiPartParams = {
  Bucket: AWS_BUCKET_NAME, 
  Key: videoFileKey,
  ACL: 'public-read',
};
let MultipartUpload = {
  Parts: []
};

const completeMultipartUpload = async (doneParams) => {
  const promise = await s3.completeMultipartUpload(doneParams).promise()
  console.log('End uploading', promise);
}

const uploadPart = (UploadId, partParams, numPartsLeft, tryNum) => {
  let tryNumber = tryNum || 1

  s3.uploadPart(partParams, (err) => {
    if (err) {
      if (tryNum < 3) {
        console.log('Retrying upload of part: #', partParams.PartNumber)
        uploadPart(UploadId, partParams, numPartsLeft, tryNumber + 1);
      }

      return console.log('Failed uploading part: #', partParams.PartNumber);
    }

    MultipartUpload.Parts[partNum - 1] = {
      PartNumber: partNum
    };

    if (--numPartsLeft > 0) return; // complete only when all parts uploaded
    
    const doneParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: videoFileKey,
      MultipartUpload,
      UploadId,
    };

    completeMultipartUpload(doneParams);
  })
}

router.post('/videos', videoUploader.single('video') , async (req, res, next) => {
  const { buffer, mimetype, originalname } = req.file

  console.log('req.file', req.file);

  let numPartsLeft = Math.ceil(buffer.length / partSize);

  try {
    const { UploadId } = await s3.createMultipartUpload(multiPartParams).promise()

    console.log("Got upload ID", UploadId);

    for (let rangeStart = 0; rangeStart < buffer.length; rangeStart += partSize) {
      partNum++;

      const end = Math.min(rangeStart + partSize, buffer.length)

      const partParams = {
        Body: buffer.slice(rangeStart, end),
        Bucket: AWS_BUCKET_NAME,
        Key: videoFileKey,
        PartNumber: String(partNum),
        UploadId,
      };

      // Send a single part
      console.log(
        'Uploading part: #', partParams.PartNumber,
        ', Range start:', rangeStart,
        ', Num parts left:', numPartsLeft,
      );

      uploadPart(UploadId, partParams, numPartsLeft);
    }


    res.json('ok')
  } catch (e) {
    next(e);
  }
})

router.delete('/:id', [passport.authenticate('jwt'), checkIfOwner], async (req, res, next) => {
  const { id } = req.params;
  
  try {
    await Ad.destroy({ where: { id }})

    res.json('deleted')
  } catch (e) {
    next(e);
  }
})

module.exports = router