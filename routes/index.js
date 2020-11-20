const router = require('express').Router()
const apiRoutes = require('./api')
const path = require('path')

// API Routes any route starting with '/api'
router.use('/api', apiRoutes)

router.get('/', (req, res) => {
  res.send(`<h1>pg-express-books API</h1>
  <p>Test the API in the browser, add "<strong>/api/?search=Author Name</strong>".</p> <p>Example search: <a href="http://localhost:${process.env.PORT || 3001}/api/?search=carl%20sagan">Carl Sagan</a></p>`)
})

// =========== SEND REACT PRODUCTION BUILD ====================
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

module.exports = router