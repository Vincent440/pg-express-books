'use strict'
// require('dotenv').config()
// Using 'dotenv' to securely store environment variables
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const { Pool, Client } = require('pg')

// Using 'axios' for HTTP/AJAX requests to the google books volume API
const axios = require('axios')

const googleVolumeApiURL = 'https://www.googleapis.com/books/v1/volumes'

const app = express()
// Dynamically setting port either in the .env or defaults to port 8000 if nothing in the env.
const PORT = process.env.PORT || 8000

// Database Connection (pool.js)
const pool = new Pool()

// Database Test using async await to test connection
// Comment out after succesful test
//
// const client = new Client()
// ;(async () => {
//   await client.connect()
//   const res = await client.query('SELECT $1::text as message', ['PostgreSQL database connected succesfully!'])
//   console.log(res.rows[0].message) // Hello world!
//   await client.end()
// })()

const connection = {
  /**
   *  @param {string} sqlQueryText The SQL Query to send to the PostgreSQL database
   *  @param params query parameters to send to the SQL database
   */
  query: (sqlQueryText, params) => pool.query(sqlQueryText, params)
}

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
    console.log('Inserting book into Database:', bookToInsert)
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
          q: query.trim().replace(' ', '+'),
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
    return res.status(400).json({
      ERROR_IN_REQUEST: `Please enter a valid search. Example of a search for Carl Sagan: 'http://localhost:${PORT}/?search=carl%20sagan'`
    })
  }
  console.log(
    'Route middleware calling books controller to search for:',
    req.query.search.trim()
  )

  booksDB.getAllDbBooksByQueryString(
    req.query.search.trim(),
    (databaseSelectError, dbBookResults) => {
      console.log(
        'Database response, error: ',
        databaseSelectError,
        '\n\nResults from Database: ',
        dbBookResults,
        '\n'
      )
      if (databaseSelectError) {
        return res.status(500).send(databaseSelectError)
      }
      if (dbBookResults.rowCount === 0) {
        return next()
      }
      return res.status(200).json(dbBookResults.rows)
    }
  )
}

const getBooksFromApiByQueryString = (req, res, next) => {
  const searchQuery = req.query.search.trim()
  console.log('Route middleware to search for new books from API')
  API.getBooksFromGoogleVolumeAPI(searchQuery, (apiError, apiBookResponse) => {
    console.log(
      'Searched google API for: ',
      searchQuery,
      '\nResponse data: ',
      apiBookResponse
    )
    if (apiError) {
      return res.status(404).send(apiError)
    }

    if (typeof apiBookResponse === 'undefined') {
      return res
        .status(200)
        .send(
          `Sorry, no books found for the search '${searchQuery}' perhaps try searching something else`
        )
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
          return res.status(404).send(error)
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
