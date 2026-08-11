# 🌍 Wander-Lust

![Wander-Lust](https://img.shields.io/badge/Status-Deployed-success?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%26%20Tablet-blue?style=for-the-badge)

**Wander-Lust** is a full-stack MVC web application for travel listings utilizing Express, MongoDB, and EJS[cite: 2]. Inspired by Airbnb, it allows users to explore, create, edit, and review travel destinations. The application features a fully responsive design, secure authentication, interactive maps, and cloud-based image storage.

## 🚀 Live Demo
*Successfully deployed the application on Render, managing the online database with MongoDB Atlas[cite: 2].*
> **[https://wander-lust-vpje.onrender.com/listings]**

---

## ✨ Key Features

- **📱 Fully Responsive UI (NEW):** The application layout completely adapts to Mobile, iPad/Tablet, and Desktop screens for a seamless user experience across all devices.
- **🔐 Secure Authentication:** Implemented secure user authentication with Passport.js[cite: 2]. Only logged-in users can create listings or leave reviews.
- **🛡️ Authorization Control:** Strict ownership controls ensure users can only edit or delete the specific listings and reviews they personally created.
- **🗺️ Interactive Maps:** Integrated Mapbox for interactive location mapping[cite: 2], utilizing forward geocoding to drop exact visual pins for properties.
- **☁️ Image Uploads:** Utilized Cloudinary for cloud image storage[cite: 2], seamlessly parsed via Multer.
- **✅ Data Validation:** Server-side validation using Joi ensures data integrity before it reaches the database.
- **💬 Flash Messages & Sessions:** Real-time user feedback and secure session management using `connect-flash` and `express-session`.

---

## 🛠️ Tech Stack

### Frontend (Views)
- **EJS (Embedded JavaScript):** Templating engine.
- **EJS-Mate:** For layouts and boilerplate includes.
- **CSS & HTML5:** Custom styling and responsive flexbox/grid layouts.

### Backend (Controllers & Routes)
- **Node.js & Express.js:** Server and robust backend framework.
- **Mapbox SDK:** Geocoding and map rendering.
- **Cloudinary & Multer:** Image processing and cloud storage.
- **Joi:** Schema validation.
- **Dotenv:** Environment variable management.

### Database (Models)
- **MongoDB Atlas:** Cloud database hosted on AWS.
- **Mongoose:** ODM for MongoDB.
- **Passport.js & Passport-Local-Mongoose:** Authentication and user schema management.

---

## 📂 Project Structure (MVC Architecture)

The project strictly follows the **Model-View-Controller** design pattern for a clean, modular codebase:

```text
WANDER-LUST/
├── controllers/       # Core logic for handling requests (listing.js, review.js, user.js)
├── init/              # Database initialization scripts and sample data
├── models/            # Mongoose schemas (listing.js, review.js, user.js)
├── public/            # Static assets (Custom CSS, client-side JS for maps)
├── routes/            # Express routers separating API endpoints
├── utils/             # Utility classes for error handling (ExpressError.js, wrapAsync.js)
├── views/             # EJS templates (layouts, includes, listings, users)
├── app.js             # Main application entry point
├── cloudConfig.js     # Cloudinary configuration
├── middleware.js      # Custom middleware (auth, validation, etc.)
└── schema.js          # Joi validation schemas
