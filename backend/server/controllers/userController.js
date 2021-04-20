const { User, Token, PasswordResetToken } = require('../models/userModel'),
// const Token = require('../models/tokenModel'),
jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt');

var crypto = require('crypto');
var nodemailer = require('nodemailer');


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

async function checkEmailExist(email) {

    const res = await User.find({email: email});
    return await (res.length > 0 ? true : false);
}

exports.signup = async (req, res, next) => {
    try {
        const {name, email, password, phone, gender, dob, role, status} = req.body,
            emailAlreadyExist = await checkEmailExist(email);

        if (emailAlreadyExist) {

            res.json({
                success: false,
                message: "Already exists with this email try with other email address"
            })
        }
        else {

            const hashedPassword = await hashPassword(password),
                newUser = new User({
                    name,
                    email,
                    password: hashedPassword,
                    phone,
                    gender,
                    dob,
                    role: role || "basic", 
                    status: status || "enable"
                }),
                accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });

            newUser.accessToken = accessToken;
            // await newUser.save();
            // res.json({
            //     success: true,
            //     data: newUser,
            //     message: "You have signed up successfully"
            // });

            await newUser.save(function(err) {

                if (err) { return res.status(500).send({ msg: err.message }); }

                // Create a verification token for this user
                var token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });
                    
                console.log('Email verification token: ' + token);
                
                // Save the verification token
                token.save(function(err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
        
                    // Send the email
                    var transporter = nodemailer.createTransport({
                        // service: 'Sendgrid',
                        // auth: {
                        //     user: process.env.SENDGRID_USERNAME, 
                        //     pass: process.env.SENDGRID_PASSWORD 
                        // }
                        service: "Gmail",
                        host: 'smtp.gmail.com',
                        // port: 587,
                        port: 465,
                        secure: true,
                        // requireTLS: true,
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });

                    var mailOptions = {
                        from: 'no-reply@email.com', 
                        to: newUser.email, 
                        subject: 'Account Verification Token', 
                        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 
                        req.headers.host + '\/confirmation\/' + token.token + '.\n' 
                    };
                    
                    // var mailOptions = {
                    //     from: 'youremail@gmail.com',
                    //     to: 'iabdurraziq@gmail.com',
                    //     subject: 'Sending Email using Node.js',
                    //     text: 'That was easy!'
                    //   };

                    transporter.sendMail(mailOptions, function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        res.status(200).send('A verification email has been sent to ' + newUser.email + '.');
                    });

                    res.json({
                        success: true,
                        data: newUser,
                        message: "You have signed up successfully. We have just sent you an email, please check your email"
                    });

                });

        });

        }
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body,
            user = await User.findOne({email});

        if (!user) return next(res.json({success: false, error: 'Email does not exist'}));
        const validPassword = await validatePassword(password, user.password);

        if (!validPassword) return next(res.json({success: false, error: 'Password is not correct'}))
        const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Make sure the user has been verified
        if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' }); 

        await User.findByIdAndUpdate(user._id, {accessToken})
        res.status(200).json({
            success: true,
            data: {accessToken,user},
            // user: user,
            message: "Access token get successfully."

        })
    } catch (error) {
        next(error);
    }
}

/**
* POST /confirmation
*/
exports.confirmationPost = async (req, res, next) => {

    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('email', 'Email cannot be blank').notEmpty();
    // req.assert('token', 'Token cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors    
    // var errors = req.validationErrors();
    // if (errors) return res.status(400).send(errors);
    
    // Find a matching token
    let { token } = req.body;
    token = await Token.findOne({ token });
    console.log("token:: " + token);

    // Token.findOne({ token: req.body.token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            console.log("token=:: " + user);
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    // });
};

