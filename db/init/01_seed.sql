-- This file runs once on first container startup
-- EntGo will manage the actual schema migrations
-- This just seeds initial lookup data

USE workforce_hub;

-- Roles seed data (these are referenced by users)
INSERT IGNORE INTO roles (name, description) VALUES 
  ('admin', 'Full system access'),
  ('manager', 'Can manage projects and teams'),
  ('employee', 'Standard access');