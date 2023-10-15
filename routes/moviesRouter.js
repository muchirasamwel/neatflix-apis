const express = require('express')

const {
  addMovie,
  getMovies,
  getMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/moviesController')

const moviesRouter = express.Router()

moviesRouter.route('/').post(addMovie).get(getMovies)
moviesRouter
  .route('/:slug')
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie)

module.exports = moviesRouter
