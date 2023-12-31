import { useState } from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import ProtectedRoutes from './ProtectedRoutes'
import './styles.css'

function App() {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              userName={userName}
              setUserName={setUserName}
              email={email}
              setEmail={setEmail}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
          <Route
            exact
            path={`/users/${userName}`}
            element={<Home userName={userName} email={email} />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
