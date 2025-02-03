import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const CreateDonation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    location: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create a donation');
      return;
    }

    const { name, description, amount, location } = formData;
    const { error } = await supabase
      .from('donations')
      .insert([{ user_id: user.id, food_type: name, description, amount, location, status: 'available' }]);

    if (error) {
      toast.error('Error creating donation');
    } else {
      toast.success('Donation created successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create Donation</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter donation name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            required
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter donation description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            required
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter donation amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
            placeholder="Enter pickup address"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create Donation
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonation;