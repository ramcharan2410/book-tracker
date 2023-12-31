import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = ({ userName }) => {
  const navigate = useNavigate()
  const reloadPage = () => {
    navigate(`/users/${userName}`)
  }
  const handleSignOut = (e) => {}
  return (
    <div className="navbar">
      <div className="title" onClick={reloadPage}>
        Book Tracker
      </div>
      <div className="userName">Welcome, {userName}</div>
      <button className="signOut" onClick={(e) => handleSignOut(e)}>
        Sign Out
      </button>
    </div>
  )
}

export default Header
