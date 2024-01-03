import React from 'react'
import './styles.css'

export default function Footer() {
  const getYear = () => {
    const today = new Date()
    return today.getFullYear()
  }
  return <div className="footer">Copyright &copy; {getYear()}</div>
}
