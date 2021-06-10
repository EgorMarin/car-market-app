module.exports = {
  SECRET_KEY: process.env.SECRET_KEY,
  SECRET_PASSWORD_KEY: process.env.SECRET_PASSWORD_KEY,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  AUTH_TOKEN_EXPIRATION_TIME: '30m',
  REFRESH_TOKEN_EXPIRATION_TIME: '7d',
  RESET_PASSWORD_TOKEN_EXPIRATION_TIME: '1h',
  FRONT_APP_URL: 'http://localhost:3000',
  VEHICLE_TYPE: {
    AUTO: 'AUTO',
    MOTO: 'MOTO', 
    TRUCK: 'TRUCK', 
    BUS: 'BUS', 
    AIR: 'AIR', 
    WATER: 'WATER'
  },
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
}