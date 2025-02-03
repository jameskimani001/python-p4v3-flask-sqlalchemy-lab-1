import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDonationById, updateDonation, deleteDonation } from '../lib/api';
import { Package, MapPin, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditDonation = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    foodType: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const donation = await getDonationById(id!);
        setFormData({
          foodType: donation.food_type,
          description: donation.description,
          location: donation.location,
        });
      } catch (error) {
        toast.error('Error fetching donation');
        navigate('/dashboard');
      }
    };

    fetchDonation();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to update a donation');
      return;
    }

    setLoading(true);
    try {
      await updateDonation(id!, {
        food_type: formData.foodType,
        description: formData.description,
        location: formData.location,
      });

      toast.success('Donation updated successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error updating donation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this donation?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteDonation(id!);
      toast.success('Donation deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error deleting donation');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Donation</h1>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            {deleting ? 'Deleting...' : 'Delete Donation'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="foodType" className="block text-sm font-medium text-gray-700">
                Food Type
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="foodType"
                  id="foodType"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Fresh Vegetables, Canned Goods"
                  value={formData.foodType}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={3}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe the food items, quantity, and any special handling requirements"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Pickup Location
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter pickup address"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
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
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5 mr-2" />
                    Update Donation
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonation;