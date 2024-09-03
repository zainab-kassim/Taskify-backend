const express = require('express');
const User=require('../../models/user')
const bcrypt = require('bcrypt');
const generateToken=require('../../passport-auth/auth')
const router = express.Router()



//sign-up
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body
        const existingUser = await User.findOne({ Username: username })
        if (existingUser) {
            return res.json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            Username: username,
            Password: hashedPassword
        })
        await newUser.save();
        const token = await generateToken(newUser)
        const Username = newUser.Username
        return res.json({ message: "User registered successfully", token, Username })
    } catch (error) {
        console.log(error);
    }
});

//sign in
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body
        const existingUser = await User.findOne({ Username: username })

        if (!existingUser) {
            return res.json({ message: "invalid username" })
        }
        const PasswordMatch = await bcrypt.compare(password, existingUser.Password)
        if (PasswordMatch) {
            const token = await generateToken(existingUser)
            const Username = existingUser.Username
            return res.json({ message: "User signed in successfully", token, Username })
        } else {
            return res.json({ message: "invalid password" })
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports=router