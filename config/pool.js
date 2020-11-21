const { Pool } = require('pg')

// Pass deployed credentials Database URL or  empty to pull from .env
const connectionString = process.env.DATABASE_URL || ''

const pool = new Pool({ connectionString })

module.exports = {
  /**
   *  @param {string} sqlQueryText The SQL Query to send to the PostgreSQL database
   *  @param params query parameters to send to the SQL database
   */
  query: (sqlQueryText, params) => pool.query(sqlQueryText, params)
}
