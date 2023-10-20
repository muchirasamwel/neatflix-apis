const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(process.env.DB_CONNECTION).then(con => {
  console.log('Database connected...')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server ready..')
})
