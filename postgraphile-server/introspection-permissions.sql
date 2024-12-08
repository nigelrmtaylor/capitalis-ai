-- Grant access to pg_catalog (needed for introspection)
GRANT USAGE ON SCHEMA pg_catalog TO capitalis;
GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO capitalis;

-- Grant access to information_schema (needed for introspection)
GRANT USAGE ON SCHEMA information_schema TO capitalis;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO capitalis;

-- Grant schema usage
GRANT USAGE ON SCHEMA capitalis TO capitalis;
GRANT USAGE ON SCHEMA rocher TO capitalis;

-- Grant table access for introspection
GRANT SELECT ON ALL TABLES IN SCHEMA capitalis TO capitalis;
GRANT SELECT ON ALL TABLES IN SCHEMA rocher TO capitalis;

-- Grant sequence access
GRANT USAGE ON ALL SEQUENCES IN SCHEMA capitalis TO capitalis;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA rocher TO capitalis;

-- Grant execute on functions (needed for introspection of functions/procedures)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA capitalis TO capitalis;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA rocher TO capitalis;

-- If you have any custom types, you'll need this
GRANT USAGE ON TYPE ALL IN SCHEMA capitalis TO capitalis;
GRANT USAGE ON TYPE ALL IN SCHEMA rocher TO capitalis;
