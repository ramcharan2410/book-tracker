import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = (props) => {
  const {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    action,
    setAction,
    setIsAuthenticated,
  } = props
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const [userExists, setUserExists] = useState(false) // for signin error
  const [userNotFound, setUserNotFound] = useState(false) // for login error
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
  const navigate = useNavigate()
  const handleSignUpClick = () => {
    setShowSignUp(true)
    setShowLogin(false)
    setPassword('')
    setPasswordError('')
    setAction('signup')
  }

  const handleLoginClick = () => {
    setShowLogin(true)
    setShowSignUp(false)
    setPassword('')
    setPasswordError('')
    setAction('login')
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log(e)
    if (email.length === 0) {
      setEmailError('Enter a valid email')
      return
    }
    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer')
      return
    }
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, userName, email, password }),
      })

      const data = await response.json()
      console.log(data)
      if (data.message === 'User already exists') {
        setIsAuthenticated(false)
        setUserExists(true)
      } else if (data.message === 'Signup successful') {
        setIsAuthenticated(true)
        navigate(`/users/${userName}`)
      } else if (data.message === 'Login successful') {
        setIsAuthenticated(true)
        navigate(`/users/${userName}`)
      } else if (data.message === 'Login failed: Invalid Credentials') {
        setIsAuthenticated(false)
        setInvalidCredentials(true)
      } else if (data.message === 'Login failed: User not found') {
        setUserNotFound(true)
      }
    } catch (error) {
      console.error('Error during form submission:', error)
    }
  }
  return (
    <>
      <div className="signForm">
        <div className="signHeader">
          <button
            className={`signUpHeader`}
            onClick={handleSignUpClick}
            style={{ backgroundColor: showSignUp ? 'grey' : 'black' }}
          >
            Sign Up
          </button>
          <button
            className={`LoginHeader`}
            onClick={handleLoginClick}
            style={{ backgroundColor: showLogin ? 'grey' : 'black' }}
          >
            Login
          </button>
        </div>

        {showSignUp && (
          <div className="signUp">
            <form onSubmit={(e) => handleFormSubmit(e)}>
              <label htmlFor="signup-username">Username:</label>
              <input
                value={userName}
                type="text"
                id="signup-username"
                name="signup-username"
                placeholder="Enter a username"
                required
                onChange={(e) => setUserName(e.target.value)}
              />
              <br />
              <label htmlFor="signup-email">Email:</label>
              <input
                type="email"
                value={email}
                id="signup-email"
                placeholder="Enter your Email here"
                name="signup-email"
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (!emailRegex.test(e.target.value)) {
                    setEmailError('Enter a valid email')
                  } else {
                    setEmailError('')
                  }
                }}
              />
              <label className="errorLabel">{emailError}</label>
              <br />
              <label htmlFor="signup-password">Password:</label>
              <input
                type="password"
                value={password}
                id="signup-password"
                name="signup-password"
                placeholder="Enter a strong password"
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (e.target.value.length === 0) {
                    setPasswordError('Please enter a password')
                  } else if (e.target.value.length < 8) {
                    setPasswordError(
                      'The password must be 8 characters or longer'
                    )
                  } else {
                    setPasswordError('')
                  }
                }}
              />
              <label className="errorLabel">{passwordError}</label>
              <br />
              {userExists && (
                <p className="user-exists">
                  User already exists. Please Log In.
                </p>
              )}
              <button type="submit" className="signUp-button">
                Confirm Sign Up
              </button>
            </form>
          </div>
        )}

        {showLogin && (
          <div className="login">
            <form onSubmit={(e) => handleFormSubmit(e)}>
              <label htmlFor="login-username">Username:</label>
              <input
                type="text"
                value={userName}
                id="login-username"
                name="login-username"
                placeholder="Enter your username"
                required
                onChange={(e) => setUserName(e.target.value)}
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
                  if (e.target.value.length === 0) {
                    setPasswordError('Please enter a password')
                  } else if (e.target.value.length < 8) {
                    setPasswordError(
                      'The password must be 8 characters or longer'
                    )
                  } else {
                    setPasswordError('')
                  }
                }}
              />
              <label className="errorLabel">{passwordError}</label>
              <br />
              {invalidCredentials && (
                <p className="invalid-credentials">Wrong password</p>
              )}
              {userNotFound && (
                <p className="user-not-found">
                  User with above userName not found.
                </p>
              )}
              <button type="submit" className="login-button">
                Confirm Login
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

export default LoginForm
