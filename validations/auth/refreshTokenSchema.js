const yup = require('yup');
const { User } = require('../../models')

module.exports = (req) => {
  return yup.object().shape({
    refreshToken: yup
      .string('error.string-not-valid')
      .max(255, 'error.max-length-255')
      .required('error.required-field')
      .test({
        message: 'error.user-not-found',
        test: async (refreshToken) => {
          const user = await User.findOne({ where: { refreshToken } });
          req.user = user;
          return !!user;
        },
      }),
  });
}