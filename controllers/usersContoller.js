const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const addUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: user
  })
})

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (user) {
    res.status(200).json({
      status: 'success',
      data: user
    })
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'User not found!'
    })
  }
})

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({})
  return res.status(200).json({
    status: 'success',
    count: users.length,
    data: users
  })
})

const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  return res.status(202).json({
    status: 'success',
    data: user
  })
})

const deleteUser = catchAsync(async (req, res, next) => {
  await User.deleteOne({ _id: req.params.id })

  return res.status(200).json({
    status: 'success',
    data: null
  })
})

module.exports = { getUser, getUsers, addUser, updateUser, deleteUser }
