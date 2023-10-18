const express = require('express')
const dotenv = require('dotenv')
const moviesRouter = require('./routes/moviesRouter')
const usersRouter = require('./routes/usersRouter')

dotenv.config({ path: '.env' })

const app = express()
app.use(express.json())

// app.get('/api/v1/movies/:slug', getMovie)
// app.get('/api/v1/movies', getMovies)
// app.post('/api/v1/movies', addMovie)

app.use('/api/v1/movies', moviesRouter)
app.use('/api/v1/users', usersRouter)

module.exports = app
