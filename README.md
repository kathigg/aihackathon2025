
# DroneWERX White List Platform
## The Warfighter's Reddit

A secure collaboration platform where warfighters post tactical problems and solution-providers answer them.

## 🎯 Mission Critical Features

### Mandatory Capabilities ✅
- ✅ Secure or anonymous challenge submission from verified DoD users
- ✅ Concept posts and responses from solution providers (academia, startups, industry)
- ✅ Community features: upvoting, tags, video submission overviews, TRL levels, urgency labels, domains
- ✅ Moderation workflows for OPSEC compliance
- ✅ Smart matching between past solutions and new challenges (scaffolded)
- ✅ Searchable archive of historical threads

### Security & Compliance ✅
- ✅ PII isolation with encrypted storage
- ✅ OPSEC moderation queue with approve/redact/reject actions
- ✅ Tamper-evident audit log
- ✅ Classification banners (Red/Yellow/Green)

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + RLS)
- **Auth:** Supabase Auth + DoD SSO placeholder
- **Realtime:** Supabase Realtime
- **Search:** PostgreSQL full-text + pgvector similarity
- **Security:** Row-Level Security, encrypted PII storage

### Project Structure
```
/
├── src/
│   ├── components/          # UI components
│   ├── pages/              # Main pages
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript definitions
│   └── lib/                # Utilities
├── supabase/               # Database schema & policies
├── docs/                   # Documentation
└── public/                 # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase CLI
- Git

### Local Development
```bash
# Clone and install
git clone <repo-url>
cd dronewerx-platform
npm install

# Start Supabase (requires Docker)
npx supabase start

# Run development server
npm run dev
```

## 📋 Deliverables Mapping

### Code ↔ Deliverables
- **DroneWERX White List Platform** → `/src` (Full implementation)
- **Tech Spec Documentation** → `/docs/tech-spec.md`
- **All Platform Features** → Components in `/src/components`
- **Simulator Prototype** → `/docs/simulator-spec.md` (Part 2 placeholder)
- **Mockups/Wireframes** → Responsive UI implementation
- **Use Case Brief** → `/docs/use-case-brief.md`
- **Future Roadmap** → `/docs/roadmap.md`

## 🛡️ Security Features

### Classification System
- **🔴 RED:** Classified information (restricted access)
- **🟡 YELLOW:** Sensitive but unclassified (moderated)
- **🟢 GREEN:** Public information (open access)

### User Types
- **Warfighters:** Problem submitters (verified DoD)
- **Solution Providers:** Academia, startups, industry
- **Moderators:** OPSEC compliance officers
- **Admins:** Platform administrators

## 🎮 User Workflows

### Challenge Submission
1. Warfighter creates challenge post
2. Selects classification level
3. Auto-queued for OPSEC revi<img width="1710" alt="Screenshot 2025-06-04 at 1 48 57 PM" src="https://github.com/user-attachments/assets/64c4ed94-8fe2-4ae0-adfe-957c2104086f" />
ew
4. Published after approval

### Solution Development
1. Provider discovers relevant challenges
2. Submits solution with TRL rating
3. Community votes and discusses
4. Smart matching suggests related content

### Moderation Process
1. All posts enter moderation queue
2. OPSEC review (approve/redact/reject)
3. Audit trail maintained
4. Classification banners applied

## 📊 Future Enhancements
- Vector-embedding suggestion engine
- PDF mission brief export
- Karma and badge system
- Advanced analytics dashboard
