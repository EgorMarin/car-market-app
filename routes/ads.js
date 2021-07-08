const passport = require('passport')
const router = require('express').Router()
const { pick } = require('lodash')
const streamifier = require('streamifier')
const sharp = require('sharp')
const archiver = require('archiver')
const { v4: uuid } = require('uuid')

const { Ad, AdsView, AdTag, Tag, User, Model, Brand } = require('../models')
const { checkIfOwner } = require('../middlewares/ads')
const { createAd } = require('../validations/ads')
const { imageUploader, videoUploader } = require('../config/multer')
const { AWS_BUCKET_NAME, VIDEO_PART_SIZE } = require('../config/constanst')
const { getExt, uploadStream } = require('../helpers/api')
const validate = require('../helpers/validationSchemaHelper')

router.get('/', async (req, res, next) => {
  try {
    const ads = await Ad.findAll()

    res.json(ads)
  } catch (e) {
    next(e);
  }
})

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

    if (!ad) {
      return res.status(401).json('Ad doesnt exist!')
    }

    // await AdsView.create({
    //   adsId: id,
    // })

    res.json(ad)
  } catch (e) {
    next(e);
  }
})

router.post('/', [passport.authenticate('jwt'), validate(createAd)], async (req, res, next) => {
  const { modelId, vehicleType, price, year, vin, description, tagId } = req.body
  const userId = req.user.id

  try {
    const ad = await Ad.create({ 
      userId, modelId, vehicleType, price, year, vin, description, tagId
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

router.post('/photos', imageUploader.single('image') , async (req, res, next) => {
  try {
    const { buffer, mimetype, originalname } = req.file;

    const { writeStream, promise } = uploadStream({ 
      Bucket: AWS_BUCKET_NAME,
      Key: `${uuid()}.${getExt(originalname)}`,
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

router.post('/videos', videoUploader.single('video'), async (req, res, next) => {
  const { buffer, mimetype, originalname } = req.file;

  const parts = Math.ceil(buffer.length / VIDEO_PART_SIZE);

  const readStream = streamifier.createReadStream(buffer)
  const { writeStream, promise } = uploadStream(
    { 
      Bucket: AWS_BUCKET_NAME,
      Key: `${uuid()}-video.zip`,
      ContentType: 'application/zip',
      ACL: 'public-read',
    }, 
    {
      partSize: VIDEO_PART_SIZE,
      queueSize: parts,
    }
  )

  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(writeStream)

  archive
    .append(readStream, { 
      name: `${uuid()}-video.${getExt(originalname)}` 
    })
    .finalize()

  const data = await promise

  // upload video without archiving

  // const params = {
  //   Bucket: AWS_BUCKET_NAME,
  //   Key: `${uuid()}-video.${getExt(originalname)}`,
  //   Body: streamifier.createReadStream(buffer),
  //   ContentType: mimetype,
  //   ACL: 'public-read',
  // }

  // const options = {
  //   partSize: VIDEO_PART_SIZE,
  //   queueSize: parts,
  // }

  try {
    // const data = await s3.upload(params, options).promise();

    res.json(data)
  } catch (e) {
    next(e);
  }
})

router.post('/tags', async (req, res, next) => {
  const { tagId, adsId } = req.body;

  try {
    const adTag = await AdTag.create({ tagId, adsId })

    res.json(adTag)
  } catch (e) {
    next(e)
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