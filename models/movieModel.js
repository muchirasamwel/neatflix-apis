const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: String,
  rating: { type: Number, default: 4.5 },
  year: { type: Number, default: 2023 },
  cast: [String],
  genres: { type: [String], required: [true, 'genre is required'] },
  extract: String,
  thumbnail: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

movieSchema.pre('save', function (next) {
  this.slug = this.title.replace(/[^0-9a-zA-Z]/g, '-')
  next()
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie
