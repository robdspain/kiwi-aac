-- Kiwi Voice Database Schema for Neon PostgreSQL
-- Run this in your Neon SQL Editor after creating a database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles (linked to Supabase Auth user ID)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Child profiles (multiple per parent account)
CREATE TABLE IF NOT EXISTS child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '🐥',
  pecs_phase INTEGER DEFAULT 1,
  skin_tone TEXT DEFAULT 'default',
  literacy_enabled BOOLEAN DEFAULT false,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PECS progress tracking
CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  progress_data JSONB NOT NULL DEFAULT '{}',
  auto_advance_flags JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id)
);

-- Symbol board contexts (home, school, etc.)
CREATE TABLE IF NOT EXISTS contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  context_name TEXT NOT NULL,
  symbols JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, context_name)
);

-- Analytics/usage data
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  analytics_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_child_profiles_parent ON child_profiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_progress_child ON progress(child_id);
CREATE INDEX IF NOT EXISTS idx_contexts_child ON contexts(child_id);
CREATE INDEX IF NOT EXISTS idx_analytics_child ON analytics(child_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS child_profiles_updated_at ON child_profiles;
CREATE TRIGGER child_profiles_updated_at BEFORE UPDATE ON child_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS progress_updated_at ON progress;
CREATE TRIGGER progress_updated_at BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS contexts_updated_at ON contexts;
CREATE TRIGGER contexts_updated_at BEFORE UPDATE ON contexts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS analytics_updated_at ON analytics;
CREATE TRIGGER analytics_updated_at BEFORE UPDATE ON analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
