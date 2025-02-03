import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Donation {
  id: number;
  name: string;
  description: string;
  quantity: number;
  location: string;
  status: 'available' | 'claimed' | 'picked up';
}

const initialDonations: Donation[] = [
  { id: 1, name: 'Donation 1', description: 'Description for donation 1', quantity: 10, location: 'New York', status: 'available' },
  { id: 2, name: 'Donation 2', description: 'Description for donation 2', quantity: 20, location: 'Los Angeles', status: 'available' },
  { id: 3, name: 'Donation 3', description: 'Description for donation 3', quantity: 30, location: 'Chicago', status: 'available' },
];

const Donations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>(() => {
    const savedDonations = localStorage.getItem('donations');
    return savedDonations ? JSON.parse(savedDonations) : initialDonations;
  });
  const [newDonation, setNewDonation] = useState<Partial<Donation>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedDonations, setClaimedDonations] = useState<Donation[]>(() => {
    const savedClaimedDonations = localStorage.getItem('claimedDonations');
    return savedClaimedDonations ? JSON.parse(savedClaimedDonations) : [];
  });
  const [history, setHistory] = useState<Donation[]>(() => {
    const savedHistory = localStorage.getItem('history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const email = localStorage.getItem('userEmail') || 'guest@example.com';
  const firstName = email.split('@')[0];

  useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('claimedDonations', JSON.stringify(claimedDonations));
  }, [claimedDonations]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDonation({ ...newDonation, [name]: value });
  };

  const addDonation = () => {
    if (newDonation.name && newDonation.description && newDonation.quantity && newDonation.location) {
      const newId = donations.length ? donations[donations.length - 1].id + 1 : 1;
      setDonations([...donations, { ...newDonation, id: newId, status: 'available' } as Donation]);
      setNewDonation({});
      toast.success('Donation added successfully!');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const startEditing = (id: number) => {
    const donation = donations.find(d => d.id === id);
    if (donation) {
      setNewDonation(donation);
      setEditingId(id);
    }
  };

  const updateDonation = () => {
    if (editingId !== null && newDonation.name && newDonation.description && newDonation.quantity && newDonation.location) {
      const updatedDonations = donations.map(donation =>
        donation.id === editingId ? { ...donation, ...newDonation } : donation
      );
      setDonations(updatedDonations);
      setNewDonation({});
      setEditingId(null);
      toast.success('Donation updated successfully!');
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const deleteDonation = (id: number) => {
    const filteredDonations = donations.filter(donation => donation.id !== id);
    setDonations(filteredDonations);
    toast.success('Donation deleted successfully!');
  };

  const claimDonation = (id: number) => {
    const donation = donations.find(donation => donation.id === id);
    if (donation && donation.status === 'available') {
      const updatedDonations = donations.map(donation =>
        donation.id === id ? { ...donation, status: 'claimed' } : donation
      );
      setDonations(updatedDonations);
      setClaimedDonations([...claimedDonations, { ...donation, status: 'claimed' }]);
      toast.success('Donation claimed successfully!');
    } else {
      toast.error('This donation has already been claimed.');
    }
  };

  const updateDonationStatus = (id: number, status: 'available' | 'claimed' | 'picked up') => {
    const updatedDonations = donations.map(donation =>
      donation.id === id ? { ...donation, status } : donation
    );
    setDonations(updatedDonations);
    toast.success(`Donation status updated to ${status}!`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredDonations = donations.filter(donation =>
    donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewHistory = () => {
    setHistory([...donations, ...claimedDonations]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Donations Page</h1>
      <div className="mb-6">
        <p className="text-right text-lg font-semibold">Logged in as: {firstName}</p>
      </div>
      <div className="mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newDonation.name || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newDonation.description || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newDonation.quantity || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newDonation.location || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="flex space-x-4 mt-4">
          {editingId !== null ? (
            <button
              onClick={updateDonation}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Update Donation
            </button>
          ) : (
            <button
              onClick={addDonation}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Donation
            </button>
          )}
          {editingId !== null && (
            <button
              onClick={() => {
                setNewDonation({});
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredDonations.map(donation => (
          <div key={donation.id} className="border rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors min-h-[350px] flex flex-col justify-between max-w-xs mx-auto">
            <div>
              <h2 className="text-xl font-semibold text-center">{donation.name}</h2>
              <p className="text-center">{donation.description}</p>
              <p className="text-center">Quantity: {donation.quantity}</p>
              <p className="text-center">Location: {donation.location}</p>
              <p className="text-center">Status: {donation.status}</p>
            </div>
            <div className="flex flex-wrap justify-center space-x-4 mt-4">
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
              {donation.status === 'available' && (
                <button
                  onClick={() => claimDonation(donation.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Claim
                </button>
              )}
              {donation.status === 'claimed' && (
                <button
                  onClick={() => updateDonationStatus(donation.id, 'picked up')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Mark as Picked Up
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={viewHistory}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          View Donation History
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {history.map(donation => (
            <div key={donation.id} className="border rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors min-h-[350px] flex flex-col justify-between max-w-xs mx-auto">
              <div>
                <h2 className="text-xl font-semibold text-center">{donation.name}</h2>
                <p className="text-center">{donation.description}</p>
                <p className="text-center">Quantity: {donation.quantity}</p>
                <p className="text-center">Location: {donation.location}</p>
                <p className="text-center">Status: {donation.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donations;