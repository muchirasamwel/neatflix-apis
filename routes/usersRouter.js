const express = require('express')

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser
} = require('../controllers/usersContoller')

const usersRouter = express.Router()

usersRouter.route('/').post(addUser).get(getUsers)
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = usersRouter
