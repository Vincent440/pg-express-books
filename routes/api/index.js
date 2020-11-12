const router = require('express').Router()
const bookController = require('../../controller/book-controller.js')


router.get(
  '*',
  bookController.queryDatabaseForAllBooksMatchingUrlSearchQuery,
  bookController.getBooksFromApiByQueryString,
  bookController.queryDatabaseForAllBooksMatchingUrlSearchQuery
)

module.exports = router;