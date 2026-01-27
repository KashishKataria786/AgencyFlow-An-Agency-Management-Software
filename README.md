# Agency Management Software

A robust, full-stack **MERN (MongoDB, Express, React, Node.js)** application designed to streamline agency operations. This platform enables efficient management of projects, tasks, clients, and teams with role-based access control and real-time features.

## 🚀 Features

-   **Role-Based Access Control (RBAC)**: Distinct interfaces and permissions for **Owners**, **Team Members**, and **Clients**.
-   **Project Management**: Create, track, and manage projects with status updates and deadlines.
-   **Task Management**:
    -   Kanban-style task board.
    -   Task assignment and priority levels.
    -   **Cascade Deletion**: Automatically cleans up tasks when a project is deleted.
    -   **Orphan Cleanup**: logical handling to prevent ghost tasks.
-   **Real-Time Collaboration**:
    -   Instant notifications for task assignments and updates using **Socket.io**.
    -   Live status updates.
-   **Interactive Calendar**: Visual timeline of project deadlines and task due dates.
-   **Client Portal**: Dedicated view for clients to approve proposals and view project progress.
-   **Modern UI/UX**:
    -   Responsive design with **Tailwind CSS**.
    -   Collapsible sidebar with state persistence.
    -   Smooth transitions and interactive elements.
-   **API Documentation**: Integrated **Swagger UI** for exploring backend endpoints.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **State/Routing**: React Router DOM, Context API
-   **Utilities**: Axios, Date-fns, React Big Calendar, React Toastify

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (Mongoose)
-   **Real-time Engine**: Socket.io
-   **Authentication**: JWT (JSON Web Tokens), Bcrypt.js
-   **Documentation**: Swagger (OpenAPI 3.0)

## 📦 Prerequisites

-   [Node.js](https://nodejs.org/) (v16+ recommended)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AgencySoftware
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_DB_URL_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Optional: Cloudinary Cloud keys if using file upload features
```

Start the backend server:
```bash
# For development (with auto-restart)
npm run dev
# OR using nodemon directly
nodemon server.js

# For production
npm start
```
*The server will run on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend-vite
npm install
```

Create a `.env` file in the `frontend-vite` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```
*The application will open at `http://localhost:5173`*

## 📚 API Documentation

The backend includes fully interactive API documentation generated with Swagger.

1.  Ensure the backend server is running.
2.  Visit **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)** in your browser.
3.  You can explore endpoints for **Auth**, **Projects**, **Tasks**, and **Clients**.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the ISC License.
