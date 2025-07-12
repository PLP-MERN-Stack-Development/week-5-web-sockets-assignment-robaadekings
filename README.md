Real-Time Chat Application

A full-stack, real-time chat application built with **Node.js**, **Express**, **Socket.io**, **React**, **MongoDB**, and **JWT authentication**. This app supports **global and private messaging**, **user registration/login**, **live online status**, **typing indicators**, and **room-based communication**.

---

## 📦 Project Structure

socketio-chat/
├── client/ # React front-end
│ ├── public/
│ ├── src/
│ │ ├── api/ # Axios instance
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # React context providers
│ │ ├── pages/ # Page-level components
│ │ ├── socket/ # Socket.io client setup
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── vite.config.js
│
├── server/ # Node.js back-end
│ ├── config/ # MongoDB & .env setup
│ ├── controllers/ # Auth and socket handlers
│ ├── middleware/ # JWT auth middleware
│ ├── models/ # Mongoose models: User, Message, Room
│ ├── routes/ # Express API routes
│ ├── socket/ # Socket.io server logic
│ ├── server.js # Main entry point
│ └── .env
│
└── README.md # You're here

markdown
Copy
Edit

---

## 🚀 Features

### ✅ Core Features
- ✅ JWT-based **authentication** (login/register)
- ✅ **Public chatroom** support (default: `general`)
- ✅ **Private messaging**
- ✅ **Typing indicators**
- ✅ **Online user list**
- ✅ **Join/leave notifications**
- ✅ Message **timestamps**

### ✨ Advanced Features
- ✅ **Socket.io authentication** via JWT
- ✅ Room-based chat structure
- ✅ Messages stored in **MongoDB**
- ✅ Dynamic user list updates
- ✅ Auto-reconnect with session persistence

---

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Node.js + Express
- **Realtime:** Socket.io
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Proxying:** Vite Dev Server proxy to Express API

---

## 📁 Setup Instructions

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally or via Atlas

---

### 🔧 Environment Configuration

#### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socketchat
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
🖥 Backend Setup
bash
Copy
Edit
cd server
npm install
npm run dev
💻 Frontend Setup
bash
Copy
Edit
cd client
npm install
npm run dev
🔐 Authentication
Register: /auth/register

Login: /auth/login

JWT is stored in localStorage and sent on every request via Axios interceptors.

Socket.io handshakes include the JWT token in socket.auth.

📡 Socket.io Events
From Client → Server
user_join

send_message_to_room

private_message

typing

join_room

From Server → Client
receive_message

private_message

user_joined, user_left

typing_users

user_list

🧪 Example API Endpoints
Method	Endpoint	Description
GET	/api/users	List online users
GET	/api/messages/:room	Fetch chat history
POST	/api/auth/register	Register new user
POST	/api/auth/login	Authenticate and get token

📸 Screenshots
(Add your own screenshots here if available)

📱 Mobile Responsive?
Yes. The frontend is responsive and tested across mobile and desktop layouts using Tailwind CSS.

🔐 Security Notes
JWT-based secure auth with expiry

Protected routes using middleware

Authenticated WebSocket connections

