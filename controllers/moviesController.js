const fs = require('fs')
const {
  addMovieSchema,
  updateMovieSchema
} = require('../validation_schemas/moviesSchemas')

let movies = JSON.parse(fs.readFileSync(__dirname + '/../dev-data/movies.json'))

const validateAddMovie = async (req, res, next) => {
  const payload = req.body
  try {
    await addMovieSchema.validate(payload, {
      abortEarly: false
    })
    next()
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: e.inner.map(e => ({ [e.path]: e.errors[0] }))
    })
  }
}

const validateUpdateMovie = async (req, res, next) => {
  const payload = req.body
  try {
    await updateMovieSchema.validate(payload, {
      abortEarly: false
    })
    next()
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: e.inner.map(e => ({ [e.path]: e.errors[0] }))
    })
  }
}

const getMovieBySlug = (req, res, next, val) => {
  const movie = movies.find(m => m.href == req.params.slug)
  if (movie) {
    req.movie = movie
    next()
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Movie not found!'
    })
  }
}

const getMovie = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: req.movie
  })
}

const getMovies = (req, res) => {
  return res.status(200).json({
    status: 'success',
    count: movies.length,
    data: movies
  })
}

const addMovie = (req, res) => {
  const movie = req.body

  movie.href = movie.title?.replace(/ /g, '')
  movies = [...movies, movie]

  fs.writeFile(
    __dirname + './../dev-data/movies.json',
    JSON.stringify(movies),
    err => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: err.message
        })
      }
      return res.status(200).json({
        status: 'success',
        data: movie
      })
    }
  )
}

const updateMovie = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Not implemented'
  })
}

const deleteMovie = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Not implemented'
  })
}

module.exports = {
  addMovie,
  getMovie,
  updateMovie,
  getMovies,
  deleteMovie,
  getMovieBySlug,
  validateAddMovie,
  validateUpdateMovie
}
