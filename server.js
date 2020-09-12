'use strict'
// Using 'dotenv' to securely store environment variables
require('dotenv').config()
const axios = require('axios')
const express = require('express')
const connection = require('./config/pool.js')
const app = express()
// Dynamically setting port either in the .env or defaults to port 8000 if nothing in the env.
const PORT = process.env.PORT || 8000
// Using 'axios' for HTTP/AJAX requests to the google books volume API
const googleVolumeApiURL = 'https://www.googleapis.com/books/v1/volumes'

// Database (db.js)
const booksDB = {
  getAllDbBooksByQueryString: (queryString, callBack) => {
    console.log('Getting all books for the query string: ', queryString)
    const sqlSelectWhereQueryString =
      'SELECT title, authors, description, categories, publisher, published_date, preview_link FROM books WHERE query_string = $1'
    connection
      .query(sqlSelectWhereQueryString, [queryString])
      .then(dbResults => callBack(null, dbResults))
      .catch(dbSelectError => callBack(dbSelectError.stack, null))
  },
  insertOneBook: (bookToInsert, callBack) => {
    console.log('Inserting book into Database:\n', bookToInsert)
    const sqlInsertOne =
      'INSERT INTO books (title, authors, description, categories, publisher, published_date, preview_link, query_string) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
    connection
      .query(sqlInsertOne, bookToInsert)
      .then(() => callBack(null))
      .catch(dbInsertError => callBack(dbInsertError.stack))
  }
}
// Routes (api.js)

// Route Middleware (server.js)
const API = {
  getBooksFromGoogleVolumeAPI: (query, callBack) => {
    console.log('Get new books from Google Volume API searching for:', query)
    axios
      .get(googleVolumeApiURL, {
        params: {
          q: query
            .trim()
            .replace(' ', '+')
            .toLowerCase(),
          key: process.env.KEY
        }
      })
      .then(booksApiResponse => callBack(null, booksApiResponse.data.items))
      .catch(apiError => callBack(apiError))
  }
}

const queryDatabaseForAllBooksMatchingUrlSearchQuery = (req, res, next) => {
  if (
    typeof req.query.search === 'undefined' ||
    req.query.search.trim() === ''
  ) {
    return res
      .json({
        ERROR_IN_REQUEST: `Please enter a valid search. Example of a search for Carl Sagan: 'http://localhost:${PORT}/?search=carl%20sagan'`
      })
      .status(400)
  }
  console.log(
    'Route middleware calling books controller to search for:',
    req.query.search.trim().toLowerCase()
  )

  booksDB.getAllDbBooksByQueryString(
    req.query.search.trim().toLowerCase(),
    (databaseSelectError, dbBookResults) => {
      if (databaseSelectError) {
        console.log(databaseSelectError)
        return res.send(databaseSelectError).status(500)
      }
      if (dbBookResults.rowCount === 0) {
        console.log('Books not found, calling next()')
        console.log(dbBookResults)
        return next()
      }
      console.log('Books found logging and sending books as JSON.')
      console.log(dbBookResults)
      return res.json(dbBookResults.rows).status(200)
    }
  )
}

const getBooksFromApiByQueryString = (req, res, next) => {
  const searchQuery = req.query.search.trim().toLowerCase()
  console.log('Route middleware to search for new books from API')
  API.getBooksFromGoogleVolumeAPI(searchQuery, (apiError, apiBookResponse) => {
    console.log('Searched google API for: ', searchQuery)

    if (apiError) {
      console.log(apiError)
      return res.send(apiError).status(404)
    }

    console.log(apiBookResponse)
    if (typeof apiBookResponse === 'undefined') {
      return res
        .send(
          `Sorry, no books found for the search '${searchQuery}' perhaps try searching something else`
        )
        .status(200)
    }

    apiBookResponse.forEach(volume => {
      let {
        title,
        authors,
        description,
        categories,
        publisher,
        publishedDate,
        previewLink
      } = volume.volumeInfo
      typeof description === 'undefined'
        ? null
        : (description = description.substring(0, 140))
      const oneBookRow = [
        title,
        authors,
        description,
        categories,
        publisher,
        publishedDate,
        previewLink,
        searchQuery
      ]

      booksDB.insertOneBook(oneBookRow, error => {
        console.log('Inserting new book: ', oneBookRow)
        if (error) {
          return res.send(error).status(404)
        }
      })
    })
    setTimeout(() => {
      // Set timeout and call database to check for search query
      next()
    }, 250)
  })
}

app.get(
  '*',
  queryDatabaseForAllBooksMatchingUrlSearchQuery,
  getBooksFromApiByQueryString,
  queryDatabaseForAllBooksMatchingUrlSearchQuery
)

app.listen(PORT, () =>
  console.log(`pg-express-books server running on\nhttp://localhost:${PORT}`)
)
