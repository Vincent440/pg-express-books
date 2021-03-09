// Database (db.js)
const connection = require('../config/pool.js')

module.exports = {
  getAllDbBooksByQueryString: (queryString, callBack) => {
    const sqlSelectWhereQueryString =
      'SELECT title, authors, description, categories, publisher, published_date, preview_link, id FROM books WHERE query_string = $1'
    connection
      .query(sqlSelectWhereQueryString, [queryString])
      .then(dbResults => callBack(null, dbResults))
      .catch(dbSelectError => callBack(dbSelectError.stack, null))
  },
  insertBook: (newBook) => {
    return new Promise((resolve, reject) => {
      const sqlInsertOne =
        `INSERT INTO books (title, authors, description, categories, publisher, published_date, preview_link, query_string) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)`;

      connection
        .query(sqlInsertOne, newBook)
        .then((result) => resolve(result.rowCount))
        .catch(dbInsertError => reject(dbInsertError.stack))
    })
  },
}