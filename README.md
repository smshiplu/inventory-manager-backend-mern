# 📦 Inventory Management Web App (MERN Stack)

A full-stack inventory management application built using the MERN stack — MongoDB, Express.js, React, and Node.js. This project allows users to efficiently track and manage inventory items, including adding, updating, and deleting products. It also features image uploads via Cloudinary and email notifications powered by EmailJS.

<br/>

## 🛠️ Backend Overview
The backend of this Inventory Management Web App is built with Node.js, Express.js, and MongoDB, designed for scalability, modularity, and real-world functionality. It powers secure inventory operations, user authentication, file uploads, and email notifications — all structured for maintainability and performance.

<br/>


## 📂 Folder Structure

```
inventory-manager-backend-mern/  
├── config/         # Cloudinary & database configuration  
├── controllers/    # Business logic for products and users  
├── middlewares/    # Auth, validation, error handling  
├── models/         # Mongoose schemas for products and users  
├── routes/         # API route definitions  
├── temp/           # Temporary file storage  
├── uploads/        # Local file uploads before Cloudinary  
├── utils/          # Helper functions (e.g., email dispatch)  
├── .env            # Environment variables  
├── server.js       # Entry point for Express server  
```
***NOTE:*** This structure ensures clean separation of concerns and supports future scalability.

<br/>

## 🔐 Authentication & Middleware
- JWT-based authentication secures protected routes.
- Middleware handles:
- Token verification
- Input validation
- Centralized error handling
- Passwords are hashed using bcrypt for secure storage.

<br/>

## 📤 File Uploads with Cloudinary
- Integrated Cloudinary to handle product image uploads.
- Used multer for handling multipart/form-data.
- Uploaded images are stored securely and served via optimized URLs.
- Image URLs are saved in MongoDB for frontend rendering.


<br/>

## 📧 Email Notifications and Reset Password via EmailJS
- Used for actions like password recovery.

<br/>

## 🔗 API Endpoints

**🧾 Product API**
| Method | Endpoint | Description |
| :------- | :------ | :------- |
| POST | /api/products | Add a new product | 
| GET | /api/products | Retrieve all products | 
| GET | /api/products/:id | Get a single product by ID | 
| PUT | /api/products/:id | Update an existing product | 
| DELETE | /api/products/:id | Delete a product | 

***NOTE:*** All product endpoints are protected and include validation middleware.

<br>

**👤 User API**
| Method | Endpoint | Description |
| :------- | :------ | :------- |
| POST | /api/users/register | Register a new user | 
| POST | /api/users/login | Log in and receive JWT token | 
| POST | /api/users/forgot-password | Request password reset via email | 
| POST | /api/users/reset-password | Reset password using token | 
| PUT | /api/users/update | Update user profile or credentials | 

***NOTE:*** Password reset flow is handled securely via tokenized email links using EmailJS. All sensitive routes are protected by JWT authentication.

<br/>

## 🛠️ Installation Guide

### Step 1: Clone the Repository
```
# Backend
git clone https://github.com/smshiplu/inventory-manager-backend-mern.git
cd inventory-manager-backend-mern

# Frontend
git clone https://github.com/smshiplu/inventory-manager-frontend-mern
cd inventory-manager-frontend-mern
```

### Step 2: Install Dependencies
```
# Backend
cd inventory-manager-backend-mern
npm install

#Frontend
cd inventory-manager-backend-mern
npm install
```

<br/>

### Step 3: Configure Environment Variables
Create a .env file in the backend directory
```
CLOUDINARY_URL=Your-Cloudinary-URL
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PASS=Your-Email-Password
FRONTEND_URL=http://frontend-url.com
JWT_SECRET=Your-JWT-Secret
MONGO_URI=mongodb+srv://yourMongoDbURI
NODE_ENV=Product-or-Development
```
Create a .env file in the frontend directory
```
REACT_APP_BACKEND_URL=http://frontend-url.com
REACT_APP_GUEST_LOGIN_EMAIL=shiplu@example.com 
REACT_APP_GUEST_LOGIN_PASSWORD=random
NODE_ENV=development
```

<br/>

## 🧠 Backend Development Takeaways
- Built a modular, production-ready backend with real-world integrations.
- Learned to design secure authentication flows and scalable APIs.
- Gained experience in handling file uploads, email automation, and error management.
- Strengthened my understanding of Express middleware, routing, and third-party service integration.
