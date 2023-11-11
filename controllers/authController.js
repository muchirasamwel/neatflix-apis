const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError(400, 'Email and password are required'))
  }

  const user = await User.findOne({ email: email }).select('+password')

  let verifyPass = null

  if (user) verifyPass = await user.verifyPass(password)

  if (!user || !verifyPass) {
    return next(new AppError(401, 'Email or password is invalid'))
  }

  const token = await jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  )

  return res.status(200).json({
    status: 'success',
    token
  })
})

const signup = catchAsync(async (req, res, next) => {
  const { email, password, name, confirmPassword, image } = req.body
  const user = await User.create({
    email,
    name,
    password,
    confirmPassword,
    image
  })

  const token = await jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  )

  return res.status(201).json({
    status: 'success',
    token,
    data: user
  })
})

module.exports = { login, signup }
