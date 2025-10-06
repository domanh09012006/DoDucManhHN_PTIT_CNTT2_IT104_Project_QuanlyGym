import Register from './pages/user/Register'
import HomePage from './pages/user/HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/user/Login'
import BookingPage from './pages/user/BookingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App