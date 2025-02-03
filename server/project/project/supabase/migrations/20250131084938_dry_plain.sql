/*
  # Initial Schema Setup for Food Waste Management Platform

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `food_type` (text)
      - `description` (text)
      - `location` (text)
      - `status` (text)
      - `created_at` (timestamp)
    - `claims`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `donation_id` (uuid, foreign key to donations)
      - `status` (text)
      - `claimed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create donations table if it doesn't exist
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  food_type text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies for donations
DO $$ BEGIN
  CREATE POLICY "Anyone can read donations"
    ON donations
    FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create own donations"
    ON donations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own donations"
    ON donations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own donations"
    ON donations
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create claims table if it doesn't exist
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  donation_id uuid REFERENCES donations NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  claimed_at timestamptz DEFAULT now(),
  UNIQUE(donation_id, user_id)
);

-- Enable RLS on claims
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Create policies for claims
DO $$ BEGIN
  CREATE POLICY "Users can read own claims"
    ON claims
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create claims"
    ON claims
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own claims"
    ON claims
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for better query performance
DO $$ BEGIN
  CREATE INDEX idx_donations_user_id ON donations(user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX idx_donations_status ON donations(status);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX idx_claims_user_id ON claims(user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE INDEX idx_claims_donation_id ON claims(donation_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;