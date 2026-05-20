# One Spyde - Premium Food Ordering Web Application

One Spyde is a full-stack, beginner-friendly food ordering web application designed with a clean, modern **Light Theme** layout. It takes direct design inspiration from the signature **Eat Club** user interface, featuring:
- A compact custom game & food themed **Basketball-Pizza** SVG brand logo.
- Auto-moving promo slides with manual left/right navigation arrows.
- Horizontal row-based food cards with overlapping centered ADD buttons.
- Clean category filter icons ("What's on your mind?").

---

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Custom SVG Graphic Assets, Axios, React Router DOM (with active tab indicator highlighting).
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.

---

## ✨ Features

- **Eat Club Food Cards**: Dish description, veg indicator, category, and pricing on the left; rounded square food image on the right with an overlapping centered `ADD` pill button.
- **Promo Banners Carousel**: Auto-looping carousel with manual left/right navigation arrows on the home page.
- **What's on your mind?**: Interactive circular food categories (Pizza, Burger, Biryani, Noodles, Thali, Dessert, Salad) that query the database in real-time.
- **Veg/Non-Veg Filtering**: One-click toggle switch to filter dishes. Contains custom veg (green circle) and non-veg (red triangle) indicator boxes.
- **Persistent Cart**: Database-backed cart. Items persist across page refreshes.
- **Step-by-Step Order Tracking**: Real-time progress timeline showing order status updates (Placed ➔ Preparing ➔ Shipped ➔ Delivered).
- **Profile Customization**: Clean dashboard to manage name, mobile number, and delivery address.

---

## 🛠️ Setup & Running Guide

### 1. Database Setup
1. Open your MySQL client (e.g. phpMyAdmin, MySQL Workbench, or CLI).
2. Create a new database named `one_spyde`.
3. Import the database tables and sample menu seeds by running the code inside `backend/schema.sql`.

### 2. Configure Environment Variables
Inside the `backend/` folder (directly in the root directory), edit/verify the configuration values in the `.env` file:
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
1. Open your terminal and navigate to the backend folder in the root:
   ```bash
   cd backend
   ```
2. Start the Express server:
   ```bash
   npm run dev
   ```
   *(The server will start on port `5000` and automatically connect to MySQL)*.

### 4. Initialize and Start Frontend
1. Open another terminal window and navigate to the frontend folder in the root:
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
You can register a new account on the signup page. Once signed up, the 6-digit OTP verification code will show up directly in a yellow warning box on your screen for simulated testing convenience.

