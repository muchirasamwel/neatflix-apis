const express = require('express')
const dotenv = require('dotenv')
const moviesRouter = require('./routes/moviesRouter')
const usersRouter = require('./routes/usersRouter')
const AppError = require('./utils/AppError')
const errorHandler = require('./controllers/errorHandler')

dotenv.config({ path: '.env' })

const app = express()
app.use(express.json())

// app.get('/api/v1/movies/:slug', getMovie)
// app.get('/api/v1/movies', getMovies)
// app.post('/api/v1/movies', addMovie)

app.use('/api/v1/movies', moviesRouter)
app.use('/api/v1/users', usersRouter)

app.all('*', (req, res, next) => {
  next(new AppError(404, 'Requested API was not found on this server!'))
})

app.use(errorHandler)

module.exports = app
