# Supabase Database Setup Guide

This guide will help you set up the WTF Token Launcher database schema in Supabase.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **New Project**: Create a new Supabase project
3. **Database Access**: Get your project URL and API keys

## Setup Steps

### 1. Run the Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor** in the left sidebar
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to execute the schema

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## Database Schema Overview

### Tables

#### `users`
- **Purpose**: Store wallet addresses and XP totals
- **Primary Key**: `wallet` (Ethereum address)
- **XP Fields**: `xp_vote`, `xp_presale`, `xp_builder`
- **Computed**: `xp_total` (automatically calculated)

#### `xp_log`
- **Purpose**: Immutable audit log of all XP transactions
- **Features**: Records every XP change with metadata
- **Triggers**: Automatically updates user XP totals

#### `votes`
- **Purpose**: Track voting activity per user per project
- **Constraint**: One vote record per wallet per project
- **XP Integration**: Voting actions create XP log entries

#### `mints`
- **Purpose**: Track NFT minting activity
- **Blockchain**: Links to transaction hashes
- **XP Integration**: Minting during presale earns XP

#### `proposals`
- **Purpose**: Track project proposals and lifecycle
- **Status Flow**: pending → active → approved/rejected → completed
- **XP Integration**: Creating proposals earns builder XP

### Security Features

#### Row Level Security (RLS)
- **Enabled**: All tables have RLS policies
- **User Access**: Users can only modify their own records
- **Public Reading**: Most data is publicly readable for leaderboards

#### Data Integrity
- **Constraints**: Wallet address validation, positive XP checks
- **Triggers**: Automatic timestamp updates, XP recalculation
- **Immutable Logs**: XP log entries cannot be modified

## Helper Functions

### `add_xp(wallet, action, amount, project_id?, tx_hash?, metadata?)`
Safely adds XP to a user account:
```sql
SELECT add_xp(
    '0x742d35Cc641C0532b1d31832c0a34ef05B5e22D0',
    'vote',
    10,
    'project-slug',
    '0x123...',
    '{"votes": 5}'
);
```

### `get_leaderboard(limit?, offset?)`
Returns ranked leaderboard:
```sql
SELECT * FROM get_leaderboard(100, 0);
```

### `get_user_xp_history(wallet, limit?)`
Returns user's XP transaction history:
```sql
SELECT * FROM get_user_xp_history('0x742d35Cc641C0532b1d31832c0a34ef05B5e22D0', 50);
```

## XP System Rules

### XP Categories
- **Vote XP**: Earned by participating in project voting
- **Presale XP**: Earned by participating in token presales
- **Builder XP**: Earned by creating successful proposals

### XP Calculation
- `xp_total` = `xp_vote` + `xp_presale` + `xp_builder`
- Automatically updated via database triggers
- Cannot go below 0 (constraints prevent negative totals)

### Audit Trail
- Every XP change is logged in `xp_log`
- Immutable records with timestamps
- Optional blockchain transaction references

## API Integration

### Next.js API Routes
The schema works with the existing JWT authentication system:
- JWT tokens contain wallet addresses
- RLS policies validate user access
- API routes can safely call Supabase functions

### Example Usage in API Route
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase-types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Add XP for voting
await supabase.rpc('add_xp', {
  user_wallet: wallet,
  xp_action: 'vote',
  xp_amount: 10,
  related_project_id: projectId,
  transaction_hash: txHash
})
```

## Migration from SQLite

If you have existing SQLite data, you can migrate:

1. Export data from current `database.ts`
2. Transform wallet auth data to Supabase auth
3. Import XP and user data using the helper functions
4. Update API routes to use Supabase instead of SQLite

## Monitoring and Maintenance

### Performance
- Indexes are created for common query patterns
- Computed columns reduce query complexity
- RLS policies are optimized for performance

### Backups
- Supabase automatically backs up your database
- Consider additional backups for critical data
- XP log provides complete audit trail for recovery

### Scaling
- Schema supports horizontal scaling
- Partitioning can be added for high-volume logs
- Read replicas available in Supabase Pro

## Testing

Before going live:
1. Test all helper functions
2. Verify RLS policies with different user roles
3. Load test with expected transaction volumes
4. Validate XP calculations and constraints