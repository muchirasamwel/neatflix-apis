const User = require('../models/userModel')

const addUser = async (req, res) => {
  try {
    const user = await User.create(req.body)

    return res.status(201).json({
      status: 'success',
      data: user
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const getUser = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    return res.status(200).json({
      status: 'success',
      count: users.length,
      data: users
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    return res.status(202).json({
      status: 'success',
      data: user
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id })

    return res.status(200).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

module.exports = { getUser, getUsers, addUser, updateUser, deleteUser }
