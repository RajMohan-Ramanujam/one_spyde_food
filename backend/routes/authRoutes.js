const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/db');

// Helper function to hash password using Node.js built-in crypto
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password and generate dummy OTP
    const hashedPassword = hashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Insert user into DB
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, otp, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone || '', otp, false]
    );

    console.log(`[OTP Simulator] OTP for ${email} is ${otp}`);

    res.status(201).json({
      message: 'Registration successful! Please verify your OTP.',
      email,
      otp, // Sending OTP back for beginner-friendly testing/simulation
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 2. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    if (user.otp === otp) {
      // Update user as verified and clear OTP
      await db.query('UPDATE users SET is_verified = 1, otp = NULL WHERE id = ?', [user.id]);
      res.status(200).json({ message: 'OTP verified successfully! You can now log in.' });
    } else {
      res.status(400).json({ message: 'Invalid OTP code' });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 3. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];
    const hashedPassword = hashPassword(password);

    if (user.password !== hashedPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.is_verified) {
      // Regenerate OTP if not verified
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await db.query('UPDATE users SET otp = ? WHERE id = ?', [otp, user.id]);
      console.log(`[OTP Simulator] Verification OTP for ${email} is ${otp}`);

      return res.status(403).json({
        message: 'Account not verified. OTP sent to email.',
        unverified: true,
        email,
        otp // Sending OTP for demo simplicity
      });
    }

    // Generate a simple token: base64 encoded user info
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString('base64');

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 4. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    const user = users[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.query('UPDATE users SET otp = ? WHERE id = ?', [otp, user.id]);
    console.log(`[OTP Simulator] Reset Password OTP for ${email} is ${otp}`);

    res.status(200).json({
      message: 'Password reset OTP sent.',
      email,
      otp // Sending OTP back for simplified frontend flows
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 5. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    const hashedNewPassword = hashPassword(newPassword);
    await db.query('UPDATE users SET password = ?, otp = NULL, is_verified = 1 WHERE id = ?', [hashedNewPassword, user.id]);

    res.status(200).json({ message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 6. UPDATE PROFILE
router.put('/profile', async (req, res) => {
  try {
    const { userId, name, phone, address } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    await db.query(
      'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, userId]
    );

    // Fetch updated user
    const [users] = await db.query('SELECT id, name, email, phone, address, role FROM users WHERE id = ?', [userId]);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
