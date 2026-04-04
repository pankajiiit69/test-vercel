-- Seed data: users table
INSERT INTO users (username, name)
VALUES
  ('jdoe', 'John Doe'),
  ('asmith', 'Alice Smith'),
  ('bwayne', 'Bruce Wayne')
ON CONFLICT (username)
DO UPDATE SET name = EXCLUDED.name;
