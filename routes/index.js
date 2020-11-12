const router = require('express').Router()
const apiRoutes = require('./api')
const path = require('path')

// API Routes any route starting with '/api'
router.use('/api', apiRoutes)

router.get('*', (req, res) => {
  res.send(`success. Test the API on http://localhost:${process.env.PORT || 3001}/api/?search=carl%20sagan`)
})
// // =========== SEND REACT PRODUCTION BUILD ====================
// router.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'))
// })

module.exports = router