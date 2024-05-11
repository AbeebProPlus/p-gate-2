const express = require('express');
const router = express.Router();
const paystackWebhookController = require('../controllers/webhookControllers');

router.post('/webhook/paystack', paystackWebhookController.handleWebhookEvent);

module.exports = router;
