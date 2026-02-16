-- Create stores table to save store information
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) NOT NULL UNIQUE,
  site_title VARCHAR(255) NOT NULL,
  allow_indexing BOOLEAN DEFAULT true,
  template VARCHAR(50) NOT NULL,
  admin_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active'
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_stores_email ON stores(email);
CREATE INDEX IF NOT EXISTS idx_stores_subdomain ON stores(subdomain);
CREATE INDEX IF NOT EXISTS idx_stores_username ON stores(username);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert from anyone (for store creation)
CREATE POLICY "Allow public insert" ON stores
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow select only own stores by email
CREATE POLICY "Allow select own stores" ON stores
  FOR SELECT
  USING (true);
