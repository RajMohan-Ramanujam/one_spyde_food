const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper to decode base64 token and check admin role
const isAdmin = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    return decoded && decoded.role === 'admin';
  } catch (e) {
    return false;
  }
};

// 1. GET ALL FOODS (with filters)
router.get('/', async (req, res) => {
  try {
    const { search, category, is_veg } = req.query;
    let query = 'SELECT * FROM foods WHERE is_available = 1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (is_veg !== undefined && is_veg !== '') {
      query += ' AND is_veg = ?';
      params.push(is_veg === 'true' || is_veg === '1' ? 1 : 0);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sort by rating or fresh addition
    query += ' ORDER BY id DESC';

    const [foods] = await db.query(query, params);
    res.status(200).json(foods);
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ message: 'Error retrieving food items' });
  }
});

// 2. GET FOOD BY ID
router.get('/:id', async (req, res) => {
  try {
    const [foods] = await db.query('SELECT * FROM foods WHERE id = ?', [req.params.id]);
    if (foods.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json(foods[0]);
  } catch (error) {
    console.error('Get food details error:', error);
    res.status(500).json({ message: 'Error retrieving food details' });
  }
});

// 3. ADD FOOD (Admin Only)
router.post('/', async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { name, description, price, image_url, category, is_veg, discount_percent } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const [result] = await db.query(
      'INSERT INTO foods (name, description, price, image_url, category, is_veg, discount_percent, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name,
        description || '',
        price,
        image_url || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500',
        category,
        is_veg === true || is_veg === 1 || is_veg === 'true' ? 1 : 0,
        discount_percent || 0,
        4.0
      ]
    );

    res.status(201).json({ message: 'Food item added successfully!', foodId: result.insertId });
  } catch (error) {
    console.error('Add food error:', error);
    res.status(500).json({ message: 'Error adding food item' });
  }
});

// 4. UPDATE FOOD (Admin Only)
router.put('/:id', async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { name, description, price, image_url, category, is_veg, discount_percent, is_available } = req.body;
    const foodId = req.params.id;

    const [existing] = await db.query('SELECT * FROM foods WHERE id = ?', [foodId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    await db.query(
      'UPDATE foods SET name = ?, description = ?, price = ?, image_url = ?, category = ?, is_veg = ?, discount_percent = ?, is_available = ? WHERE id = ?',
      [
        name,
        description,
        price,
        image_url,
        category,
        is_veg === true || is_veg === 1 || is_veg === 'true' ? 1 : 0,
        discount_percent || 0,
        is_available === false || is_available === 0 || is_available === 'false' ? 0 : 1,
        foodId
      ]
    );

    res.status(200).json({ message: 'Food item updated successfully!' });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ message: 'Error updating food item' });
  }
});

// 5. DELETE FOOD (Admin Only)
router.delete('/:id', async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const foodId = req.params.id;

    // Delete item (can also do soft delete but hard delete is simpler for user DB)
    const [result] = await db.query('DELETE FROM foods WHERE id = ?', [foodId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json({ message: 'Food item deleted successfully!' });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ message: 'Error deleting food item' });
  }
});

module.exports = router;
