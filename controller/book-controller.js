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
    if (apiError) {
      console.log(apiError)
      return res.send(apiError).status(404)
    }
    console.log(`Searched google API for: ${searchQuery}`)
    // console.log(apiBookResponse)
    if (typeof apiBookResponse === 'undefined') {
      return res
        .send(
          `Sorry, no books found for the search '${searchQuery}' try searching something else`
        )
        .status(200)
    }

    const booksList = []

    apiBookResponse.forEach(volume => {
      let {
        title = '',
        authors = [],
        description = '',
        categories = [],
        publisher = '',
        publishedDate = '',
        previewLink = ''
      } = volume.volumeInfo

      if (description !== '') {
        description = description.substring(0, 140)
      }

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


      booksList.push(oneBookRow);

    })// End of for Each Loop

    const promiseList = booksList.map(book => booksDB.insertBook(book))

    Promise.all(promiseList)
      .then((results) => {
        next()
        console.log(`Inserted ${results.length} Books, called next()`);
      }).catch(error => {
        console.log(error);
        next()
      })
  })

}

module.exports = {
  queryDatabaseForAllBooksMatchingUrlSearchQuery,
  getBooksFromApiByQueryString
}