-- WTF Token Launcher - Supabase Database Schema
-- This file contains the complete database schema for the WTF application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
-- Primary table storing wallet addresses and XP totals

CREATE TABLE users (
    wallet TEXT PRIMARY KEY CHECK (wallet ~ '^0x[a-fA-F0-9]{40}$'), -- Ethereum address validation
    xp_vote INTEGER NOT NULL DEFAULT 0 CHECK (xp_vote >= 0),
    xp_presale INTEGER NOT NULL DEFAULT 0 CHECK (xp_presale >= 0),
    xp_builder INTEGER NOT NULL DEFAULT 0 CHECK (xp_builder >= 0),
    xp_total INTEGER GENERATED ALWAYS AS (xp_vote + xp_presale + xp_builder) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- XP_LOG TABLE
-- =====================================================
-- Immutable audit log of every XP action

CREATE TABLE xp_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('vote', 'presale', 'builder', 'bonus', 'penalty')),
    amount INTEGER NOT NULL, -- Can be negative for penalties
    project_id TEXT, -- Optional reference to project/proposal
    tx_hash TEXT, -- Optional blockchain transaction hash
    metadata JSONB, -- Additional flexible data
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- VOTES TABLE
-- =====================================================
-- Track voting activity per user per project

CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    votes_cast INTEGER NOT NULL CHECK (votes_cast > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure one vote record per wallet per project
    UNIQUE(wallet, project_id)
);

-- =====================================================
-- MINTS TABLE
-- =====================================================
-- Track NFT minting activity

CREATE TABLE mints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    nfts INTEGER NOT NULL CHECK (nfts > 0), -- Number of NFTs minted
    tx_hash TEXT NOT NULL, -- Blockchain transaction hash
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- PROPOSALS TABLE
-- =====================================================
-- Track project proposals and their status

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT NOT NULL REFERENCES users(wallet) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE, -- URL-friendly identifier
    logo_url TEXT,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'approved', 'rejected', 'completed')),
    metadata JSONB, -- Additional flexible project data
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users table indexes
CREATE INDEX idx_users_xp_total ON users(xp_total DESC);
CREATE INDEX idx_users_created_at ON users(created_at);

