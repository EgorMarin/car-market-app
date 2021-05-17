const yup = require('yup');
const { User } = require('../../models')

module.exports = (req) => {
  return yup.object().shape({
    email: yup
      .string('error.string-not-valid')
      .max(255, 'error.max-length-255')
      .required('error.required-field')
      .test({
        message: 'error.email-not-exists',
        test: async (email) => {
          const user = await User.findOne({ where: { email } });
          req.user = user;
          return !!user;
        },
      }),
  });
}