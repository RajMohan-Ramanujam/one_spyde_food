-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS one_spyde;
USE one_spyde;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(20) DEFAULT 'user',
  otp VARCHAR(6) DEFAULT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Foods Table
CREATE TABLE IF NOT EXISTS foods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  is_veg BOOLEAN DEFAULT TRUE,
  discount_percent INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 4.0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  items TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'Pending',
  order_status VARCHAR(50) DEFAULT 'Pending',
  delivery_address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Sample Foods
INSERT INTO foods (name, description, price, image_url, category, is_veg, discount_percent, rating, is_available) VALUES
('Margherita Pizza', 'Classic delight with 100% real mozzarella cheese, fresh basil leaves, and tomato sauce.', 299.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60', 'Pizza', 1, 10, 4.5, 1),
('Peppy Paneer Pizza', 'Chunky paneer, crisp capsicum, and spicy red pepper with mozzarella cheese.', 349.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60', 'Pizza', 1, 15, 4.3, 1),
('Double Cheese Burger', 'Juicy grilled veg patty, double cheese slice, fresh lettuce, and special spyde sauce.', 149.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', 'Burger', 1, 20, 4.6, 1),
('Crispy Chicken Burger', 'Crispy fried chicken breast fillet, creamy mayonnaise, and crunchy lettuce.', 189.00, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60', 'Burger', 0, 5, 4.4, 1),
('Hyderabadi Veg Biryani', 'Fragrant basmati rice layered with vegetables, slow-cooked in dum style with rich spices.', 249.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60', 'Biryani', 1, 12, 4.7, 1),
('Special Chicken Biryani', 'Juicy chicken pieces marinated in spices, layered with saffron basmati rice.', 299.00, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60', 'Biryani', 0, 10, 4.8, 1),
('Spicy Schezwan Noodles', 'Stir-fried noodles tossed with fresh vegetables in fiery Schezwan sauce.', 169.00, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60', 'Noodles', 1, 15, 4.2, 1),
('Chicken Hakka Noodles', 'Classic wok-tossed noodles with chicken shreds, eggs, and fresh scallions.', 199.00, 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=500&auto=format&fit=crop&q=60', 'Noodles', 0, 0, 4.3, 1),
('Paneer Butter Masala', 'Soft paneer cubes cooked in a rich, creamy, and mildly sweet tomato gravy.', 229.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60', 'Thali', 1, 10, 4.5, 1),
('Butter Chicken', 'Tender tandoori chicken cooked in a rich, buttery, and creamy tomato gravy.', 279.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60', 'Thali', 0, 10, 4.6, 1),
('Choco Lava Cake', 'Delectable chocolate cake with a gooey, molten chocolate center.', 99.00, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60', 'Dessert', 1, 30, 4.9, 1),
('Greek Salad', 'Crisp cucumbers, fresh tomatoes, red onions, kalamata olives, and feta cheese.', 179.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60', 'Salad', 1, 5, 4.1, 1);
