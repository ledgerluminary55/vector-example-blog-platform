const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const {getModel} = require('ottoman');
const User = getModel('User');
const { PropertyRequiredError} = require("../api/errors");
const  {Logger} = require('../config/logger');
const log = Logger.child({
    namespace: 'UsersController',
});


// @desc registration for a user
// @route POST /api/users
// @access Public
// @required fields {email, username, password}
// @return User
const registerUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.username || !user.password) {
        const error = {message: "All fields are required"};
        if (!user.email) error["email"] = "";
        if (!user.username) error["username"] = "";
        if (!user.password) error["password"] = "";
        return res.status(400).json(error);
    }

    // hash password
    const hashedPwd = await bcrypt.hash(user.password, 10); // salt rounds

    const userObject = {
        "username": user.username,
        "password": hashedPwd,
        "email": user.email
    };
    const createdUser = await User.create(userObject).catch(e => {
        console.log(e.name)
        console.log(e.message)
        console.log(e.property)
        console.log(e)
        if (e instanceof PropertyRequiredError) {
            const err = {
                errors: {
                    body: "Unable to register a user",
                }
            };
            if (e.field) {
                err[e.field] = e.value;
                return res.status(422).json({err});
            }
        }
    });
    if (createdUser) { // user object created
        res.status(201).json({
            user: createdUser.toUserResponse()
        })
    } else {
        res.status(422).json({
            errors: {
                body: "Unable to register a user",
                email: user.email
            }
        });
    }
});

// @desc get currently logged-in user
// @route GET /api/user
// @access Private
// @return User
const getCurrentUser = asyncHandler(async (req, res) => {
    // After authentication; email and hashsed password was stored in req
    const email = req.userEmail;

    const user = await User.findOne({ email }).catch(e => log.debug(e, "Error fetching user"));
    if (!user) {
        return res.status(404).json({message: "User Not Found"});
    }

    res.status(200).json({
        user: user.toUserResponse()
    })

});

// @desc login for a user
// @route POST /api/users/login
// @access Public
// @required fields {email, password}
// @return User
const userLogin = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user || !user.email || !user.password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const loginUser = await User.findOne({ email: user.email }).catch(e => log.debug(e, "Error fetching user"));
    if (!loginUser) {
        return res.status(404).json({errors: { message: 'User Not Found' }});
    }

    const match = await bcrypt.compare(user.password, loginUser.password);
    if (!match) {return res.status(401).json({errors: { message: 'Unauthorized: Wrong password' }})}
    res.status(200).json({
        user: loginUser.toUserResponse()
    });

});

// @desc update currently logged-in user
// Warning: if password or email is updated, client-side must update the token
// @route PUT /api/user
// @access Private
// @return User
const updateUser = asyncHandler(async (req, res) => {
    const { user } = req.body;

    // confirm data
    if (!user) {
        return res.status(400).json({message: "Required a User object"});
    }

    const email = req.userEmail;

    const target = await User.findOne({ email }).catch(e => log.debug(e, "Error fetching user"));

    if (!target) {
        return res.status(404).json({message: "User not found"});
    }
    if (user.email) {
        target.email = user.email;
    }
    if (user.username) {
        target.username = user.username;
    }
    if (user.password) {
        const hashedPwd = await bcrypt.hash(user.password, 10);
        target.password = hashedPwd;
    }
    if (typeof user.image !== 'undefined') {
        target.image = user.image;
    }
    if (typeof user.bio !== 'undefined') {
        target.bio = user.bio;
    }
    await target.save();

    return res.status(200).json({
        user: target.toUserResponse()
    });

});

module.exports = {
    registerUser,
    getCurrentUser,
    userLogin,
    updateUser
}
