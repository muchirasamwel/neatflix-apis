const mongoose = require('mongoose')
const { string } = require('yup')
const bcrypt = require('bcrypt')

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
  confirmPassword: {
    type: String,
    required: true,
    validate: [
      // only create and save operation
      function (val) {
        return val === this.password
      },
      "Confirm password didn't match"
    ]
  },
  image: { type: String },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.confirmPassword = undefined

  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User
