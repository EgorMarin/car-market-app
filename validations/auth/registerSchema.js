const yup = require('yup');
const { User } = require('../../models')

module.exports = yup.object().shape({
  email: yup
    .string('error.string-not-valid')
    .required('error.required-field')
    .max(50, 'error.max-length-50')
    .email('error.email-not-valid')
    .test({
      message: 'error.email-already-in-use',
      test: async (email) => {
        const user = await User.findOne({ where: { email } });
        return !user;
      },
    }),
  fullName: yup
    .string('error.string-not-valid')
    .required('error.required-field')
    .max(50, 'error.max-length-50'),
  phone: yup
    .string('error.string-not-valid')
    .max(50, 'error.max-length-50'),
  password: yup
    .string('error.string-not-valid')
    .required('error.required-field')
    .max(50, 'error.max-length-50'),
});
