import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BrowseUsers from './pages/BrowseUsers';
import ProtectedRoute from './components/ProtectedRoute';
import SwapRequests from './pages/SwapRequests';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/browse" element={
          <ProtectedRoute><BrowseUsers /></ProtectedRoute>
        } />

        <Route path="/swaps" element={
          <ProtectedRoute><SwapRequests /></ProtectedRoute>
        } />
      
      </Routes>
    </Router>
  );
}

export default App;
