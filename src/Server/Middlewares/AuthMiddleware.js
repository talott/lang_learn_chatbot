const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

//Verifies password and username match 
module.exports.userVerification = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false });
    }
    jwt.verify(token, `${process.env.TOKEN_KEY}`, async (err, decodedToken) => {
        if (err) {
            return res.json({ status: false });
        } else {
            const user = await User.findById(decodedToken.id);
            if ( user ) return res.json({ status: true, user: user.username, chatHistory: user.chatHistory });
            else return res.json({ status: false });
        }
    });
};

// @desc    Update user details
// @route   PUT /update
// @access  Private
module.exports.UpdateUserChat = async (req, res, next) => {
    try {
        const { filter, update } = req.body;

        //Change the below line to push the objects in the update array to the chatHistory array in user
        const user = await User.findOneAndUpdate(filter, update, {new: true});
        res.status(200).json({ success: true, data: user });
        next();
    } catch (error) {
        console.error(error);
    }
}
