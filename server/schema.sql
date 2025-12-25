-- products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

--users table
CREATE TABLE   IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

-- inventory_batches: each purchase is a batch
CREATE TABLE IF NOT EXISTS inventory_batches (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  remaining_quantity INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- sales table
CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  total_cost NUMERIC(14,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- sale_allocations: which batch contributed to which sale
CREATE TABLE IF NOT EXISTS sale_allocations (
  id BIGSERIAL PRIMARY KEY,
  sale_id BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  batch_id BIGINT NOT NULL REFERENCES inventory_batches(id),
  allocated_quantity INT NOT NULL,
  allocated_unit_cost NUMERIC(12,2) NOT NULL
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_inventory_batches_product_created_at ON inventory_batches(product_id, created_at);
