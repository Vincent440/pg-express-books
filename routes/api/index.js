const router = require('express').Router()
const bookController = require('../../controller/book-controller.js')


router.get(
  '/books',
  bookController.queryDatabaseForAllBooksMatchingUrlSearchQuery,
  bookController.getBooksFromApiByQueryString,
  bookController.queryDatabaseForAllBooksMatchingUrlSearchQuery
)

module.exports = router;