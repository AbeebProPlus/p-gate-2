const express = require('express');
const router = express.Router();
const paystackWebhookController = require('../controllers/webhookControllers');

// Handle incoming Paystack webhook events
router.post('/webhook/paystack', paystackWebhookController.handleWebhookEvent);

module.exports = router;
