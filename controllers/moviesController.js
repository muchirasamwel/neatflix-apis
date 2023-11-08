const fs = require('fs')
const {
  addMovieSchema,
  updateMovieSchema
} = require('../validation_schemas/moviesSchemas')
const Movie = require('../models/movieModel')
const APIFeatures = require('../utils/APIFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

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

const topMoviesAliases = async (req, res, next) => {
  req.query.sort = '-rating,-year,-createdAt'
  req.query.limit = 5

  next()
}

const getMoviesStats = catchAsync(async (req, res, next) => {
  const stats = await Movie.aggregate([
    {
      $match: { rating: { $gte: 2 } }
    },
    {
      $group: {
        _id: '$year',
        ratingAverage: { $avg: '$rating' },
        totalMovies: { $count: {} },
        ratingAverage: { $avg: '$rating' }
      }
    },
    {
      $addFields: {
        year: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        year: 1
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: stats
  })
})

const getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id)
  if (movie) {
    res.status(200).json({
      status: 'success',
      data: movie
    })
  } else {
    next(new AppError(404, 'Movie not found'))
  }
})

const getMovies = catchAsync(async (req, res, next) => {
  const moviesQueryBuilder = await new APIFeatures(
    Movie.find(),
    req.query,
    Movie
  )
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const movies = await moviesQueryBuilder.query
  return res.status(200).json({
    status: 'success',
    page: req.query.page * 1 || 1,
    pages: moviesQueryBuilder.pages ?? undefined,
    limit: req.query.limit * 1,
    count: movies.length,
    data: movies
  })
})

const addMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.create(req.body)

  return res.status(201).json({
    status: 'success',
    data: movie
  })
})

const updateMovie = catchAsync(async (req, res, next) => {
  const result = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).catch(next)

  return res.status(202).json({
    status: 'success',
    data: result
  })
})

const deleteMovie = catchAsync(async (req, res, next) => {
  await Movie.deleteOne({ _id: req.params.id })

  return res.status(200).json({
    status: 'success',
    data: null
  })
})

module.exports = {
  addMovie,
  getMovie,
  updateMovie,
  getMovies,
  deleteMovie,
  validateAddMovie,
  validateUpdateMovie,
  topMoviesAliases,
  getMoviesStats
}
