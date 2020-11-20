import logo from './logo.svg'
import './App.css'
import { useEffect } from 'react'

function App () {
  useEffect(() => {
    console.log('App loaded')
    fetch('/api/?search=Avis+Lang')
      .then(res => res.json().then(data => console.log(data)))
      .catch(errMsg => console.err(errMsg))
  })
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Check the console!
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App