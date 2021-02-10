import './App.css'
import { useEffect, useState } from 'react'

function App () {
  const [books, setBooks] = useState([])

  useEffect(() => {
    // console.log('App loaded')
    fetch('/api/books?search=Avis+Lang')
      .then(res =>
        res.json().then(data => {
          // console.log(data);
          setBooks(data)
          // console.log(books)
          return
        })
      )
      .catch(errMsg => console.error(errMsg))
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>PG Express Books</h1>
      </header>
        <div>
          <ul>
            {books.length === 0 ? (
              <li>No books to display.</li>
            ) : (
              
              books.map(book => {
                return (
                  <li key={book.title}>
                    <h3>Title: {book.title}</h3>
                    <p>
                      Description: {book.description || ''}
                    </p>
                    <p>
                      Authors: {book.authors.join(', ')}
                    </p>
                  </li>
                )
              })
            )}
          </ul>
        </div>
    </div>
  )
}

export default App
