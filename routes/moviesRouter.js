const express = require('express')

const {
  addMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getMovieBySlug,
  validateAddMovie,
  validateUpdateMovie
} = require('../controllers/moviesController')

const moviesRouter = express.Router()

moviesRouter.param('slug', getMovieBySlug)

moviesRouter.route('/').post(validateAddMovie, addMovie).get(getMovies)
moviesRouter
  .route('/:slug')
  .get(getMovie)
  .patch(validateUpdateMovie, updateMovie)
  .delete(deleteMovie)

module.exports = moviesRouter
