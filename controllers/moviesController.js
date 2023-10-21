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
    const reqQuery = { ...req.query }
    const reserves = ['limit', 'page', 'sort', 'fields']
    reserves.forEach(reserve => {
      delete reqQuery[reserve]
    })

    // convert query to correct mongo syntax
    // eg {year:{lt:2020}} to  {year:{$lt:2020}}
    const newQuery = JSON.parse(
      JSON.stringify(reqQuery).replace(
        /\b(lt|lte|gt|gte)\b/g,
        match => '$' + match
      )
    )

    const query = Movie.find(newQuery)

    // Sort
    if (req.query.sort) query.sort(req.query.sort.replace(/,/g, ' '))
    else query.sort('-createdAt')

    // Fields
    if (req.query.fields) query.select(req.query.fields.replace(/,/g, ' '))
    else query.select('-__v')

    // Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 10
    const skip = (page - 1) * limit

    query.skip(skip).limit(limit)

    const allCount = await Movie.countDocuments(newQuery)
    if (req.query.page) {
      if (skip >= allCount) {
        throw 'Page requested doesnot exist'
      }
    }

    const movies = await query
    return res.status(200).json({
      status: 'success',
      page,
      pages: Math.ceil(allCount / limit),
      limit,
      count: movies.length,
      data: movies
    })
  } catch (err) {
    return res.status(500).json({
      status: 'fail',
      message: err
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
    const result = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

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
    await Movie.deleteOne({ _id: req.params.id })

    return res.status(200).json({
      status: 'success',
      data: null
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
