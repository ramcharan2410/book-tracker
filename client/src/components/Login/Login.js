import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../Footer/Footer.js'
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded'
import './login.css'

const Login = (props) => {
  const { userName, setUserName, setEmail, setIsAuthenticated } = props
  const [password, setPassword] = useState('')
  const [userNotFound, setUserNotFound] = useState(false)
  const [wrongUserName, setWrongUserName] = useState('')
  const [invalidPassword, setInvalidPassword] = useState(false)
  const navigate = useNavigate()
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      })

      const data = await response.json()
      console.log(data)
      if (data.message === 'Login successful') {
        setEmail(data.email)
        setIsAuthenticated(true)
        navigate(`/users/${userName}`)
      } else if (data.message === 'Login failed: Invalid credentials') {
        setIsAuthenticated(false)
        setUserNotFound(false)
        setInvalidPassword(true)
      } else if (data.message === 'Login failed: User not found') {
        setIsAuthenticated(false)
        setUserNotFound(true)
        setInvalidPassword(false)
        setWrongUserName(userName)
      }
    } catch (error) {
      console.error('Error during form submission:', error)
    }
  }
  return (
    <div className="login-page">
      <div className="login-navbar">
        <LocalLibraryRoundedIcon fontSize="large" />
        <div className="title">Book Tracker</div>
        <p className="signup-instead">
          Don't have an account? <a href="/signup">Signup instead</a>
        </p>
      </div>
      <div className="login-form">
        <form onSubmit={(e) => handleLoginSubmit(e)}>
          <label htmlFor="login-userName">Username:</label>
          <input
            type="text"
            value={userName}
            id="login-userName"
            name="login-userName"
            placeholder="Enter your username"
            required
            onChange={(e) => {
              setUserName(e.target.value)
              setUserNotFound(false)
            }}
          />
          <br />
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            value={password}
            id="login-password"
            name="login-password"
            placeholder="Enter your password"
            onChange={(e) => {
              setPassword(e.target.value)
              setInvalidPassword(false)
            }}
          />
          <br />
          <p
            className="invalid-password"
            style={{ display: invalidPassword ? 'block' : 'none' }}
          >
            Wrong password
          </p>
          <p
            className="user-not-found"
            style={{ display: userNotFound ? 'block' : 'none' }}
          >
            User with userName {wrongUserName} not found.
          </p>
          <button type="submit" className="login-button">
            Confirm Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default Login
