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

### Modules Description

**ADMINS / NGO-RELIEF CENTER**
- Dashboard  
- Manage Users  
- Manage Volunteers  
- Manage Relief Camps  
- Manage Inventory  
- Receive & Manage Donations  
- Approve Relief Requests  
- Allocate Relief Resources  
- Assign Volunteers  
- Track Relief Distribution  
- Manage SOS Requests  
- Manage Disaster Alerts  
- Broadcast Hazard Notifications  
- Generate Reports & Analytics 

**Volunteer**
- Register / Login 
- Register Skills 
- View Nearby SOS Requests 
- View Relief Tasks 
- Accept Rescue & Delivery Tasks 
- Deliver Relief Items 
- Verify Task Completion 
- Update Task Status 
- Safe Route Navigation 

**User (Affected Person)**
- Quick Phone Number Login 
- Send SOS Request 
- Update "I'm Safe" Status 
- Request Relief Items 
- Find Nearby Relief Camps 
- View Nearby Emergency Services 
- View Emergency Contacts 
- Track Relief Request Status 
- Receive Push Notifications 

### Main Modules:          
1. Authentication Module 
2. Affected Person Module 
3. Volunteer Module 
4. NGO & Relief Center Module 
5. SOS & Emergency Module 
6. Relief Request & Donation Module 
7. Inventory Management Module 
8. Relief Camp Management Module 
9. Maps & Navigation Module 
10. Weather, News & Disaster Alert Module 
11. Notification Module 
12. Reports & Analytics 
13. Admin Dashboard

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
