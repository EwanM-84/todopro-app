/*
  # Add default admin user

  1. Changes
    - Add unique constraint on auth.users email column
    - Create default admin user with email and password
  
  2. Security
    - User will have authenticated role
    - Password is securely hashed
*/

-- First ensure email is unique
ALTER TABLE auth.users 
  ADD CONSTRAINT users_email_key UNIQUE (email);

-- Create default admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_current,
  email_change_token_new,
  recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@todopro.com',
  crypt('todopro2024', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@todopro.com'
);