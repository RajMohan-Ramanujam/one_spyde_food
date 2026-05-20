const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Helper to decode base64 token and retrieve user ID
const getUserId = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    return decoded ? decoded.id : null;
  } catch (e) {
    return null;
  }
};

// Middleware to check authentication
const authMiddleware = (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  req.userId = userId;
  next();
};

// Apply auth middleware to all cart routes
router.use(authMiddleware);

// 1. GET CART ITEMS (Joined with Foods table to get metadata)
router.get('/', async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT c.id AS cart_id, c.food_id, c.quantity, f.name, f.description, 
              f.price, f.image_url, f.category, f.is_veg, f.discount_percent 
       FROM cart c 
       JOIN foods f ON c.food_id = f.id 
       WHERE c.user_id = ?`,
      [req.userId]
    );
    res.status(200).json(items);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Error retrieving cart' });
  }
});

// 2. ADD TO CART / INCREMENT
router.post('/add', async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return res.status(400).json({ message: 'Food ID is required' });
    }

    // Check if food exists
    const [foods] = await db.query('SELECT * FROM foods WHERE id = ?', [foodId]);
    if (foods.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Check if item already in user cart
    const [existing] = await db.query('SELECT * FROM cart WHERE user_id = ? AND food_id = ?', [req.userId, foodId]);

    if (existing.length > 0) {
      // Update quantity
      const newQty = existing[0].quantity + Number(quantity);
      await db.query('UPDATE cart SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      // Insert new item
      await db.query('INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, ?)', [req.userId, foodId, quantity]);
    }

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

// 3. UPDATE QUANTITY
router.put('/update', async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || quantity === undefined) {
      return res.status(400).json({ message: 'Food ID and quantity are required' });
    }

    if (Number(quantity) <= 0) {
      // Remove item if quantity set to 0 or negative
      await db.query('DELETE FROM cart WHERE user_id = ? AND food_id = ?', [req.userId, foodId]);
      return res.status(200).json({ message: 'Item removed from cart' });
    }

    const [result] = await db.query(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND food_id = ?',
      [quantity, req.userId, foodId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// 4. REMOVE ITEM FROM CART
router.delete('/remove/:foodId', async (req, res) => {
  try {
    const foodId = req.params.foodId;
    const [result] = await db.query('DELETE FROM cart WHERE user_id = ? AND food_id = ?', [req.userId, foodId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
});

// 5. CLEAR CART
router.delete('/clear', async (req, res) => {
  try {
    await db.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

module.exports = router;
