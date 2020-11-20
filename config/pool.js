const { Pool } = require('pg')

// Pass deployed credentials or empty object to pull from .env
const pool = new Pool(process.env.DATABASE_URL || {})

module.exports = {
  /**
   *  @param {string} sqlQueryText The SQL Query to send to the PostgreSQL database
   *  @param params query parameters to send to the SQL database
   */
  query: (sqlQueryText, params) => pool.query(sqlQueryText, params)
}
