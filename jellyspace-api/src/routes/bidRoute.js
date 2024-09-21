const express = require('express');
const router = express.Router();
const Bid = require('../models/bid'); // Import Bid model
const User = require('../models/user'); // Import User model
const { emailSending } = require('../common/common');
const sequelize = require('../config/database'); // Import your sequelize instance

// Get bids by user email
router.post('/getbids', async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: {
        userEmail: req.body.userEmail
      }
    });
    if (bids.length > 0) {
      return res.json({
        status: true,
        message: 'Bids List',
        data: bids
      });
    } else {
      return res.json({
        status: false,
        message: 'Data not available',
        data: []
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Error fetching bids',
      data: []
    });
  }
});

// Get bids by project email
router.post('/getProjectBids', async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: {
        projectEmail: req.body.projectEmail
      }
    });
    if (bids.length > 0) {
      return res.json({
        status: true,
        message: 'Bids List By project',
        data: bids
      });
    } else {
      return res.json({
        status: false,
        message: 'Data not available',
        data: []
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Error fetching project bids',
      data: []
    });
  }
});

// Accept or reject a bid
router.post('/acceptBid', async (req, res) => {
  try {
    const bidId = req.body.id;
    const [updated] = await Bid.update(
      { status: req.body.status },
      { where: { id: bidId } }
    );

    if (updated) {
      const bidExist = await Bid.findOne({ where: { id: bidId } });
      const user = await User.findOne({ where: { email: bidExist.userEmail } });

      const htmlBodyAcceptedBid = '<!DOCTYPE html> ...'; // Use your existing HTML templates
      const htmlBodyRejectedBid = '<!DOCTYPE html> ...';

      const htmlbody = bidExist.status === 'accepted' ? htmlBodyAcceptedBid : htmlBodyRejectedBid;
      emailSending(bidExist.userEmail, 'Bid ' + bidExist.status, htmlbody);

      return res.json({
        status: true,
        message: 'Bid was ' + req.body.status,
        data: bidExist
      });
    } else {
      return res.json({
        status: false,
        message: 'Bid not found',
        data: []
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Status update failed',
      data: []
    });
  }
});

// Post a new bid with transaction handling
router.post('/postBid', async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a transaction

  try {
    const user = await User.findOne({ where: { email: req.body.userEmail }, transaction }); // Include transaction
    const projectUser = await User.findOne({ where: { email: req.body.projectEmail }, transaction }); // Include transaction

    if (!user || !projectUser) {
      throw new Error('User or Project User not found');
    }

    const newBid = await Bid.create(
      {
        projectId: req.body.projectId,
        projectName: req.body.projectName,
        projectEmail: req.body.projectEmail,
        bidAmount: req.body.bidAmount,
        status: req.body.status,
        rupeesId: req.body.rupeesId,
        bidDescription: req.body.bidDescription,
        userEmail: req.body.userEmail,
      },
      { transaction } // Pass the transaction object here
    );

    // Commit the transaction after successful creation
    await transaction.commit();

    const htmlBodyPostedBid = '<!DOCTYPE html> ...'; // Use your existing HTML templates
    const htmlBodyForProjectedBid = '<!DOCTYPE html> ...';

    emailSending(newBid.userEmail, 'Project Bid', htmlBodyPostedBid);
    emailSending(newBid.projectEmail, 'Project Bid', htmlBodyForProjectedBid);

    return res.json({
      status: true,
      message: 'Successfully posted project bidding',
      data: newBid
    });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction on error

    console.error('Error:', error);
    return res.json({
      status: false,
      message: 'Project bidding failed',
      errorMessage : error.message || "An error occurred",
      data : []
    });
  }
});

module.exports = router;