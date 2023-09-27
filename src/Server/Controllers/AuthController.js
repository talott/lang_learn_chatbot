const User = require('../Models/UserModel');
const { createSecretToken } = require('../util/SecretToken');
const bcrypt = require('bcrypt');

/* TODO:
/... check if username exists already continuously
*/

// @desc    Register a new user
// @route   POST /signup
// @access  Public
module.exports.Signup = async (req, res, next) => {
    try {
        const { username, password, email, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.json({
                message: 'User already exists'
            });
        }

        const user = await User.create({
            username,
            password,
            email,
            createdAt
        });

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
        .status(201)
        .json({ message: "User signed up successfully", success: true, user });
        next(); 
    } catch (error) {
        console.error(error);
    }
}

// @desc    Signs an existing user in
// @route   POST /login
// @access  Public
module.exports.Login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.json({message:"Please enter all fields"});
        }

        const user = await User.findOne({email});

        if(!user) {
            return res.json({ message: "Incorrect password or email" });
        }

        const auth = await bcrypt.compare(password, user.password);
        if(!auth) {
            return res.json({
              message: "Incorrect password or email",
            });
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({
            message: "User logged in successfully",
            success: true,
        });
        next()


    } catch (err) {
        console.error(err);
    }
}

