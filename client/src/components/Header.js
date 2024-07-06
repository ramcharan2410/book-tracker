import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBookReader, FaUserCircle } from "react-icons/fa";
import { BiSolidBookAdd } from "react-icons/bi";
import NewBookForm from './NewBookForm';
import UserProfileModal from './UserProfileModal';

const Header = ({ userName, email }) => {
  const navigate = useNavigate()
  const [addNewBook, setAddNewBook] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const handleUserIconClick = () => {
    setShowProfile(!showProfile)
  }
  const handleLogOut = (e) => {
    navigate('/login')
  }
  return (
    <>
      <div className="home-navbar">
        <div className="header-title">
          <FaBookReader color='black' />
          Book Tracker
        </div>
        <div className="add-new-book" onClick={() => setAddNewBook(true)}>
          <BiSolidBookAdd color='black' />
          New Book
        </div>
        <div className="userName-icon" title={userName} onClick={handleUserIconClick}>
          <FaUserCircle color='black' size={30} />
        </div>
        <button className="logout" onClick={(e) => handleLogOut(e)}>
          Logout
        </button>
      </div>
      {
        showProfile && (
          <UserProfileModal
            userName={userName}
            email={email}
            setShowProfile={setShowProfile}
          />
        )}
      {addNewBook && (
        <NewBookForm />
      )}
    </>
  )
}

export default Header
