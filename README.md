# HYPE — E-Commerce Platform

A full-stack MERN e-commerce platform with a **powerful admin panel for managing the entire store**.

## 🛠️ Tech Stack

* React + Vite
* Node.js + Express.js
* MongoDB + Mongoose
* JWT + HTTP-only Cookies
* Cloudinary + Multer

## 👨‍💼 Admin Panel

The admin dashboard provides centralized control over the store.

### Dashboard

* Overview of store performance
* Total users
* Total products
* Total orders
* Revenue statistics
* Recent orders

### Product Management

* Create products
* Update products
* Delete products
* Upload product images
* Manage price, stock and categories
* Search and filter products

### Order Management

* View all orders
* View order details
* Update order status
* Track pending, processing, shipped and delivered orders
* Manage cancelled orders

### User Management

* View registered users
* View user details
* Manage user roles
* Restrict/remove users when required

### Admin Security

* Protected admin routes
* Role-based authorization
* JWT authentication
* HTTP-only cookies
* Server-side authorization checks

## 🛍️ User Features

* User registration & login
* Browse products
* Product search/filtering
* Shopping cart
* Checkout
* Order history
* Order tracking

## 🚀 Run Locally

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Configure MongoDB, JWT, Cloudinary and frontend URL variables in `.env`.

## 📁 Structure

```text
HYPE/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── context/
```

**HYPE** — E-commerce with a complete store management system.
