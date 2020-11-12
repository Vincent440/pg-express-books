'use strict'
require('dotenv').config()
const express = require('express')
const app = express()

const routes = require('./routes')
const PORT = process.env.PORT || 3001
app.use(routes)

app.listen(PORT, () =>
  console.log(`pg-express-books server running on\nhttp://localhost:${PORT}`)
)
