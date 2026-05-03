const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin login: hardcoded user "admin" / "medichain2024" for demo
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (username === 'admin' && password === 'medichain2024') {
            const payload = {
                user: {
                    id: 'admin',
                    role: 'clinician'
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET || 'medichain_secret_key',
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } else {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
