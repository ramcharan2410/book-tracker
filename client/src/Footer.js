import React from 'react'
import './styles.css'

export default function Footer() {
  const getYear = () => {
    const today = new Date();
    return today.getFullYear();
  }
  return (
    <footer className='footer'>
      Copyright &copy; {getYear()}
    </footer>
  )
}