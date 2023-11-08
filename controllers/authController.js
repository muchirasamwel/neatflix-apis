const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: user
  })
})

module.exports = { signup }
