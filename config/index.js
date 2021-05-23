const api = require('./api')
const passport = require('./passport')

module.exports = (app) => {
  api(app)
  passport(app)
}