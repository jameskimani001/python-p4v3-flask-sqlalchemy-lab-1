import { supabase } from './supabase';

export interface Donation {
  id: string;
  food_type: string;
  description: string;
  location: string;
  status: 'available' | 'claimed' | 'completed' | 'cancelled';
  created_at: string;
  user_id: string;
}

export interface Claim {
  id: string;
  user_id: string;
  donation_id: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  claimed_at: string;
}

// Donations
export const createDonation = async (donation: Omit<Donation, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('donations')
    .insert([donation])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateDonation = async (id: string, updates: Partial<Donation>) => {
  const { data, error } = await supabase
    .from('donations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteDonation = async (id: string) => {
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getDonations = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      user:users (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getDonationById = async (id: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select(`
      *,
      user:users (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Claims
export const createClaim = async (claim: Omit<Claim, 'id' | 'claimed_at'>) => {
  const { data, error } = await supabase
    .from('claims')
    .insert([claim])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClaimStatus = async (id: string, status: Claim['status']) => {
  const { data, error } = await supabase
    .from('claims')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getClaims = async (userId: string) => {
  const { data, error } = await supabase
    .from('claims')
    .select(`
      *,
      donation:donations (*),
      user:users (*)
    `)
    .eq('user_id', userId)
    .order('claimed_at', { ascending: false });

  if (error) throw error;
  return data;
};