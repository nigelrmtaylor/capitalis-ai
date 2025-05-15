-- First, make sure the role exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgraphile') THEN
    CREATE ROLE postgraphile WITH LOGIN PASSWORD 'postgraphile';
  END IF;
END
$$;

-- Grant connect to the database
GRANT CONNECT ON DATABASE capitalis TO postgraphile;

-- Grant schema usage
GRANT USAGE ON SCHEMA capitalis TO postgraphile;
GRANT USAGE ON SCHEMA rocher TO postgraphile;

-- Grant table access
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA capitalis TO postgraphile;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA rocher TO postgraphile;

-- Grant sequence access
GRANT USAGE ON ALL SEQUENCES IN SCHEMA capitalis TO postgraphile;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA rocher TO postgraphile;

-- Set up default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA capitalis 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgraphile;

ALTER DEFAULT PRIVILEGES IN SCHEMA rocher 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO postgraphile;

ALTER DEFAULT PRIVILEGES IN SCHEMA capitalis 
GRANT USAGE ON SEQUENCES TO postgraphile;

ALTER DEFAULT PRIVILEGES IN SCHEMA rocher 
GRANT USAGE ON SEQUENCES TO postgraphile;

-- Additional permissions that might be needed
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA capitalis TO postgraphile;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA rocher TO postgraphile;
