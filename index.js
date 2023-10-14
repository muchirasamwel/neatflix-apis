const express = require('express')
const fs = require('fs')

let movies = JSON.parse(fs.readFileSync(__dirname + '/dev-data/movies.json'))

const app = express()
app.use(express.json())

app.get('/api/v1/movies/:slug', (req, res) => {
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
})

app.get('/api/v1/movies', (req, res) => {
  return res.status(200).json({
    status: 'success',
    count: movies.length,
    data: movies
  })
})

app.post('/api/v1/movies', (req, res) => {
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
})

app.listen(3000, () => {
  console.log('Server ready..')
})
