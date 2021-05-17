const yup = require('yup');
const { User } = require('../../models')

module.exports = (req) => {
  return yup.object().shape({
    resetPasswordToken: yup
      .string('error.string-not-valid')
      .max(255, 'error.max-length-255')
      .required('error.required-field')
      .test({
        message: 'error.token-has-expired',
        test: async (resetPasswordToken) => {
          const user = await User.findOne({ where: { resetPasswordToken } });
          req.user = user;
          return !!user;
        },
      }),
    password: yup
      .string('error.string-not-valid')
      .max(50, 'error.max-length-50')
      .required('error.required-field')
  });
}