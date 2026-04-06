# 🔍 ReClaimIt – College Lost & Found System

ReClaimIt is a responsive web application designed for college environments to manage lost and found items efficiently. It allows users to report, track, and recover lost belongings through a simple and organized platform.

## 🚀 Features

### 🔐 Authentication
- Firebase Email & Password login
- Email verification required before account access
- Secure user session handling

### 👤 User Profile
- Stores user details (Name, Department, Year, Register Number, Mobile)
- Editable profile section
- Data stored in Firestore

### 📦 Lost & Found System
- Post Lost Items
- Post Found Items
- Upload item images (Cloudinary)
- Add item details:
  - Title
  - Description
  - Location
  - Date

### 📊 Dashboard
- View all lost items
- View all found items
- Filter options:
  - All Lost
  - All Found
  - My Lost
  - My Found

### 🔄 Item Management
- Mark lost items as "Found"
- Remove found items after returning
- Status-based filtering (Active / Resolved)

### 🎨 UI/UX
- Clean modern UI (Glassmorphism design)
- Fully responsive (Mobile + Desktop)
- Consistent layout and spacing

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), CSS  
- **Backend:** Firebase Authentication  
- **Database:** Cloud Firestore  
- **Image Storage:** Cloudinary  

## 🔄 Application Flow

1. User signs up with email & password  
2. Email verification is sent  
3. User verifies email  
4. User logs in  
5. User can:
   - Post lost/found items  
   - View dashboard  
   - Manage their items  
   - Edit profile
     
## 🔮 Future Improvements
- Notifications for item match  
- Location-based filtering  
- AI-based item matching  
- Mobile app version  

## 👩‍💻 Author
**Harini S**

## 💡 About the Project
This project is built to solve real-world problems in college campuses by digitizing the lost and found process with a user-friendly interface and scalable backend.
