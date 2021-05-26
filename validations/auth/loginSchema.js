const yup = require('yup');
const { User } = require('../../models')

module.exports = (req) => {
  return yup.object().shape({
    email: yup
      .string('error.string-not-valid')
      .max(50, 'error.max-length-50')
      .required('error.required-field')
      .test({
        message: 'error.email-not-found',
        test: async (email) => {
          const user = await User.findOne({ where: { email } });
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