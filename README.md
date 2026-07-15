# ReliefLink — Full-Stack Disaster Management Platform 🌍🤝

ReliefLink is a comprehensive disaster management web application built with a modern tech stack (React, Vite, Node.js, Express.js, and MongoDB). The platform is designed to support the complete lifecycle of disaster response by seamlessly connecting affected individuals, volunteers, NGOs/Relief Centers, and Administrators.

---

## 🚀 Features & Architecture Overview

The system architecture is divided into an intuitive React-based **frontend** and a robust, scalable Express-based **backend**.

### Tech Stack
- **Frontend**: React.js (Vite), TailwindCSS, Zustand (State Management), Leaflet.js (Interactive Maps)
- **Backend**: Node.js, Express.js, Socket.io (Real-time updates)
- **Database**: MongoDB (Mongoose)

---

## 👥 Roles & Portals

ReliefLink provides dedicated portals tailored for four distinct user roles:

| Role | Access Method | Key Dedicated Features |
|---|---|---|
| **Affected Person** | Phone OTP login | One-tap SOS, "I'm Safe" status, Relief item requests, Leaflet-based Camp Locator |
| **Volunteer** | Email/Password | Accept tasks, Navigate map for rescues/deliveries, Update objective progress |
| **NGO / Relief Center** | Email/Password | Camp management, Inventory tracking, Donation management, KPI Dashboard |
| **Admin** | Email/Password | Full system management, System-wide reports, Disaster Alerts broadcasts |

---

## 🛠️ System Modules

### Affected Person Portal
- **Dashboard**: Quick actions for SOS, finding camps, and checking request statuses.
- **SOS System**: One-tap SOS with auto-detected location, disaster type, and priority routing.
- **Relief Requests**: Checklist for requesting essential items like food, water, medicine, and clothing.
- **Camp Finder**: Interactive map showing nearby relief camps, available services, and directions.
- **Live Alerts**: Live disaster alerts, integrated weather widget (via OpenWeatherMap), and news feeds.

### Volunteer Portal
- **Volunteer Dashboard**: Active tasks, personal stats, and nearby requests mapped out.
- **Task Management**: Turn-by-turn navigation for rescues and deliveries, real-time status updates via Socket.io.

### NGO / Relief Center Portal
- **KPI Dashboard**: Overview of camps, inventory levels, and pending approvals.
- **Camp & Inventory Management**: Create and track camps, manage stock in/out, and low-stock alerts.
- **Task Assignment**: Approve relief requests and assign volunteers to tasks.
- **Donations**: Log and manage incoming resources.

### Admin Portal
- **System Dashboard**: Real-time activity feeds and system-wide statistics.
- **Alert Broadcasting**: Issue disaster alerts and define hazard zones to be broadcasted to all users.
- **User & SOS Management**: Global oversight for all unassigned SOS requests and user verifications.

---

## 🚦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (Local or Atlas)
- OpenWeatherMap API Key (for Live Weather Integration)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vivek-k001/Relieflink.git
   cd Relieflink
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file with your MONGO_URI, JWT_SECRET, Port etc.
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 💡 Phase 1 Implementation Summary

- ✅ Full Application Scaffolding (Frontend + Backend)
- ✅ Role-based Authentication (OTP Mock & JWT)
- ✅ Affected Person, Volunteer, NGO, & Admin features
- ✅ Real-time Updates via Socket.io for SOS & Tasks
- ✅ Interactive Maps (Leaflet.js)
- ✅ Modern, responsive UI with premium aesthetics (TailwindCSS)
