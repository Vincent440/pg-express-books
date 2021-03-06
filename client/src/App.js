import { useEffect, useState } from 'react'

function App() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    // console.log('App loaded')
    getBooksByQuery()
  }, [])

  const getBooksByQuery = (searchQuery = 'Avis+Lang') => {
    fetch(`/api/books?search=${encodeURI(searchQuery).toLowerCase()}`)
      .then(res =>
        res.json().then(data => {
          console.log(data);
          return setBooks(data);
        })
      )
      .catch(errMsg => console.error(errMsg))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(`${query}`)
    // Don't search for empty queries
    if (query === '') return;

    getBooksByQuery(query)
    setQuery('')
  }
  const handleChange = (event) => {
    // console.log(`typed: ${event.target.value}`)
    setQuery(event.target.value)
  }

  return (
    <>
      <header className='p-5 bg-dark border border-top-0 rounded'>
        <h1 className='text-center display-2 p-3 text-light'>React Books</h1>
        <div className='card container'>
          <h2 className='card-title text-center'>Search Google Volume API</h2>

          <form id='book-form' className='card-body' onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" id="book-input" placeholder="Search by Title, Author, Etc."
                value={query} onChange={handleChange}
              />
              <label htmlFor="book-input">Search by Title, Author, Etc.</label>
            </div>
            <div className='row'>
              <div className='col text-center'>

                <button type="submit" onSubmit={handleSubmit} className="btn btn-primary btn-lg px-5">Search</button>
              </div>
            </div>
          </form>

        </div>
      </header>
      <main className='container'>
        <div className='row'>
          <div className='col-12'>
            {books.length === 0 ? (
              <h3 className='p-3 m-3 text-center'>No books to display.</h3>
            ) : (
              <div className='card m-3'>
                <ul className='list-group list-group-flush p-3'>
                  {
                    books.map(({ title, description = '', authors = '' , id}) => {
                      return (
                        <li key={id} className='list-group-item p-3'>
                          <h3>Title: {title}</h3>

                          {
                            description ? <p>Description: {description}</p> : null
                          }

                          <p>
                            Authors: {authors ? authors.join(', ') : null}
                          </p>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default App
