const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const { promisify } = require('util')

const authGuard = catchAsync(async (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization?.includes('Bearer ')) {
    return next(new AppError(401, 'Unauthorized. Authorization token required'))
  }

  const token = authorization.split(' ')?.[1]

  const jwtData = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const user = User.findById(jwtData.id)
  if (!user) {
    return next(
      new AppError(401, 'User that created the token no longer exists')
    )
  }

  next()
})

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

module.exports = { login, signup, authGuard }
