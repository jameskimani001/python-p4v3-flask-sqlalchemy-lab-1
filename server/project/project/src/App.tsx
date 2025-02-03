// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateDonation from './pages/CreateDonation';
import { AuthProvider } from './contexts/AuthContext';
import Donations from './components/Donations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-donation" element={<CreateDonation />} />
              <Route path="/donations" element={<Donations />} />
            </Routes>
          </div>
        </div>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;