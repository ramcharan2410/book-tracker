import React from 'react'

export default function Footer() {
  const getYear = () => {
    const today = new Date()
    return today.getFullYear()
  }
  return <footer className="footer">Copyright &copy; {getYear()}</footer>
}
