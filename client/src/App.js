import logo from './logo.svg'
import './App.css'
import { useEffect, useState } from 'react'

function App () {
  const [books, setBooks] = useState([])

  useEffect(() => {
    console.log('App loaded')
    fetch('/api/?search=Avis+Lang')
      .then(res =>
        res.json().then(data => {
          setBooks(data)
          console.log(books)
          return
        })
      )
      .catch(errMsg => console.error(errMsg))
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>PG Express Books</h1>
        <img src={logo} className='App-logo' alt='logo' />
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <div>
          <ul>
            {books.length === 0 ? (
              <li>No books to display.</li>
            ) : (
              books.map(book => {
                return (
                  <li>
                    <h2>Title: {book.title}</h2>
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
      </header>
    </div>
  )
}

export default App
