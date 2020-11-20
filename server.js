'use strict'
require('dotenv').config()
const express = require('express')
const app = express()

const routes = require('./routes')
const PORT = process.env.PORT || 3001

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)

app.listen(PORT, () =>
  console.log(`pg-express-books API server running on:\nhttp://localhost:${PORT}`)
)
