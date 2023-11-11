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
const { authGuard } = require('../controllers/authController')

const moviesRouter = express.Router()

moviesRouter.route('/top-5-movies').get(topMoviesAliases, getMovies)
moviesRouter.route('/movies-stats').get(authGuard, getMoviesStats)
moviesRouter
  .route('/')
  .post(authGuard, validateAddMovie, addMovie)
  .get(getMovies)
moviesRouter
  .route('/:id')
  .get(getMovie)
  .patch(authGuard, validateUpdateMovie, updateMovie)
  .delete(authGuard, deleteMovie)

module.exports = moviesRouter
