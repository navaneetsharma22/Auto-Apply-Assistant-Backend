const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validate all four fields are present and non-empty
    if (!name || !email || !password || !confirmPassword || !name.trim() || !email.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 2. Validate email matches a standard email format
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 3. Validate password.length >= 8
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // 4. Validate password === confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 5. Check MongoDB for an existing user with this email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // 6. Hash password with bcrypt (saltRounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Create user document
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // 8. Generate JWT with payload { userId: user._id }, expiry 7d
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 9. Set JWT on httpOnly cookie
    res.cookie('token', token, COOKIE_OPTIONS);

    // 10. Respond 201 { user: { id, name, email } }
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate both fields present
    if (!email || !password || !email.trim()) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Compare password against user.password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 4. Generate JWT & set httpOnly cookie
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    // 5. Respond 200 { user: { id, name, email } }
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out' });
};

// GET /api/auth/verify
const verify = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verify,
};

