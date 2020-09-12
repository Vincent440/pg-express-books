const { Pool } = require('pg')

const pool = new Pool()

//
// const client = new Client()
// ;(async () => {
//   await client.connect()
//   const res = await client.query('SELECT $1::text as message', ['PostgreSQL database connected succesfully!'])
//   console.log(res.rows[0].message) // Hello world!
//   await client.end()
// })()

module.exports = {
  /**
   *  @param {string} sqlQueryText The SQL Query to send to the PostgreSQL database
   *  @param params query parameters to send to the SQL database
   */
  query: (sqlQueryText, params) => pool.query(sqlQueryText, params)
}
