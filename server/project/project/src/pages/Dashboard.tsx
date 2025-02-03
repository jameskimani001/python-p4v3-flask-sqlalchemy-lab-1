import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Donation {
  id: string;
  food_type: string;
  description: string;
  amount: number;
  status: 'available' | 'claimed' | 'completed' | 'cancelled';
  location: string;
  created_at: string;
}

interface Claim {
  id: string;
  donation: Donation;
  claimed_at: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    location: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user's donations
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (donationsError) throw donationsError;
        setDonations(donationsData || []);

        // Fetch user's claims
        const { data: claimsData, error: claimsError } = await supabase
          .from('claims')
          .select(`
            *,
            donation:donations (*)
          `)
          .eq('user_id', user.id)
          .order('claimed_at', { ascending: false });

        if (claimsError) throw claimsError;
        setClaims(claimsData || []);
      } catch (error) {
        toast.error('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

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
      .insert([{ user_id: user.id, food_type: name, description, amount: parseFloat(amount), location, status: 'available' }]);

    if (error) {
      toast.error('Error creating donation');
    } else {
      toast.success('Donation created successfully!');
      setFormData({ name: '', description: '', amount: '', location: '' });
      // Refresh donations list
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!donationsError) {
        setDonations(donationsData || []);
      }
    }
  };

  const startEditing = (id: string) => {
    const donation = donations.find(d => d.id === id);
    if (donation) {
      setFormData({
        name: donation.food_type,
        description: donation.description,
        amount: donation.amount.toString(),
        location: donation.location
      });
      setEditingId(id);
    }
  };

  const updateDonation = async () => {
    if (editingId !== null && user) {
      const { name, description, amount, location } = formData;
      const { error } = await supabase
        .from('donations')
        .update({ food_type: name, description, amount: parseFloat(amount), location })
        .eq('id', editingId)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Error updating donation');
      } else {
        toast.success('Donation updated successfully!');
        setFormData({ name: '', description: '', amount: '', location: '' });
        setEditingId(null);
        // Refresh donations list
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!donationsError) {
          setDonations(donationsData || []);
        }
      }
    }
  };

  const deleteDonation = async (id: string) => {
    if (user) {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Error deleting donation');
      } else {
        toast.success('Donation deleted successfully!');
        // Refresh donations list
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!donationsError) {
          setDonations(donationsData || []);
        }
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredDonations = donations.filter(donation =>
    donation.food_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* My Donations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Donations</h2>
          <input
            type="text"
            placeholder="Search donations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          />
          {filteredDonations.length === 0 ? (
            <p className="text-gray-500">No donations found</p>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{donation.food_type}</h3>
                      <p className="text-sm text-gray-600">{donation.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        <Clock className="inline-block h-4 w-4 mr-1" />
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      donation.status === 'available' ? 'bg-green-100 text-green-800' :
                      donation.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                      donation.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => startEditing(donation.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDonation(donation.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donate Food Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Donate Food</h2>
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
              {editingId !== null ? (
                <button
                  type="button"
                  onClick={updateDonation}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Update Donation
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Donate Food
                </button>
              )}
              {editingId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ name: '', description: '', amount: '', location: '' });
                    setEditingId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* My Claims */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">My Claims</h2>
        {claims.length === 0 ? (
          <p className="text-gray-500">No claims yet</p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{claim.donation.food_type}</h3>
                    <p className="text-sm text-gray-600">{claim.donation.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      <Clock className="inline-block h-4 w-4 mr-1" />
                      Claimed on {new Date(claim.claimed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                    claim.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {claim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;