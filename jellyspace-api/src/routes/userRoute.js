const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { sequelize } = require('../config/database'); // Adjust path as needed

// User Registration
router.post("/register", async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const existingUser = await User.findAll({ where: { email: req.body.email }, transaction });

    // Check if user already exists
    if (existingUser.length > 0) {
      return res.json({
        status: false,
        message: 'User already registered',
        data: ''
      });
    }

    // Create new user
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Make sure this is hashed before saving
      accountType: req.body.accountType,
      entityName: req.body.entityName,
      dateOfInCorporation: req.body.dateOfInCorporation,
      title: req.body.title,
      mobileNo: req.body.mobileNo,
      skills: req.body.skills,  // Make sure the model accepts an array
      image: req.body.image,
      street: req.body.street,
      h_number: req.body.h_number,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country
    }, { transaction }); // Include transaction

    await transaction.commit(); // Commit the transaction

    return res.json({
      status: true,
      message: 'Successfully registered',
      data: newUser
    });
  } catch (error) {
    console.error(error);
    
    await transaction.rollback(); // Rollback the transaction on error

    return res.json({
      status: false,
      message: 'Registration failed',
      data: ''
    });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    // Find user by email and password (consider using hashed passwords)
    const user = await User.findOne({ 
      where: { email: req.body.email, password: req.body.password } 
    });

    if (user) {
      return res.json({
        status: true,
        message: 'User logged in successfully',
        data: user
      });
    } else {
      return res.json({
        status: false,
        message: 'Login failed',
        data: ''
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: 'Login failed',
      data: ''
    });
  }
});

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({
      status: true,
      message: 'Users list',
      data: users
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: 'Failed to fetch users',
      data: ''
    });
  }
});

// Delete User
router.post("/deleteUser", async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const user = await User.findOne({ where: { email: req.body.email }, transaction }); // Include transaction

    if (user) {
      await User.destroy({ where: { id: user.id }, transaction }); // Include transaction in delete operation
      await transaction.commit(); // Commit the transaction

      return res.json({
        status: true,
        message: 'User deleted successfully',
        data: ''
      });
    } else {
      return res.json({
        status: false,
        message: 'User not found',
        data: ''
      });
    }
  } catch (error) {
    console.error(error);
    
    await transaction.rollback(); // Rollback the transaction on error

    return res.json({
      status: false,
      message: 'Failed to delete user',
      data: ''
    });
  }
});

module.exports = router;