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

const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode ?? 500
  error.status = error.status ?? 'error'

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(error, res)
  } else {
    sendErrorProd(error, res)
  }
}

module.exports = errorHandler
