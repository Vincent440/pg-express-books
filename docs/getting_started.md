# Getting Started with pg-express-books

1. You must [download postgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) 
    * Make sure it is successfully installed before moving on.

1. Install all the required packages using your preferred JavaScript package manager `yarn` or `npm`.
    * npm `npm i` 
    * yarn `yarn`

1. Create a `.env` file and place your database credentials inside it example: 

```r
PGUSER='postgres'
HOST='localhost'
PGPASSWORD='secret_password_text'
PGDATABASE='pg_express_books_db'
PGPORT=5432
# Optional 
KEY='google_books_volume_API_key'
```