-- XP Log indexes
CREATE INDEX idx_xp_log_wallet ON xp_log(wallet);
CREATE INDEX idx_xp_log_action ON xp_log(action);
CREATE INDEX idx_xp_log_created_at ON xp_log(created_at DESC);
CREATE INDEX idx_xp_log_project_id ON xp_log(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_xp_log_tx_hash ON xp_log(tx_hash) WHERE tx_hash IS NOT NULL;

-- Votes table indexes
CREATE INDEX idx_votes_wallet ON votes(wallet);
CREATE INDEX idx_votes_project_id ON votes(project_id);
CREATE INDEX idx_votes_created_at ON votes(created_at DESC);

-- Mints table indexes
CREATE INDEX idx_mints_wallet ON mints(wallet);
CREATE INDEX idx_mints_project_id ON mints(project_id);
CREATE INDEX idx_mints_tx_hash ON mints(tx_hash);
CREATE INDEX idx_mints_created_at ON mints(created_at DESC);

-- Proposals table indexes
CREATE INDEX idx_proposals_wallet ON proposals(wallet);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_slug ON proposals(slug);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update user XP when xp_log entries are added
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the appropriate XP field based on action
    CASE NEW.action
        WHEN 'vote' THEN
            UPDATE users
            SET xp_vote = xp_vote + NEW.amount,
                updated_at = NOW()
            WHERE wallet = NEW.wallet;
        WHEN 'presale' THEN
            UPDATE users
            SET xp_presale = xp_presale + NEW.amount,
                updated_at = NOW()
            WHERE wallet = NEW.wallet;
        WHEN 'builder' THEN
            UPDATE users
            SET xp_builder = xp_builder + NEW.amount,
                updated_at = NOW()
            WHERE wallet = NEW.wallet;
        WHEN 'bonus' THEN
            -- Bonus can go to any category, default to builder
            UPDATE users
            SET xp_builder = xp_builder + NEW.amount,
                updated_at = NOW()
            WHERE wallet = NEW.wallet;
        WHEN 'penalty' THEN
            -- Penalties reduce from total proportionally
            UPDATE users
            SET xp_vote = GREATEST(0, xp_vote + (NEW.amount * xp_vote / GREATEST(1, xp_vote + xp_presale + xp_builder))),
                xp_presale = GREATEST(0, xp_presale + (NEW.amount * xp_presale / GREATEST(1, xp_vote + xp_presale + xp_builder))),
                xp_builder = GREATEST(0, xp_builder + (NEW.amount * xp_builder / GREATEST(1, xp_vote + xp_presale + xp_builder))),
                updated_at = NOW()
            WHERE wallet = NEW.wallet;
    END CASE;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update XP when log entries are added
CREATE TRIGGER trigger_update_user_xp
    AFTER INSERT ON xp_log
    FOR EACH ROW
    EXECUTE FUNCTION update_user_xp();

-- Function to update proposal updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for proposals updated_at
CREATE TRIGGER trigger_proposals_updated_at
    BEFORE UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mints ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet' = wallet);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.jwt() ->> 'wallet' = wallet);

-- XP Log policies (read-only for users, insert via authenticated functions)
CREATE POLICY "Users can view all XP logs" ON xp_log
    FOR SELECT USING (true);

CREATE POLICY "System can insert XP logs" ON xp_log
    FOR INSERT WITH CHECK (true); -- Controlled via application logic

-- Votes table policies
CREATE POLICY "Users can view all votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own votes" ON votes
    FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet' = wallet);

CREATE POLICY "Users can update their own votes" ON votes
    FOR UPDATE USING (auth.jwt() ->> 'wallet' = wallet);

-- Mints table policies
CREATE POLICY "Users can view all mints" ON mints
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own mints" ON mints
    FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet' = wallet);

-- Proposals table policies
CREATE POLICY "Users can view all proposals" ON proposals
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own proposals" ON proposals
    FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet' = wallet);

CREATE POLICY "Users can update their own proposals" ON proposals
    FOR UPDATE USING (auth.jwt() ->> 'wallet' = wallet);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to safely add XP (prevents negative totals)
CREATE OR REPLACE FUNCTION add_xp(
    user_wallet TEXT,
    xp_action TEXT,
    xp_amount INTEGER,
    related_project_id TEXT DEFAULT NULL,
    transaction_hash TEXT DEFAULT NULL,
    extra_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Ensure user exists
    SELECT EXISTS(SELECT 1 FROM users WHERE wallet = user_wallet) INTO user_exists;

    IF NOT user_exists THEN
        INSERT INTO users (wallet) VALUES (user_wallet);
    END IF;

    -- Add XP log entry (trigger will update user totals)
    INSERT INTO xp_log (wallet, action, amount, project_id, tx_hash, metadata)
    VALUES (user_wallet, xp_action, xp_amount, related_project_id, transaction_hash, extra_metadata);

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(
    limit_count INTEGER DEFAULT 100,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    rank BIGINT,
    wallet TEXT,
    xp_total INTEGER,
    xp_vote INTEGER,
    xp_presale INTEGER,
    xp_builder INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROW_NUMBER() OVER (ORDER BY u.xp_total DESC, u.created_at ASC) as rank,
        u.wallet,
        u.xp_total,
        u.xp_vote,
        u.xp_presale,
        u.xp_builder
    FROM users u
    WHERE u.xp_total > 0
    ORDER BY u.xp_total DESC, u.created_at ASC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's XP history
CREATE OR REPLACE FUNCTION get_user_xp_history(
    user_wallet TEXT,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE(
    action TEXT,
    amount INTEGER,
    project_id TEXT,
    tx_hash TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        xl.action,
        xl.amount,
        xl.project_id,
        xl.tx_hash,
        xl.created_at
    FROM xp_log xl
    WHERE xl.wallet = user_wallet
    ORDER BY xl.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA / SEED
-- =====================================================

-- Insert any initial data here if needed
-- Example: Admin users, default proposals, etc.

COMMENT ON TABLE users IS 'Main user table storing wallet addresses and XP totals';
COMMENT ON TABLE xp_log IS 'Immutable audit log of all XP transactions';
COMMENT ON TABLE votes IS 'Voting activity tracking per user per project';
COMMENT ON TABLE mints IS 'NFT minting activity tracking';
COMMENT ON TABLE proposals IS 'Project proposals and their lifecycle status';

COMMENT ON COLUMN users.xp_total IS 'Computed column: sum of all XP categories';
COMMENT ON COLUMN xp_log.amount IS 'XP amount (can be negative for penalties)';
COMMENT ON COLUMN votes.votes_cast IS 'Number of votes cast by user for this project';
COMMENT ON COLUMN mints.nfts IS 'Number of NFTs minted in this transaction';
COMMENT ON COLUMN proposals.slug IS 'URL-friendly unique identifier for the project';