/**
* POST /resend
*/
exports.resendTokenPost = async (req, res, next) => {
    // req.assert('email', 'Email is not valid').isEmail();
    // req.assert('email', 'Email cannot be blank').notEmpty();
    // req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation errors    
    // var errors = req.validationErrors();
    // if (errors) return res.status(400).send(errors);

    const { email } = req.body,
    user = await User.findOne({ email });

    // await User.find({ email: req.body.email }, function (err, user) {
        // if (err) { return res.status(500).send({ msg: err.message }); }
        if (!user) { return res.status(400).send({ msg: 'We were unable to find a user with that email.' + req.body.email }); }
        if (user.isVerified) { return res.status(400).send({ msg: 'This account has already been verified. Please log in.' }); }

        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        
        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({
                service: "Gmail",
                host: 'smtp.gmail.com',
                // port: 587,
                port: 465,
                secure: true,
                // requireTLS: true,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            
            var mailOptions = {
                from: 'no-reply@email.com', 
                to: user.email, 
                subject: 'Account Verification Token', 
                text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 
                req.headers.host + '\/confirmation\/' + token.token + '.\n'
            };

            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + newUser.email + '.');
            });

            res.json({
                success: true,
                message: "We have just sent you an email, please check your email"
            });

        });

    // });
};

// forgot password
exports.ValidPasswordToken = async (req, res, next) => {
    if (!req.body.resettoken) {
    return res
    .status(500)
    .json({ message: 'Token is required' });
    }
    const user = await PasswordResetToken.findOne({
    resettoken: req.body.resettoken
    });
    if (!user) {
    return res
    .status(409)
    .json({ message: 'Invalid URL' });
    }
    User.findOneAndUpdate({ _id: user._userId }).then(() => {
    res.status(200).json({ message: 'Token verified successfully.' });
    }).catch((err) => {
    return res.status(500).send({ msg: err.message });
    });
},

// forgot password
exports.NewPassword = async (req, res, next) => {
    PasswordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
        if (!userToken) {
        return res
            .status(409)
            .json({ message: 'Token has expired' });
        }

        User.findOne({
        _id: userToken._userId
        }, function (err, userEmail, next) {
        if (!userEmail) {
            return res
            .status(409)
            .json({ message: 'User does not exist' });
        }
        return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            if (err) {
            return res
                .status(400)
                .json({ message: 'Error hashing password' });
            }
            userEmail.password = hash;
            userEmail.save(function (err) {
            if (err) {
                return res
                .status(400)
                .json({ message: 'Password can not reset.' });
            } else {
                userToken.remove();
                return res
                .status(201)
                .json({ message: 'Password reset successfully' });
            }

            });
        });
        });

    })
}

exports.getUsers = async (req, res, next) => {
    console.log("kdddddddddddd")
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            data: users,
            message: "All user list."
        });
    } catch (error) {
        next(error)
    }

}

exports.updateUser = async (req, res, next) => {
    try {
        const {role, status, name, phone, gender, dob, userId} = req.body,
            updatedValues = {};

        //update the incomming input not all.
        if (name) {
            updatedValues.name = name
        }

        if (phone) {
            updatedValues.phone = phone
        }

        if (gender) {
            updatedValues.gender = gender
        }

        if (dob) {
            updatedValues.dob = dob
        }

        if (role) {
            updatedValues.role = role;
        }

        if(status) {
            updatedValues.status = status;
        }

        const result = await User.findByIdAndUpdate(userId, updatedValues);
        if (result) {

            const user = await User.findById(userId)
            res.status(200).json({
                success: true,
                data: user,
                message: "Successfully updated user."
            });
        }
        else {
            res.json({
                success: false,
                data: {},
                message: "User against this id not found."
            });
        }
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId,
            result = await User.findByIdAndDelete(userId);
        if (result) {
            res.status(200).json({
                success: true,
                data: null,
                message: 'User has been deleted'
            });
        }
        else {
            res.json({
                success: false,
                data: null,
                message: 'User not found on this id to delete.'
            });
        }

    } catch (error) {
        next(error)
    }
}