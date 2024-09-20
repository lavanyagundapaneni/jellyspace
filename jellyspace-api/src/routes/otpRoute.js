const express = require("express");
const router = express.Router();
const { Auth } = require("two-step-auth");
const { emailSending } = require('../common/common');
const User = require("../models/user");
const { sequelize, DataTypes } = require('../config/database'); // Adjust path as needed
const OTPModel = require("../models/otp")(sequelize, DataTypes); // Call the function to get the model

// Move the generateOTP function here
function generateOTP() {
    try {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        return Number(OTP);
    } catch (error) {
        throw new Error('Verification Code generation failed');
    }
}

// Route for sending OTP
router.post("/sendOTP", async (req, res) => {
    try {
        const generateOtp = generateOTP();
        const divideOTP = generateOtp.toString().split('');
        divideOTP[5] = divideOTP[5] !== undefined ? divideOTP[5] : "1";

        const getOTPData = {
            status: 0,
            mail: req.body.email,
            OTP: Number(divideOTP.join('')),
            success: true
        };

        const htmlBodyForOTP = '<!DOCTYPE html> ...'; // Truncated for brevity
        emailSending(req.body.email, 'Verification Code(Expires in 60 Sec)', htmlBodyForOTP);

        const otpExist = await OTPModel.findOne({ where: { mail: req.body.email } });
        if (otpExist) {
            await OTPModel.update(getOTPData, { where: { mail: req.body.email } });
        } else {
            await OTPModel.create(getOTPData);
        }

        return res.json({
            status: true,
            message: 'Verification Code sent to your registered email',
            data: getOTPData,
        });

    } catch (err) {
        console.error('Error:', err);
        return res.json({
            status: false,
            message: 'Verification Code sending failed',
            data: ''
        });
    }
});

// Route for verifying OTP
router.post("/verifyOTP", async (req, res) => {
    try {
        // Ensure the OTP is sent in the request
        const { email, OTP } = req.body;

        // Find OTP record based on email and OTP
        const otpExist = await OTPModel.findOne({ where: { mail: email, OTP: OTP } });
        
        if (otpExist) {
            return res.json({
                status: true,
                message: 'Verification Code successfully verified',
            });
        } else {
            return res.json({
                status: false,
                message: 'Verification Code verification failed',
            });
        }
    } catch (err) {
        console.error('Error in /verifyOTP route:', err);
        return res.json({
            status: false,
            message: 'Verification failed',
        });
    }
});

module.exports = router;
