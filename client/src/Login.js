import React, { useState } from 'react'
import LoginForm from './LoginForm'
import Footer from './Footer'
import './login.css'
const Login = (props) => {
  const { userName, setUserName, email, setEmail, setIsAuthenticated } = props
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [emailError, setEmailError] = useState('')

  const [action, setAction] = useState('login')

  return (
    <>
      <div className="app-header">
        <div>Book Tracker</div>
        <p className="app-tagline">Tagline</p>
      </div>
      <LoginForm
        userName={userName}
        setUserName={setUserName}
        password={password}
        setPassword={setPassword}
        email={email}
        setEmail={setEmail}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        emailError={emailError}
        setEmailError={setEmailError}
        action={action}
        setAction={setAction}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Footer />
    </>
  )
}

export default Login
