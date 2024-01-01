import { useState } from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './Home'
import Signup from './Signup'
import Login from './Login'
import ProtectedRoutes from './ProtectedRoutes'
const App = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={
              <Signup
                userName={userName}
                setUserName={setUserName}
                email={email}
                setEmail={setEmail}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                userName={userName}
                setUserName={setUserName}
                setEmail={setEmail}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}
          >
            <Route
              exact
              path={`/users/${userName}`}
              element={<Home userName={userName} email={email} />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
