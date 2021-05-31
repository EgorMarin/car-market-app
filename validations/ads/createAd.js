const yup = require('yup');

const { VEHICLE_TYPE } = require('../../config/constanst');

module.exports = yup.object().shape({
  modelId: yup
    .number('error.modelId-not-valid')
    .required('error.required-field'),
  vehicleType: yup
    .string('error.type-not-valid')
    .required('error.required-field')
    .test({
      message: 'error.type-not-valid',
      test: (type) => {
        return [
          VEHICLE_TYPE.AUTO, 
          VEHICLE_TYPE.MOTO, 
          VEHICLE_TYPE.BUS, 
          VEHICLE_TYPE.TRUCK, 
          VEHICLE_TYPE.WATER, 
          VEHICLE_TYPE.AIR
        ].includes(type)
      },
    }),
  price: yup
    .number('error.price-not-valid')
    .required('error.required-field')
    .min(1, 'error.min-price-1')
    .max(50000000, 'error.rich-person'),
  year: yup
    .string('error.year-not-valid')
    .required('error.required-field')
    .min(0, 'error.min-age-0'),
  vin: yup
    .string('error.age-not-valid')
    .required('error.required-field')
    .min(17, 'error.vin-not-valid')
    .max(17, 'error.vin-not-valid'),
  description: yup
    .string('error.age-not-valid')
    .required('error.required-field')
    .min(20, 'error.min-symbols-20')
    .max(2000, 'error.max-symbols-2000'),
});