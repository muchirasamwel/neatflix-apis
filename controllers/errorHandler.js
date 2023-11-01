const AppError = require('../utils/AppError')

const handleCastErrorDB = err => {
  return new AppError(400, `Invalid ${err.path} with value ${err.value}`)
}

const handleDuplicateDB = err => {
  const error = Object.entries(err.keyValue)[0]
  return new AppError(400, `${error[0]} - ${error[1]}, already exists`)
}

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack
  })
}

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    })
  } else {
    console.log('ERROR ----- ----------', error)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong..'
    })
  }
}

const errorHandler = (err, req, res, next) => {
  let error = err

  if (error.code == 11000) error = handleDuplicateDB(error)
  if (error.name == 'CastError') error = handleCastErrorDB(error)

  error.statusCode = error.statusCode ?? 500
  error.status = error.status ?? 'error'

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(error, res)
  } else {
    sendErrorProd(error, res)
  }
}

module.exports = errorHandler
