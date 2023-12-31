import React from 'react'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Header from './Header'
import NewBookForm from './NewBookForm'
import BookList from './BookList'
import Footer from './Footer'

const Home = ({ userName, email }) => {
  const [books, setBooks] = useState([])
  const onSubmit = async (newBook) => {
    const bookItem = {
      id: uuidv4(),
      ...newBook,
    }
    try {
      await fetch('/:userName/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookItem),
      })
      setBooks((prevBooks) => [...prevBooks, bookItem])
    } catch (error) {
      console.error('Error adding book:', error)
    }
  }
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/:userName/books')
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    fetchBooks()
  }, [])
  return (
    <>
      <div className="home-page">
        <Header userName={userName} />
        <div className="container">
          <NewBookForm onSubmit={onSubmit} />
          <BookList books={books} setBooks={setBooks} />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Home
