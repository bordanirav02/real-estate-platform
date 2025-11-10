

```markdown
# 🏠 Real Estate Platform

A **full-stack real estate management web application** built by **Nirav Borda**, featuring property listings, user authentication, role-based dashboards (Admin, Agent, Customer), real-time chat, and secure cloud-based image hosting.

---

## 🚀 Overview

This project is a modern **MERN stack** platform where users can browse, list, and manage real estate properties in real time.  
It includes:

- User authentication and role management  
- Property CRUD operations for agents  
- Admin panel for user and listing control  
- Real-time chat system between agents and clients  
- Cloud image uploads with Cloudinary  
- Secure API with JWT authentication  

---

## 🧱 Project Architecture

```bash

real-estate-platform/
│
├── frontend/                          # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/                # Reusable UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ChatBot.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── customer/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── PropertyDetail.jsx
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── agent/
│   │   │   │   ├── AgentDashboard.jsx
│   │   │   │   ├── AddProperty.jsx
│   │   │   │   └── ManageProperties.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       └── ManageUsers.jsx
│   │   │
│   │   ├── services/                  # Axios API calls
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   │
│   │   ├── context/                   # Auth context
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── backend/                           # Node.js + Express API
│   ├── config/db.js                   # MongoDB connection
│   ├── models/                        # Database schemas
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Cart.js
│   │   └── Visit.js
│   │
│   ├── routes/                        # API endpoints
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── cartRoutes.js
│   │   └── visitRoutes.js
│   │
│   ├── controllers/                   # Business logic
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   └── userController.js
│   │
│   ├── middleware/                    # Middleware for auth & roles
│   │   ├── auth.js
│   │   └── roleCheck.js
│   │
│   ├── utils/cloudinary.js            # Cloud image uploads
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md

````

---

## ⚙️ Tech Stack

| Component | Technology Used |
|------------|----------------|
| **Frontend** | React.js (v19), Axios, React Router DOM, Socket.io-client |
| **Backend** | Node.js, Express.js, Socket.io, Multer, Cloudinary, bcryptjs, jsonwebtoken, express-validator, dotenv |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Real-Time Communication** | Socket.io |
| **File Storage** | Cloudinary |
| **Development Tools** | Nodemon, Postman, VS Code |
| **Deployment Options** | Frontend: Vercel / Netlify • Backend: Render / Railway • Database: MongoDB Atlas |

---

## 🧩 Key Features

✅ **User Authentication (JWT)** – Secure login & registration  
✅ **Role-Based Access** – Admin, Agent, and Customer  
✅ **Property Management** – Add, edit, delete, and view listings  
✅ **Real-Time Chat** – Socket.io-based instant messaging  
✅ **Responsive UI** – Built with modern React components  
✅ **Image Hosting** – Cloudinary integration for property photos  
✅ **MongoDB Integration** – Scalable and cloud-based data storage  
✅ **REST APIs** – Clean and modular Express routes  
✅ **Protected Routes** – Middleware validation for secure access  

---

## 📦 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/real-estate-platform.git
cd real-estate-platform
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_min_32_characters_long_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Start backend:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000`
Backend will run on `http://localhost:5000`

---

## 🧪 API Testing (Postman)

| Endpoint              | Method | Description                        |
| --------------------- | ------ | ---------------------------------- |
| `/api/auth/register`  | POST   | Register new user                  |
| `/api/auth/login`     | POST   | Login and get JWT token            |
| `/api/auth/me`        | GET    | Get current logged-in user         |
| `/api/properties`     | GET    | Fetch all properties               |
| `/api/properties/:id` | GET    | Fetch property details             |
| `/api/properties`     | POST   | Create property (agent/admin only) |
| `/api/users`          | GET    | List all users (admin only)        |

---

## 🧑‍💻 Roles & Permissions

| Role         | Permissions                                            |
| ------------ | ------------------------------------------------------ |
| **Admin**    | Full access – manage users, agents, and all properties |
| **Agent**    | Create and manage their own property listings          |
| **Customer** | View, search, chat with agents, and save properties    |

---



## 🚀 Deployment Guide

1. Deploy **backend** on [Render](https://render.com) or [Railway](https://railway.app).
2. Deploy **frontend** on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Use **MongoDB Atlas** for the database.
4. Update the API base URL in `frontend/src/services/api.js` with your deployed backend URL.

---

## 🧭 Project Status

| Feature              | Status     |
| -------------------- | ---------- |
| Backend Setup        | ✅ Complete |
| Database Models      | ✅ Complete |
| Authentication       | ✅ Complete |
| Property APIs        | ✅ Complete |
| Real-Time Chat       | ✅ Complete |
| Frontend Integration | ✅ Complete |
| Deployment Ready     | ✅ Yes      |

---

## 📚 Learning Outcomes

By building this project, you learned how to:

* Structure a full MERN stack project
* Implement authentication using JWT
* Use Socket.io for live chat
* Integrate Cloudinary for media management
* Build reusable and dynamic React components
* Deploy full-stack apps using cloud platforms

---

## 👨‍💻 Author

**Developed by:** [Nirav Borda](https://github.com/bordanirav02)
📧 *Contact:* [niravborda@example.com](mailto:niravborda@example.com)
💼 *LinkedIn:* [linkedin.com/in/niravborda](https://linkedin.com/in/niravborda)

---

## 🏁 Conclusion

This Real Estate Platform demonstrates a professional-grade **MERN application** integrating authentication, data persistence, and real-time features.
It’s scalable, secure, and ready for production deployment — showcasing full-stack capability from backend logic to frontend UI.

---



