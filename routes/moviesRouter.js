const express = require('express')

const {
  addMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  validateAddMovie,
  validateUpdateMovie,
  topMoviesAliases,
  getMoviesStats
} = require('../controllers/moviesController')

const moviesRouter = express.Router()

moviesRouter.route('/top-5-movies').get(topMoviesAliases, getMovies)
moviesRouter.route('/movies-stats').get(getMoviesStats)
moviesRouter.route('/').post(validateAddMovie, addMovie).get(getMovies)
moviesRouter
  .route('/:id')
  .get(getMovie)
  .patch(validateUpdateMovie, updateMovie)
  .delete(deleteMovie)

module.exports = moviesRouter
