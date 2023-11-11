const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const signup = catchAsync(async (req, res, next) => {
  const { email, password, name, confirmPassword, image } = req.body
  const user = await User.create({
    email,
    name,
    password,
    confirmPassword,
    image
  })

  return res.status(201).json({
    status: 'success',
    data: user
  })
})

module.exports = { signup }
