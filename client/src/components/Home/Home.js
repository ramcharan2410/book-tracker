import React from 'react'
import { useState, useEffect } from 'react'
import Header from '../Header/Header.js'
import NewBookForm from '../NewBookForm/NewBookForm.js'
import BookList from '../BookList/BookList.js'
import Footer from '../Footer/Footer.js'
import './home.css'

const Home = ({ userName, email }) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const localhost_server_addr = process.env.LOCALHOST_SERVER_ADDR
  const vercel_server_addr = process.env.VERCEL_SERVER_ADDR
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${vercel_server_addr}/user/${userName}/books`
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
  }, [])

  return (
    <>
      <Header userName={userName} email={email} />
      <div className="container">
        <NewBookForm userName={userName} setBooks={setBooks} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <BookList userName={userName} books={books} setBooks={setBooks} />
        )}
      </div>
      <Footer />
    </>
  )
}

export default Home
