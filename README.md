# Mini Blog Application (MERN Stack)

A production-ready, full-stack Mini Blog web application engineered with the MERN stack (MongoDB, Express.js, React.js, Node.js). The application features JWT-based authentication, protected client-side routing, dynamic query filtering, custom component-level navigation, and graceful 404 error handling.

---

# Overview

The Mini Blog app allows authenticated users to create, read, and search blog posts through a clean, responsive UI. It employs a decoupled architecture where the React frontend (`miniblogapp`) communicates with an Express/Node backend (`mini-blog-server`) via RESTful API endpoints.

---

# Directory Architecture

mini-blog/
├── mini-blog-server/          # Express & Node.js Backend Engine
│   ├── config/                # Database connection & server configuration
│   ├── controllers/           # Route logic & request handlers
│   ├── middleware/            # JWT verification & auth middleware
│   ├── models/                # Mongoose schemas (User, Post)
│   ├── routes/                # Express API endpoint routes
│   ├── index.js               # Express application entry point
│   └── package.json
│
└── miniblogapp/               # React Frontend Client
    ├── public/                # Static assets & index.html
    └── src/
        ├── components/
        │   ├── Home/          # Post feed & filtering view
        │   ├── Login/         # Authentication entry form
        │   ├── Navbar/        # Navigation header with search bar
        │   ├── NewPost/       # Post composition & publishing form
        │   ├── NotFound/      # Standalone fallback 404 error view
        │   └── ProtectedRoute/# High-Order wrapper for auth-guarded paths
        ├── App.css            # Global styling setup
        ├── App.js             # React Router v5 routing engine
        ├── index.js           # React DOM root render
        └── package.json



# Features & Engineering Highlights
1.JWT Authentication: Secure user login using JSON Web Tokens stored in browser cookies via js-cookie.

2.Guarded Client Routing: Custom ProtectedRoute component that intercepts unauthenticated requests and redirects users to /login.

3.Universal Catch-All 404: React Router v5 <Switch> setup capturing unmapped routes and displaying a dedicated NotFound view without disrupting browser location history.

4.Smart Back Navigation: Built-in history.goBack() mechanics allowing seamless fallback to previous browser history entries.

5.Component-Level Navigation: Higher-Order Component (withRouter) integration on non-route elements (like Navbar) for programmatically navigating via history.replace().

6.Real-time Query Filtering: Search input passing real-time state down to parent post feeds.

# 🚀 Getting Started & Local Setup
Prerequisites
Node.js (v14+ installed)

MongoDB (Local instance or MongoDB Atlas account)

# 1. Backend Setup (mini-blog-server)
Open terminal and navigate to the backend directory:

Bash
cd mini-blog-server

Install dependencies:

Bash
npm install
Create a .env file in the mini-blog-server directory with the following variables:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the server:

Bash
node server.js
The backend will run on http://localhost:5000

# 2. Frontend Setup (miniblogapp)
Open a new terminal window and navigate to the frontend directory:

Bash
cd miniblogapp
Install dependencies:

Bash
npm install
Start the React development server:

Bash
npm start
The frontend will run on http://localhost:3000

# 3. Account Access
No default credentials are provided. Simply navigate to http://localhost:3000 in your browser and register a new account to test authentication and features locally.

## 🛠️ Tech Stack & Dependencies
# Frontend (miniblogapp):
Library: React.js (Class & Functional Components)

Routing: react-router-dom (v5)

Icons: react-icons (FontAwesome integration)

Cookie Management: js-cookie

Styling: CSS3

# Backend (mini-blog-server):
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

Security & Auth: jsonwebtoken, bcryptjs, cors