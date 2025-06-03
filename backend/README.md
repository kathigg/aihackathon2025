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
