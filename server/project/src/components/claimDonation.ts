import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const claimDonation = async (userId: string, donationId: string) => {
  const { error } = await supabase
    .from('claims')
    .insert([{ user_id: userId, donation_id: donationId, status: 'pending' }]);

  if (error) {
    toast.error('Error claiming donation');
    return false;
  } else {
    toast.success('Donation claimed successfully!');
    return true;
  }
};