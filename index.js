const express = require('express')
const fs = require('fs')

let movies = JSON.parse(fs.readFileSync(__dirname + '/dev-data/movies.json'))

const app = express()
app.use(express.json())

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
  // return res.status(200).json({
  //   status: 'success'
  // })
}

const deleteMovie = (req, res) => {
  // return res.status(200).json({
  //   status: 'success',
  // })
}
// app.get('/api/v1/movies/:slug', getMovie)
// app.get('/api/v1/movies', getMovies)
// app.post('/api/v1/movies', addMovie)

app.route('/api/v1/movies').post(addMovie).get(getMovies)
app
  .route('/api/v1/movies/:slug')
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie)

app.listen(3000, () => {
  console.log('Server ready..')
})
