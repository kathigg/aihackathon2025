
# StrikeStack
## The Warfighter's Reddit, Reinvented 

A secure collaboration platform where warfighters post tactical problems and solution-providers answer them.

## 🎯 Mission Critical Features

### Platform Capabilities ✅
- ✅ Secure or anonymous challenge submission from verified DoD users
- ✅ Concept posts and responses from solution providers (academia, startups, industry)
- ✅ Community features: upvoting, tags, video submission overviews, TRL levels, urgency labels, domains
- ✅ Moderation workflows for OPSEC compliance
- ✅ Smart matching between past solutions and new challenges (scaffolded)
- ✅ Searchable archive of historical threads

### Security & Compliance ✅
- ✅ Role-based authentication and access
- ✅ Verification of .mil addresses (DoD Access)
- ✅ OPSEC moderation queue with approve/redact/reject actions
- ✅ Classification banners by security (Red/Yellow/Green)

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Node.js
- **Backend:** MySQL + Flask + AWS + EC2 Instance 
- **Search:** OpenAI + MySQL + Flask

### Project Structure
```
/
├── src/
│   ├── components/          # UI components
│   ├── pages/              # Main pages
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript definitions
│   └── lib/                # Utilities
├── docs/                   # Documentation
└── public/                 # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Axios
- Git

### Local Development
```bash
# Clone and install
git clone https://github.com/kathigg/aihackathon2025.git
npm install
```

### Backend 
# Flask Backend with MySQL Connector

This is a simple Flask backend that connects to a MySQL database using `mysql-connector-python`, designed to work with a React frontend.

More information about the backend, and how to run it, can be found under the backend folder on the Readme. 


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
3. Auto-queued for OPSEC review
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

### Example Functionality:

## Marketplace Page: 
<img width="1710" alt="Screenshot 2025-06-04 at 1 48 57 PM" src="https://github.com/user-attachments/assets/64c4ed94-8fe2-4ae0-adfe-957c2104086f" />

## Solutions Archive: 
<img width="1710" alt="Screenshot 2025-06-04 at 1 48 52 PM" src="https://github.com/user-attachments/assets/7232bc2b-e879-43c0-92b1-ff4519ec1a03" />

## Account Creation and Role-Based Authentication: 
<img width="674" alt="Screenshot 2025-06-04 at 9 14 17 AM" src="https://github.com/user-attachments/assets/8dacb4dd-4a23-4c65-834b-d41bb95b6b63" />

## Demo Video: 

https://github.com/user-attachments/assets/b289be40-a786-42c9-91da-61fd421313bd


## 📊 Future Enhancements
- Vector-embedding suggestion engine
- PDF mission brief export
- Karma and badge system
- Advanced analytics dashboard
