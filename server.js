const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(process.env.DB_CONNECTION).then(con => {
  console.log('Database connected...')
})

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server ready..')
})

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  console.log('shutting down....')
  server.close()
  process.exit(1)
})
