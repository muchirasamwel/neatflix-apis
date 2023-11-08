const mongoose = require('mongoose')
const { string } = require('yup')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [
      function (val) {
        val.match(/^[\w.]{3,20}(@)[\w.]{2,20}[.][\w.]{2,6}$/g)
      },
      'Please provide a valid email'
    ]
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  confirm_password: {
    type: String,
    required: true,
    validate: [
      // only create and save operation
      function (val) {
        return val === this.password
      },
      'Confirm password didnt match'
    ]
  },
  image: { type: String },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const User = mongoose.model('user', userSchema)

module.exports = User
