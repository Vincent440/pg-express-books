const booksDB = require('../models/book.js')
const API = require('./api.js')

const queryDatabaseForAllBooksMatchingUrlSearchQuery = (req, res, next) => {
  if (
    typeof req.query.search === 'undefined' ||
    req.query.search.trim() === ''
  ) {
    return res
      .json({
        ERROR_IN_REQUEST: `Please enter a valid search. Example of a search for Carl Sagan: 'http://localhost:${process.env.PORT || 3001}/api/?search=carl%20sagan'`
      })
      .status(400)
  }
  console.log('searching for: ',
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
        // console.log(dbBookResults)
        return next()
      }
      // console.log('Books found logging and sending books as JSON.')
      // console.log(dbBookResults)
      return res.json(dbBookResults.rows).status(200)
    }
  )
}

const getBooksFromApiByQueryString = (req, res, next) => {
  const searchQuery = req.query.search.trim().toLowerCase()
  // console.log('Route middleware to search for new books from API')
  API.getBooksFromGoogleVolumeAPI(searchQuery, (apiError, apiBookResponse) => {
    console.log(`Searched google API for: ${searchQuery}`)

    if (apiError) {
      console.log(apiError)
      return res.send(apiError).status(404)
    }

    // console.log(apiBookResponse)
    if (typeof apiBookResponse === 'undefined') {
      return res
        .send(
          `Sorry, no books found for the search '${searchQuery}' try searching something else`
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
        // console.log('Inserting new book: ', oneBookRow)
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

module.exports = {
  queryDatabaseForAllBooksMatchingUrlSearchQuery,
  getBooksFromApiByQueryString
}