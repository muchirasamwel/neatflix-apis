const yup = require('yup')

const addMovieSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Title can not be less than 3 characters')
    .max(30)
    .required(),

  extract: yup.string().required().max(500),
  year: yup.number().required().moreThan(1999).lessThan(2024),
  thumbnail: yup
    .string()
    .matches(/^(https:\/\/|https:\/\/)/g, 'a valid url is required')
    .min(3, 'Thumbnail can not be less than 3 characters')
    .required()
})

const updateMovieSchema = yup.object({
  slug: yup.string().required(),
  title: yup
    .string()
    .optional()
    .min(3, 'Title can not be less than 3 characters')
    .max(30),
  extract: yup.string().optional().max(500),
  year: yup.number().optional().moreThan(1999).lessThan(2024),
  thumbnail: yup
    .string()
    .optional()
    .matches(/^(https:\/\/|https:\/\/)/g, 'a valid url is required')
    .min(3, 'Thumbnail can not be less than 3 characters')
})

module.exports = { addMovieSchema, updateMovieSchema }
