// Database (db.js)
const connection = require('../config/pool.js')

module.exports = {
  getAllDbBooksByQueryString: (queryString, callBack) => {
    // console.log('Getting all books for the query string: ', queryString)
    const sqlSelectWhereQueryString =
      'SELECT title, authors, description, categories, publisher, published_date, preview_link FROM books WHERE query_string = $1'
    connection
      .query(sqlSelectWhereQueryString, [queryString])
      .then(dbResults => callBack(null, dbResults))
      .catch(dbSelectError => callBack(dbSelectError.stack, null))
  },
  insertOneBook: (bookToInsert, callBack) => {
    // console.log('Inserting book into Database:\n', bookToInsert)
    const sqlInsertOne =
      'INSERT INTO books (title, authors, description, categories, publisher, published_date, preview_link, query_string) VALUES($1, $2, $3, $4, $5, $6, $7, $8)'
    connection
      .query(sqlInsertOne, bookToInsert)
      .then(() => callBack(null))
      .catch(dbInsertError => callBack(dbInsertError.stack))
  }
}