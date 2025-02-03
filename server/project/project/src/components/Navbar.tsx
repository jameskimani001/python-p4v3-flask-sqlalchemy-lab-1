// import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Heart, LogOut, Menu, PlusCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-gray-800">FoodShare</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
            <Link to="/donations" className="text-gray-600 hover:text-gray-800">Browse Donations</Link>
            {user ? (
              <>
                <Link to="/donations/create" className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                  <PlusCircle className="h-5 w-5" />
                  <span>Donate Food</span>
                </Link>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-700">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar