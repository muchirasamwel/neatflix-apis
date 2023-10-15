const express = require('express')

const {
  addMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  getMovieBySlug
} = require('../controllers/moviesController')

const moviesRouter = express.Router()

moviesRouter.param('slug', getMovieBySlug)
moviesRouter.route('/').post(addMovie).get(getMovies)
moviesRouter
  .route('/:slug')
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie)

module.exports = moviesRouter
