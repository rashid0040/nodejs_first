const express = require('express');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();


router.post('/register', async (req, res) => {
    const {username, password , role} = req.body;

    const userExists = await User.findOne({username});

    if (userExists) {
        return res.status(400).send('User already exists');
        
    }

    const newUser = new User({username, password, role});
    await newUser.save();

    const token = jwt.sign({id: newUser._id, role:newUser.role}, process.env.JWT_SECRET, {expiresIn: '1h'} );

    res.status(201).send({token});

});

router.post('/login' , async (req, res)=> {
    const { username, password } = req.body;

    const user = await User.findOne({username});
    // check user
    if (!user) {
        return res.status(400).send('Invalid credentials');
    }

    // check password

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
        return res.status(400).send('Invalid credentials');
        
    }

    // generate jwt

    const token= jwt.sign({id: user._id,username: user.username, role:user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});

    res.status(200).send({token});
    


});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful. Token should be deleted on client.' });
});


module.exports = router;