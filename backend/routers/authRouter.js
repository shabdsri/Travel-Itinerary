const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Jo aapki userModel.js file hai
const bcrypt = require('bcryptjs');

// REGISTER / SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Pehle check karein ki user pehle se exist toh nahi karta
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already registered!' });
    }

    // 2. Password ko secure/hash karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Naya user data database mein save karein
    user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;