# Attendance Tracking App (Face Recognition)

An attendance tracking system that verifies user attendance using **face recognition**.  
Built with **Spring Boot** (backend), **React** (frontend), and **Python** (face recognition).  

🌐 **Live Deployment**  
- **Frontend (React)** → [https://attendance-tracking-three.vercel.app](https://attendance-tracking-three.vercel.app)  
- **Backend (Spring Boot)** → [https://sb-backend-production-120d.up.railway.app](https://sb-backend-production-120d.up.railway.app)  
- **Face Recognition Service (Python)** → [https://outgg-1089597453640.asia-southeast1.run.app](https://outgg-1089597453640.asia-southeast1.run.app)  

---

## 📌 Features

- User registration & profile management  
- Face recognition for attendance validation  
- Attendance logs & history  
- Admin dashboard for attendance records  
- JWT authentication & secure APIs  
- Cross-platform deployment (Vercel, Railway, GCP)  

---

## 🏗 Architecture

[ Frontend (React) ] ⇆ [ Backend (Spring Boot) ] ⇆ [ Face Recognition (Python) ]
│
[ MySQL Database (Railway) ]


---

## 🔑 API Endpoints

### Auth
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | User login (returns JWT token) |

### Attendance
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/attendance/check` | POST | Submit face image for attendance |
| `/api/attendance/history` | GET | Get user’s attendance history |
| `/api/admin/attendance/all` | GET | Admin view of all attendance logs |

### Users
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/{id}` | GET | Get user profile |
| `/api/users/{id}` | PUT | Update user profile |

> ℹ️ The backend communicates with the **Face Recognition Service** at  
> [https://outgg-1089597453640.asia-southeast1.run.app](https://outgg-1089597453640.asia-southeast1.run.app)

---

## ⚙️ Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React (Vercel deployment) |
| Backend | Spring Boot (Railway deployment) |
| Face Recognition | Python (Google Cloud Run) |
| Database | MySQL (Railway) |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+  
- Node.js 18+  
- Python 3.9+  
- MySQL  

### Local Setup
1. Clone repository:
   ```bash
   git clone https://github.com/zarn-chalamet/attendance-tracking.git
   cd attendance-tracking

2. Backend (Spring Boot)
    ```bash
    cd attendance-tracker-springboot
    mvn clean install
    mvn spring-boot:run


3. Face Recognition (Python)
   ```bash
   cd face-recognition
   python -m venv venv
   source venv/bin/activate   # (Linux/Mac)
   venv\Scripts\activate      # (Windows)
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8000


4. Frontend (React)
   ```bash
    cd attendance-tracker-react
    npm install
    npm start


📂 Directory Structure
  attendance-tracking/
  ├── attendance-tracker-react/       # Frontend (React)
  ├── attendance-tracker-springboot/  # Backend (Spring Boot)
  ├── face-recognition/               # Python service
  └── README.md

## 🔐 Environment Variables

### Backend (Spring Boot)
  DB_HOST=
  DB_PORT=
  DB_NAME=
  DB_USER=
  DB_PASSWORD=
  JWT_SECRET=
  FACE_RECOG_SERVICE_URL=https://outgg-1089597453640.asia-southeast1.run.app
  FRONTEND_URL=https://attendance-tracking-three.vercel.app

### Frontend (React)
  REACT_APP_BACKEND_URL=https://sb-backend-production-120d.up.railway.app

### Face Recognition (Python)
  PORT=8080



📖 Usage

  Register with your details and face image.
  
  Login to receive a JWT token.
  
  Check attendance by submitting a face image → verified by recognition service.
  
  View history or admin dashboard to track attendance records.

🤝 Contributing

  Fork this repo
  
  Create a new branch (feature/your-feature)
  
  Commit changes with clear messages
  
  Open a pull request

📜 License

  This project is licensed under the MIT License.
