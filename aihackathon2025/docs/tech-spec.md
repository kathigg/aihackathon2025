
# DroneWERX White List Platform - Technical Specification

## Architecture Overview

### System Components
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase PostgreSQL with Row-Level Security
- **Authentication**: Supabase Auth + DoD SSO integration hooks
- **Real-time**: Supabase Realtime channels
- **Search**: PostgreSQL full-text + pgvector similarity search
- **File Storage**: Supabase Storage for videos/attachments

### Security Architecture
```
┌─────────────────────────────────────────────────────────┐
│                 Classification Layer                    │
├─────────────────────────────────────────────────────────┤
│  🔴 RED: Classified    │ 🟡 YELLOW: Sensitive         │
│  🟢 GREEN: Unclassified │                              │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                     │
├─────────────────────────────────────────────────────────┤
│  React Frontend │ Supabase Auth │ Real-time Updates     │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                          │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL + RLS │ Encrypted PII │ Audit Logs          │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables
```sql
-- Users with encrypted PII
users (
  id uuid PRIMARY KEY,
  username text UNIQUE,
  email text,
  role user_role,
  verified_dod boolean,
  encrypted_pii jsonb, -- Separate encrypted table
  karma_points integer DEFAULT 0,
  created_at timestamptz,
  last_active timestamptz
)

-- Challenges (problems from warfighters)
challenges (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid REFERENCES users(id),
  classification classification_level,
  urgency urgency_level,
  domain text,
  tags text[],
  anonymous boolean DEFAULT false,
  moderation_status moderation_status DEFAULT 'pending',
  upvotes integer DEFAULT 0,
  solution_count integer DEFAULT 0,
  video_url text,
  embedding vector(1536), -- For smart matching
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Solutions (responses from providers)
solutions (
  id uuid PRIMARY KEY,
  challenge_id uuid REFERENCES challenges(id),
  title text NOT NULL,
  description text NOT NULL,
  author_id uuid REFERENCES users(id),
  trl_level integer CHECK (trl_level BETWEEN 1 AND 9),
  upvotes integer DEFAULT 0,
  moderation_status moderation_status DEFAULT 'pending',
  video_url text,
  attachments text[],
  embedding vector(1536),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Comments for discussions
comments (
  id uuid PRIMARY KEY,
  content text NOT NULL,
  author_id uuid REFERENCES users(id),
  challenge_id uuid REFERENCES challenges(id),
  solution_id uuid REFERENCES solutions(id),
  parent_id uuid REFERENCES comments(id),
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
)

-- Voting system
votes (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  content_type vote_content_type,
  content_id uuid,
  vote_type vote_type,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
)

-- Moderation audit trail
moderation_log (
  id uuid PRIMARY KEY,
  moderator_id uuid REFERENCES users(id),
  content_type text,
  content_id uuid,
  action moderation_action,
  reason text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
)
```

### Custom Types
```sql
CREATE TYPE user_role AS ENUM ('warfighter', 'solution_provider', 'moderator', 'admin');
CREATE TYPE classification_level AS ENUM ('green', 'yellow', 'red');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'redacted');
CREATE TYPE vote_type AS ENUM ('up', 'down');
CREATE TYPE vote_content_type AS ENUM ('challenge', 'solution', 'comment');
CREATE TYPE moderation_action AS ENUM ('approve', 'reject', 'redact');
```

## Row-Level Security Policies

### Challenge Access Control
```sql
-- Users can read approved challenges or their own pending ones
CREATE POLICY "challenges_read" ON challenges FOR SELECT
USING (
  moderation_status = 'approved' 
  OR auth.uid() = author_id 
  OR EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('moderator', 'admin')
  )
);

