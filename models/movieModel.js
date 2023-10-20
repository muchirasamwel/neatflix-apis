const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: String,
  year: { type: Number, required: true, default: 2023 },
  cast: [String],
  genres: { type: [String], required: [true, 'genre is required'] },
  extract: String,
  thumbnail: { type: String, required: true }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
