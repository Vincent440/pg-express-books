'use strict'
// Using 'dotenv' to securely store environment variables
require('dotenv').config()
const express = require('express')
const app = express()
// Dynamically setting port either in the .env or defaults to port 8000 if nothing in the env.
const PORT = process.env.PORT || 8000
const bookController = require('./controller/book-controller.js')

// const apiRoutes = require('./routes/api-routes.js')

app.get(
  '*',
  bookController.queryDatabaseForAllBooksMatchingUrlSearchQuery,
  bookController.getBooksFromApiByQueryString,
  bookController.queryDatabaseForAllBooksMatchingUrlSearchQuery
)

app.listen(PORT, () =>
  console.log(`pg-express-books server running on\nhttp://localhost:${PORT}`)
)
