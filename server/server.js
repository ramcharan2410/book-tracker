const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const { Pool } = require('pg')
require('dotenv').config()
const app = express()
app.use(morgan(':method :url :status :res[content-length] - :response-time ms')) // console.log(details of the HTTP request)
app.use(express.json()) // for parsing JSON requests
const postgres_sql_user = process.env.POSTGRES_SQL_USER
const postgres_sql_host = process.env.POSTGRES_SQL_HOST
const postgres_sql_password = process.env.POSTGRES_SQL_PASSWORD
const localhost_client_addr = process.env.LOCALHOST_CLIENT_ADDR
const vercel_client_addr = process.env.VERCEL_CLIENT_ADDR

app.use(
  cors({
    origin: [localhost_client_addr, vercel_client_addr],
  })
)

app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

const PORT = 3001
const pool = new Pool({
  user: postgres_sql_user,
  host: postgres_sql_host,
  database: 'book-tracker',
  password: postgres_sql_password,
  port: 5432,
})

const saltRounds = 10
app.get('/', (req, res) => {
  res.json('Hello')
})
app.post('/signup', async (req, res) => {
  // console.log(req.body)
  const { userName, email, password } = req.body
  try {
    const existingUserName = await pool.query(
      'SELECT * FROM users WHERE userName = $1',
      [userName]
    )
    const existingEmail = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    if (existingUserName) {
      console.log(existingUserName)
      return res.status(409).json({ message: 'UserName already exists' })
      // 409 => Resource already exists
    }
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' })
      // 409 => Resource already exists
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    await pool.query(
      'INSERT INTO users (userName, email, password) VALUES ($1, $2, $3)',
      [userName, email, hashedPassword]
    )
    return res
      .status(200)
      .json({ message: 'Signup successful', userName: userName, email: email })
  } catch (err) {
    console.error('Signup error:', err.message)
    return res
      .status(400)
      .json({ message: 'Signup failed: Internal Server Error' })
  }
})
app.post('/login', async (req, res) => {
  // console.log(req.body)
  const { userName, password } = req.body
  try {
    const row = await pool.query('SELECT * FROM users WHERE userName = $1', [
      userName,
    ])
    console.log(row)
    if (row.length > 0) {
      const match = await bcrypt.compare(password, row.password)

      if (match) {
        return res.status(200).json({
          message: 'Login successful',
          userName: row.userName,
          email: row.email,
        })
      } else {
        return res
          .status(401)
          .json({ message: 'Login failed: Invalid credentials' })
        // 401 => Unauthorized
      }
    } else {
      return res.status(404).json({ message: 'Login failed: User not found' })
      // 404 => Not Found
    }
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

app.post('/users/:userName/addBook', async (req, res) => {
  const { userName } = req.params
  const { bookItem } = req.body
  // console.log(userName, bookItem)
  const existingBook = await pool.query(
    'SELECT * FROM userBooks WHERE userName = $1 AND name = $2',
    [userName, bookItem.name]
  )
  if (existingBook) {
    return res.status(400).json({
      message: 'Book already exists',
    })
  }
  try {
    await pool.query(
      `
      INSERT INTO userBooks (id, userName, name, author, year, pages, genre, status, pagesRead)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        bookItem.id,
        userName,
        bookItem.name,
        bookItem.author,
        bookItem.year,
        bookItem.pages,
        bookItem.genre,
        bookItem.status,
        bookItem.pagesRead,
      ]
    )
    return res.status(200).json({ message: 'Book added successfully' })
  } catch (error) {
    console.error('Error adding book:', error)
    return res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message })
  }
})

app.get('/user/:userName/books', async (req, res) => {
  const { userName } = req.params

  try {
    const books = await pool.query(
      `
      SELECT * FROM userBooks
      WHERE userName = $1
    `,
      [userName]
    )

    return res.status(200).json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.put('/users/:userName/updateBook/:id', async (req, res) => {
  const { userName, id } = req.params
  const { pagesRead, status } = req.body

  try {
    await pool.query(
      `
      UPDATE userBooks
      SET pagesRead = $1,
          status = $2
      WHERE userName = $3 AND id = $4
    `,
      [pagesRead, status, userName, id]
    )
    return res.status(200).json({ message: 'Book updated successfully' })
  } catch (error) {
    console.error('Error updating book:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})
app.delete('/users/:userName/deleteBook/:id', async (req, res) => {
  const { userName, id } = req.params

  try {
    await pool.query(
      `
      DELETE FROM userBooks
      WHERE userName = $1 AND id = $2
    `,
      [userName, id]
    )

    return res.status(200).json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
