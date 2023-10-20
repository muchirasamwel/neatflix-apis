const fs = require('fs')
const {
  addMovieSchema,
  updateMovieSchema
} = require('../validation_schemas/moviesSchemas')
const Movie = require('../models/movieModel')

// let movies = JSON.parse(fs.readFileSync(__dirname + '/../dev-data/movies.json'))

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

const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    if (movie) {
      res.status(200).json({
        status: 'success',
        data: movie
      })
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Movie not found!'
      })
    }
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({})
    return res.status(200).json({
      status: 'success',
      count: movies.length,
      data: movies
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body)

    return res.status(201).json({
      status: 'success',
      data: movie
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const updateMovie = async (req, res) => {
  try {
    const result = await Movie.updateOne({ _id: req.params.id }, req.body)

    return res.status(202).json({
      status: 'success',
      data: result
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

const deleteMovie = async (req, res) => {
  try {
    const result = await Movie.deleteOne({ _id: req.params.id })

    return res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err.message
    })
  }
}

module.exports = {
  addMovie,
  getMovie,
  updateMovie,
  getMovies,
  deleteMovie,
  validateAddMovie,
  validateUpdateMovie
}
