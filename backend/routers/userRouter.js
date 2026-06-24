const express = require('express');
const Model = require('../models/userModel');
const jwt = require('jsonwebtoken');
const authorise = require('../middleware/auth');
const bcrypt = require('bcryptjs'); // <-- Password secure karne ke liye import kiya
require('dotenv').config();

const router = express.Router();

// SIGNUP ROUTE (Modified /add)
router.post('/add', async (req, res) => {
    console.log(req.body);
    try {
        const { username, email, password, ...rest } = req.body;

        // 1. Check karein agar user pehle se exist karta hai
        let userExists = await Model.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        // 2. Password ko secure (Hash) karein
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Naya user object create karke save karein
        const newUser = new Model({
            username,
            email,
            password: hashedPassword,
            ...rest // Agar city ya kuch aur extra data aa raha ho toh
        });

        const result = await newUser.save();
        res.status(200).json(result);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/getall',  (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update - put
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Delete - delete
router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// LOGIN ROUTE (Modified /authenticate)
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. User ko email se find karein
        const result = await Model.findOne({ email });
        
        if (result) {
            // 2. Encrypted password ko compare karein
            const isMatch = await bcrypt.compare(password, result.password);
            
            if (isMatch) {
                const { _id, email } = result;
                jwt.sign(
                    { _id, email },
                    process.env.JWT_SECRET || 'secretkey', // Fallback agar env na mile
                    { expiresIn: '1h' },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json(err);
                        } else {
                            res.status(200).json({ token });
                        }
                    }
                );
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;