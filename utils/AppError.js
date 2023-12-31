class AppError extends Error {
  constructor (statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.operational = true
  }
}

module.exports = AppError
