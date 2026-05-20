# One Spyde - Premium Food Ordering Web Application

One Spyde is a full-stack, beginner-friendly food ordering web application designed with a premium, responsive dark theme. It takes design inspiration from **Eat Club**, **Swiggy**, and **Zomato**, featuring modern typography (Outfit Google Font), smooth hover animations, and orange/black styling.

---

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide Icons, Axios, React Router DOM.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.

---

## ✨ Features

- **Discount Banners**: An auto-playing promotional banner slider on the homepage.
- **Category Browsing**: Rounded categories (Pizza, Burger, Biryani, Noodles, Thali, Dessert, Salad) with dynamic queries.
- **Veg/Non-Veg Filtering**: Toggle to display only vegetarian options. Custom badges (green circle/red triangle) for clear food selection.
- **Interactive Cart**: Database-backed persistent cart. Add items, change quantities, and checkout seamlessly.
- **Step-by-Step Order Tracking**: A tracking timeline showing order progress (Placed ➔ Preparing ➔ Shipped ➔ Delivered) in real-time.
- **Profile Customization**: Settings to view and update name, phone, and delivery address.
- **Admin Dashboard**:
  - **Manage Orders**: View customer details, ordered items, addresses, and select statuses from a dropdown.
  - **Edit Menu**: Add new items, update prices or special discounts, change stock availability, or delete items.

---

## 🛠️ Setup & Running Guide

### 1. Database Setup
1. Open your MySQL client (e.g. phpMyAdmin, MySQL Workbench, or Command Line).
2. Create a new database named `one_spyde`.
3. Import the database tables and sample menu seeds by running the code inside `backend/schema.sql`.

### 2. Configure Environment Variables
Inside the `backend/` folder, edit/verify the configuration values in the `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=one_spyde
DB_PORT=3306
JWT_SECRET=onespyde_secret_key_123
```

### 3. Initialize and Start Backend
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Start the Express server:
   ```bash
   npm run dev
   ```
   *(The server will start on port `5000` and automatically connect to MySQL)*.

### 4. Initialize and Start Frontend
1. Open another terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the Vite React server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 🔑 Demo Account Logins
You can register a new account on the signup page. Once signed up, the 6-digit OTP verification code will show up directly in a yellow warning box on your screen for simulated simplicity.

- **Admin Account**: You can change any registered user's role to `'admin'` directly in your MySQL database table `users` to test the admin panel.
