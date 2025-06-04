
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

### Backend 
# Flask Backend with MySQL Connector

This is a simple Flask backend that connects to a MySQL database using `mysql-connector-python`, designed to work with a React frontend.

---

## 📦 Requirements

- Python 3.8+
- MySQL Server
- pip (Python package installer)

---

## ⚙️ Environment Setup

1. **Clone the project** (or navigate into `backend/`).

2. **Create a `.env` file** in the `backend/` folder with the following structure: 
```
DB_HOST=ip
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
```

3. **Make/Activate your Venv and Install dependencies**:

cd into your backend!

Make your venv (only do this once, in the future you can skip this step):
```
python -m venv venv 
```

Activate your Venv. On macOS/Linux:
```
source venv/bin/activate
```
On Windows
```
venv\Scripts\activate
```

Then run: 
```
pip install -r requirements.txt
```

4. **Run the backend**:
```
python run.py
```



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
