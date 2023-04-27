const models = require('../models');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = models.User;
require('dotenv').config();





var transpoter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.User_email,
        pass: process.env.User_password
    },
    tls: {
        rejectUnauthorized: false
    }

});




// USer register...
exports.postregister = async (req, res, next) => {
    try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
       

        // if (!email && !password) {
        //     res.status(500).json({ message: "enter the  proper details" });
        //     return;
        // }
        const data = await User.findOne({ where: { email: email } });
        if (data) {
            res.status(500).json({ message: "email already exsit" });
            return;
        }
        const hashpass = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashpass
        });
        const payload = {
            id: user.id,
            email: user.email

        }
        const token = jwt.sign(payload, process.env.secretkey, { expiresIn: '12h' });
        res.status(200).json({ status: 'sucess', message: 'register successfully...', data: user, token: token });
    } catch (error) {
        console.log(error);
    }


    


}

// User  login ....
exports.postlogin = async (req, res, next) => {



    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const ismatch = await bcrypt.compare(password, user.password);


            if (ismatch) {
                const payload = {
                    id: user.id,
                    email: user.email

                }
                const token = jwt.sign(payload, process.env.secretkey, { expiresIn: '12h' });
                res.status(200).json({ status: 'sucess', message: 'login successfully...', data: user, token: token });

            }
            else {
                res.send("invalid  credentials");
            }
        } else {
            res.send("invalid credentials");
        }
    } catch (error) {
        console.log(error);
    }
};

//    forgot password.....

exports.forgotpass = async (req, res, next) => {
  
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            res.status(500).json({ message: "invalid credentials" });
            return;
        }
        const payload = {
            id: user.id,
            email: user.email
        }

        const token = jwt.sign(payload, process.env.secretkey, { expiresIn: "12h" });
        var mailOptions = {
            from: ' s12348946@gmail.com',
            to: email,
            subject: 'reset link',
            html: '<p>Click <a href="http://localhost:3000/reset/' + token + '">here</a> to reset your password</p>'
        }
        const link = `http://localhost:3000/reset/${token}`;
        console.log(link);
        transpoter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }

        })


        res.status(201).json({ success: 'ok', msg: 'we have sent instructions to reset password over your registered email' });


    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error });

    }



}



// reset password.....


exports.getreset = async (req, res, next) => {
    // const token=req.headers['authorization'];
  
    try {

        const token = req.params.token;
        const verifyuser = jwt.verify(token, process.env.secretkey);
        const { id } = verifyuser;
        const user = await User.findOne({ whrer: { id: id } });
        if (!user) {
            res.status(500).json({ message: "invalid user" });
            return;
        }


        res.render('reset', { token });


    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }



}


// create password...

exports.postreset = async (req, res, next) => {
  
    try {
         
        console.log('---value---', req.body);
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        const token = req.body.token;
        console.log(req.body);
        const userverify = jwt.verify(token, process.env.secretkey);
        const { id } = userverify;

        

        const user = await User.findOne({ where: { id: id } });
        if (!user) {
            res.status(500).json({ message: "invalid credentials" });
            return;
        }
        if (password === cpassword) {
            const hashpass = await bcrypt.hash(password, 12);
            const updateuser = await User.update({ password: hashpass }, { where: { id: id } });
            res.status(200).json({ sucess: "ok", message: "update sucessfully..." });
        }
        else{
            res.status(400).send("Password doesnot match.....Enter the valid password");
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }


}
    


