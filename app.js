const express = require('express')
const dotenv = require('dotenv')
const moviesRouter = require('./routes/moviesRouter')
const usersRouter = require('./routes/usersRouter')
const AppError = require('./utils/AppError')
const errorHandler = require('./controllers/errorHandler')
const helmet = require('helmet')
import mongoSanitize from 'express-mongo-sanitize'
import { rateLimit } from 'express-rate-limit'
const xss = require('xss-clean')

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // 100 requests every 10 minutes
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
})

dotenv.config({ path: '.env' })

const app = express()

//security headers middleware
app.use(helmet())

// body parser middleware
app.use(express.json({ limit: '10kbs' }))

// sanitize against XXS attack
app.use(xss())

// sanitize against NoSQL attack
app.use(mongoSanitize())

// rate limiting to prevent DOS attack
app.use('/api/v1', limiter)

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
