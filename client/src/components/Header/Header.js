import React from 'react'
import { useNavigate } from 'react-router-dom'
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded'
import './header.css'

const Header = ({ userName, email }) => {
  const navigate = useNavigate()
  const reloadPage = () => {
    window.location.reload()
  }
  const handleLogOut = (e) => {
    navigate('/login')
  }
  return (
    <div className="home-navbar">
      <div className="title" onClick={reloadPage}>
        <LocalLibraryRoundedIcon fontSize="large" />
        Book Tracker
      </div>
      <div className="userName" title={email}>
        {userName}'s Library
      </div>
      <button className="logout" onClick={(e) => handleLogOut(e)}>
        Logout
      </button>
    </div>
  )
}

export default Header
