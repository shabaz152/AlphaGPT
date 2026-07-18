import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working",
  });
});

// Signup
router.post("/signup", async (req, res) => {

    const { username, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Signup failed"
        });

    }

});


// Login
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                error: "Incorrect password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Login failed"
        });

    }

});
router.post("/google", async (req, res) => {

    try {

        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const email = payload.email;
        const username = payload.name;

        let user = await User.findOne({ email });

        if (!user) {

            user = new User({
                username,
                email,
                password: "GOOGLE_LOGIN"
            });

            await user.save();

        }

        const jwtToken = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token: jwtToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Google authentication failed."
        });

    }

});

export default router;