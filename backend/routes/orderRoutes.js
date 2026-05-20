const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper to decode base64 token and retrieve user ID and role
const getAuthUser = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
  } catch (e) {
    return null;
  }
};

// Middleware to check authentication
const authMiddleware = (req, res, next) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  req.userId = user.id;
  req.userRole = user.role;
  next();
};

// Apply auth middleware to all order routes
router.use(authMiddleware);

// 1. CREATE ORDER (Checkout)
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, phone, paymentStatus = 'Pending' } = req.body;

    if (!items || !totalAmount || !deliveryAddress || !phone) {
      return res.status(400).json({ message: 'All order fields are required' });
    }

    // Convert items array to JSON string for MySQL storage
    const itemsJsonStr = JSON.stringify(items);

    // Insert order into DB
    const [result] = await db.query(
      `INSERT INTO orders (user_id, items, total_amount, payment_status, order_status, delivery_address, phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.userId, itemsJsonStr, totalAmount, paymentStatus, 'Pending', deliveryAddress, phone]
    );

    // Clear cart since order is placed
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId: result.insertId
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// 2. GET USER ORDER HISTORY
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [req.userId]
    );

    // Parse the items JSON string back to objects for each order
    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error retrieving orders' });
  }
});

// 3. GET ALL ORDERS (Admin Only)
router.get('/admin/all', async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const [orders] = await db.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.id DESC`
    );

    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Error retrieving all orders' });
  }
});

// 4. UPDATE ORDER STATUS (Admin Only)
router.put('/admin/status/:id', async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { orderStatus, paymentStatus } = req.body;
    const orderId = req.params.id;

    const [existing] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    let updateFields = [];
    let queryParams = [];

    if (orderStatus) {
      updateFields.push('order_status = ?');
      queryParams.push(orderStatus);
    }
    if (paymentStatus) {
      updateFields.push('payment_status = ?');
      queryParams.push(paymentStatus);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    queryParams.push(orderId);
    await db.query(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      queryParams
    );

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
