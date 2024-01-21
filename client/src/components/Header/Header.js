import React from 'react'
import { useNavigate } from 'react-router-dom'
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded'
import './header.css'

const Header = ({ userName, email }) => {
  const navigate = useNavigate()
  const reloadPage = () => {
    navigate(`users/${userName}`)
    // but this is taking back to the login page
  }
  const handleLogOut = (e) => {
    navigate('/login')
  }
  return (
    <div className="home-navbar">
      <LocalLibraryRoundedIcon fontSize="large" />
      <div className="title" onClick={reloadPage}>
        Book Tracker
      </div>
      <div className="userName">{userName}'s Library</div>
      <button className="logout" onClick={(e) => handleLogOut(e)}>
        Logout
      </button>
    </div>
  )
}

export default Header
