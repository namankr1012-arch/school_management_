-- ============================================================
-- School Management API — Database Schema
-- Run this script once to set up your MySQL database.
-- ============================================================

-- 1. Create (or switch to) the database
CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school_management;

-- 2. Create the schools table
CREATE TABLE IF NOT EXISTS schools (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  address    VARCHAR(500) NOT NULL,
  latitude   FLOAT        NOT NULL,
  longitude  FLOAT        NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_schools_name ON schools(name);
CREATE INDEX IF NOT EXISTS idx_schools_coords ON schools(latitude, longitude);

-- 4. (Optional) Seed data for testing
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Greenwood High School',    '123 Oak Avenue, New York, NY 10001',           40.7128,  -74.0060),
  ('Sunrise Academy',          '456 Maple Street, Los Angeles, CA 90001',      34.0522, -118.2437),
  ('Lakeside Elementary',      '789 Pine Road, Chicago, IL 60601',             41.8781,  -87.6298),
  ('Valley View Middle School','321 Elm Boulevard, Houston, TX 77001',         29.7604,  -95.3698),
  ('Blue Ridge Prep',          '654 Cedar Lane, Phoenix, AZ 85001',            33.4484, -112.0740);
