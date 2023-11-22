const express = require('express')

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUser
} = require('../controllers/usersContoller')
const { signup, login } = require('../controllers/authController')

const usersRouter = express.Router()

usersRouter.post('/signup', signup)
usersRouter.post('/login', login)
usersRouter.route('/').post(addUser).get(getUsers)
usersRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = usersRouter
