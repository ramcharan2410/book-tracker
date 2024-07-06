import React from 'react'
import { useState, useEffect } from 'react'
import ReactLoading from 'react-loading';
import Header from './Header.js'
import BookList from './BookList.js'
import Footer from './Footer.js'

const Home = ({ userName, email }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const localhost_server_addr = 'http://localhost:3001'
  const vercel_server_addr = 'https://book-tracker-backend.onrender.com'
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${localhost_server_addr}/user/${userName}/books`
        )
        const data = await response.json()
        if (data) {
          setBooks(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
        setLoading(false)
      }
    }
    fetchBooks()
    // add some time for loading books
  }, [])

  return (
    <>
      <Header
        userName={userName}
        email={email}
        setBooks={setBooks}
      />
      <div className="container">
        {loading ? (
          <div className='loading'>
            <ReactLoading type='bars' color='black' />
          </div>
        ) : (
          <BookList userName={userName} books={books} setBooks={setBooks} />
        )}
      </div>
      <Footer />
    </>
  )
}

export default Home