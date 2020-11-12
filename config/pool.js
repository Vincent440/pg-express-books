const { Pool } = require('pg')

const pool = new Pool()

module.exports = {
  /**
   *  @param {string} sqlQueryText The SQL Query to send to the PostgreSQL database
   *  @param params query parameters to send to the SQL database
   */
  query: (sqlQueryText, params) => pool.query(sqlQueryText, params)
}
