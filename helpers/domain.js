const { FRONT_APP_URL } = require('../config/constanst')
 
const getBaseUrl = (req) => {
  const { origin } = req.headers;

  if (origin && origin.includes('localhost')) {
    return FRONT_APP_URL;
  }

  if (origin) {
    return origin.replace(/^\/|\/$/g, '');
  }
  console.log(FRONT_APP_URL);
  return FRONT_APP_URL;
};

module.exports = getBaseUrl
