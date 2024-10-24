'use strict';
const passport = require('./passport');
const models = require('../../models');
let controller = {};
controller.login = async (req, res, next) => {
    const keepSignedIn = req.body.keepSignedIn || false;
    passport.authenticate('local-login', (error, user) => {
        if (error) {
            return next(error)
        }
        if (!user) {
            return res.send({success: false, message: 'User not exist'});
        }
        req.logIn(user, (e) => {
            if (e) return next(e)
            req.session.cookie.maxAge = keepSignedIn ? (24 * 60 * 60 * 1000) : null;
            return res.send({success: true, message: 'Login sucessfully'});
        })
    })(req, res, next);

};

controller.logout = (req, res, next) => {
    req.logout((error) => {
        if (error) return next(error);
        return res.send({success: true, message: 'Logout sucessfully'});

    })
}

controller.register = (req, res, next) => {
    passport.authenticate('local-register', (error, user) => {
        if (error) {
            return next(error)
        }
        if (!user) {
            return res.send({success: false, message: 'Cant register'});
        }
        req.logIn(user, (e) => {
            if (e) return next(e)
            return res.send({success: true, message: 'Register successfully'});
        })
    })(req, res, next);

}
controller.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({success: false, message: 'Need login first'});

}

controller.forgotPassword = async (req, res) => {
    let email = req.body?.email || '';
    let user = await models.User.findOne({where: {email}});
    if (user) {
        const {sign} = require('./jwt');
        const host = req.header('host');
        const resetLink = `${req.protocol}://${host}/users/reset?token=${sign(email)}&email=${email}`;
        const {sendForgotPasswordMail} = require('./mail');
        sendForgotPasswordMail(user, host, resetLink).then(rs => {
            return res.send({message: "Send message successfully", success: true});
        }).catch(err => {
            return res.send({
                message: "An error has occured when sending to your email.Please check your email address!",
                success: false
            })
        });

    } else {
        return res.send({message: "Email not exist", success: false})

    }

}
controller.resetPassword = async (req, res) => {
    let email = req.body.email;
    let bcrypt = require('bcrypt');
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSalt(8));
    await models.User.update({password}, {where: {email}});
    return res.send({message: "Reset password successfully", success: true})
}
module.exports = controller;
