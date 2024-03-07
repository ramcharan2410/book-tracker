require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const morgan = require('morgan')
const { Client } = require('pg')

const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())

const postgres_sql_user = process.env.POSTGRES_SQL_USER
const postgres_sql_host = process.env.POSTGRES_SQL_HOST
const postgres_sql_password = process.env.POSTGRES_SQL_PASSWORD

const corsConfig = {
  origin: ['https://book-tracker-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(corsConfig))
app.options('', cors(corsConfig))

app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

const PORT = process.env.PORT || 3001

const client = new Client({
  user: postgres_sql_user,
  host: postgres_sql_host,
  database: 'book-tracker',
  password: postgres_sql_password,
  port: 5432,
})

app.get('/', (req, res) => {
  res.json('Hello')
})
// THIS ONE FINALLY WORKED! (By removing this code)
// Connect to the database when the server starts
// client.connect().then(() => {
//   console.log('Connected to the database')
// })

// Middleware to make the client instance available to the request handlers
app.use((req, res, next) => {
  req.dbClient = client
  next()
})

const saltRounds = 10

app.post('/signup', async (req, res) => {
  const { userName, email, password } = req.body

  try {
    const existingUserName = await client.query(
      'SELECT * FROM users WHERE userName = $1',
      [userName]
    )
    const existingEmail = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (existingUserName.rows.length > 0) {
      return res.status(409).json({ message: 'UserName already exists' })
    }

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds)
    await client.query(
      'INSERT INTO users (userName, email, password) VALUES ($1, $2, $3)',
      [userName, email, hashedPassword]
    )

    return res
      .status(200)
      .json({ message: 'Signup successful', userName, email })
  } catch (err) {
    console.error('Signup error:', err.message)
    return res
      .status(400)
      .json({ message: 'Signup failed: Internal Server Error' })
  }
})

app.post('/login', async (req, res) => {
  const { userName, password } = req.body

  try {
    const result = await client.query(
      'SELECT * FROM users WHERE userName = $1',
      [userName]
    )

    if (result.rows.length > 0) {
      const match = await bcrypt.compare(password, result.rows[0].password)

      if (match) {
        return res.status(200).json({
          message: 'Login successful',
          userName: result.rows[0].userName,
          email: result.rows[0].email,
        })
      } else {
        return res
          .status(401)
          .json({ message: 'Login failed: Invalid credentials' })
      }
    } else {
      return res.status(404).json({ message: 'Login failed: User not found' })
    }
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
})

app.post('/users/:userName/addBook', async (req, res) => {
  const { userName } = req.params
  const { bookItem } = req.body

  const existingBook = await client.query(
    'SELECT * FROM userBooks WHERE userName = $1 AND name = $2',
    [userName, bookItem.name]
  )

  if (existingBook.rows.length > 0) {
    return res.status(400).json({
      message: 'Book already exists',
    })
  }

  try {
    await client.query(
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
    const books = await client.query(
      'SELECT * FROM userBooks WHERE userName = $1',
      [userName]
    )
    return res.status(200).json(books.rows)
  } catch (error) {
    console.error('Error fetching books:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/users/:userName/updateBook/:id', async (req, res) => {
  const { userName, id } = req.params
  const { pagesRead, status } = req.body

  try {
    await client.query(
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
    await client.query(
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
// Handle cleanup during server shutdown
app.on('close', () => {
  client.end().then(() => console.log('Database connection closed'))
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Server is shutting down')
  process.exit(0)
})
