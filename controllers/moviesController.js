const fs = require('fs')

let movies = JSON.parse(fs.readFileSync(__dirname + '/../dev-data/movies.json'))

const getMovie = (req, res) => {
  const movie = movies.find(m => m.href == req.params.slug)
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
}

const getMovies = (req, res) => {
  return res.status(200).json({
    status: 'success',
    count: movies.length,
    data: movies
  })
}

const addMovie = (req, res) => {
  const movie = req.body

  movie.href = movie.title?.replace(/ /g, '')
  movies = [...movies, movie]

  fs.writeFile(
    __dirname + '/dev-data/movies.json',
    JSON.stringify(movies),
    err => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: err.message
        })
      }
      return res.status(200).json({
        status: 'success',
        data: movie
      })
    }
  )
}

const updateMovie = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Not implemented'
  })
}

const deleteMovie = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Not implemented'
  })
}

module.exports = { addMovie, getMovie, updateMovie, getMovies, deleteMovie }
