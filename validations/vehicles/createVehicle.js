const yup = require('yup');
const { VEHICLE_TYPE } = require('../../config/constanst')

module.exports = yup.object().shape({
  modelId: yup
    .number('error.modelId-not-valid')
    .required('error.required-field'),
  type: yup
    .string('error.type-not-valid')
    .required('error.required-field')
    .test({
      message: 'error.type-not-valid',
      test: (type) => {
        if (![
          VEHICLE_TYPE.AUTO, 
          VEHICLE_TYPE.MOTO, 
          VEHICLE_TYPE.BUS, 
          VEHICLE_TYPE.TRUCK, 
          VEHICLE_TYPE.WATER, 
          VEHICLE_TYPE.AIR
        ].includes(type)) {
          return false
        }

        return true
      },
    }),
  price: yup
    .number('error.price-not-valid')
    .required('error.required-field')
    .min(1, 'error.min-price-1')
    .max(50000000, 'error.rich-person'),
  age: yup
    .number('error.age-not-valid')
    .required('error.required-field')
    .min(0, 'error.min-age-0')
});