-- Classification-based access
CREATE POLICY "challenges_classification" ON challenges FOR SELECT
USING (
  CASE 
    WHEN classification = 'red' THEN 
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND verified_dod = true
      )
    WHEN classification = 'yellow' THEN 
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('warfighter', 'moderator', 'admin')
      )
    ELSE true -- Green is public
  END
);
```

## Smart Matching Algorithm

### Vector Similarity Search
```sql
-- Find similar challenges using pgvector
CREATE OR REPLACE FUNCTION find_similar_challenges(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.8,
  max_results int DEFAULT 10
)
RETURNS TABLE (
  challenge_id uuid,
  title text,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    1 - (c.embedding <=> query_embedding) as similarity
  FROM challenges c
  WHERE 
    c.moderation_status = 'approved'
    AND (1 - (c.embedding <=> query_embedding)) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
```

## API Endpoints

### Challenge Management
```typescript
// Create challenge
POST /api/challenges
{
  title: string;
  description: string;
  domain: string;
  classification: 'green' | 'yellow' | 'red';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  anonymous: boolean;
  video_url?: string;
}

// Get challenges with filters
GET /api/challenges?domain=air&urgency=high&classification=green

// Upvote challenge
POST /api/challenges/:id/vote
{
  vote_type: 'up' | 'down';
}
```

### Moderation Workflow
```typescript
// Get moderation queue
GET /api/moderation/queue?content_type=challenge&status=pending

// Moderate content
POST /api/moderation/:content_id
{
  action: 'approve' | 'reject' | 'redact';
  reason?: string;
}
```

## Security Features

### 1. PII Encryption
```typescript
// Encrypted user data stored separately
interface EncryptedUserData {
  real_name?: string;
  dod_id?: string;
  unit?: string;
  clearance_level?: string;
  phone?: string;
}
```

### 2. Audit Logging
```sql
-- All moderation actions logged
INSERT INTO moderation_log (
  moderator_id,
  content_type,
  content_id,
  action,
  reason,
  metadata
) VALUES (
  auth.uid(),
  'challenge',
  $1,
  $2,
  $3,
  jsonb_build_object(
    'original_content', content_before_action,
    'user_agent', request_headers,
    'ip_address', request_ip
  )
);
```

### 3. Classification Enforcement
```typescript
// Classification banner component
const ClassificationBanner = ({ level }: { level: ClassificationLevel }) => {
  const config = {
    red: { color: 'bg-red-600', label: 'CLASSIFIED' },
    yellow: { color: 'bg-yellow-500', label: 'SENSITIVE' },
    green: { color: 'bg-green-600', label: 'UNCLASSIFIED' }
  };
  
  return (
    <div className={`${config[level].color} text-white text-center py-2`}>
      {config[level].label} - {level === 'red' ? 'DoD Only' : level === 'yellow' ? 'Controlled' : 'Public'}
    </div>
  );
};
```

## Real-time Features

### Supabase Realtime Channels
```typescript
// Subscribe to challenge updates
const channel = supabase
  .channel('challenge-updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'challenges',
    filter: 'moderation_status=eq.approved'
  }, (payload) => {
    // Update UI with new challenge
  })
  .subscribe();

// Subscribe to moderation queue
const moderationChannel = supabase
  .channel('moderation-queue')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'challenges',
    filter: 'moderation_status=eq.pending'
  }, handleModerationUpdate)
  .subscribe();
```

## Performance Optimizations

### 1. Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_challenges_domain ON challenges(domain);
CREATE INDEX idx_challenges_urgency ON challenges(urgency);
CREATE INDEX idx_challenges_classification ON challenges(classification);
CREATE INDEX idx_challenges_moderation ON challenges(moderation_status);
CREATE INDEX idx_challenges_created_at ON challenges(created_at DESC);

-- Vector similarity index
CREATE INDEX idx_challenges_embedding ON challenges 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Full-text search
CREATE INDEX idx_challenges_search ON challenges 
USING gin(to_tsvector('english', title || ' ' || description));
```

### 2. Caching Strategy
```typescript
// React Query for client-side caching
const useChallenges = (filters: ChallengeFilters) => {
  return useQuery({
    queryKey: ['challenges', filters],
    queryFn: () => fetchChallenges(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

## Deployment Architecture

### Local Development
```bash
# Docker Compose setup
docker-compose up -d  # Supabase stack
npm run dev          # React development server
```

### Production Environment
```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dronewerx-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dronewerx-platform
  template:
    spec:
      containers:
      - name: frontend
        image: dronewerx-platform:latest
        env:
        - name: SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: supabase-secrets
              key: url
        - name: SUPABASE_ANON_KEY
          valueFrom:
            secretKeyRef:
              name: supabase-secrets
              key: anon-key
```

## Future Enhancements

### Phase 2: Vector Embeddings
- OpenAI embeddings for challenge/solution matching
- Semantic search capabilities
- Automated suggestion engine

### Phase 3: Advanced Features
- PDF export for mission briefs
- Karma and badge system
- Advanced analytics dashboard
- ML-powered content classification

### Phase 4: Integration
- CAC/PIV card authentication
- Military networks compatibility
- SIPR/NIPR deployment options
