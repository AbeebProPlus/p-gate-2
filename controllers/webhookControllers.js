require("dotenv").config();
const crypto = require('crypto');

exports.handleWebhookEvent = (req, res) => {
    try {
        const isValidSignature = validateSignature(req);
        if (!isValidSignature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }
        const event = req.body;
        console.log('Received Paystack webhook event:', event.event);
        switch (event.event) {
            case 'customeridentification.failed':
                handleCustomerIdentificationFailed(event.data);
                break;
            case 'customeridentification.success':
                handleCustomerIdentificationSuccess(event.data);
                break;
            default:
                console.log('Unhandled Paystack webhook event:', event.event);
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error handling Paystack webhook event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

function validateSignature(req) {
    const secretKey = process.env.SECRET_KEY;
    const signatureHeader = req.headers['x-paystack-signature'];
    const requestBody = JSON.stringify(req.body);
    const computedSignature = crypto.createHmac('sha512', secretKey).update(requestBody).digest('hex');
    return computedSignature === signatureHeader;
}

function handleCustomerIdentificationFailed(data) {
    console.log('Customer identification failed for:', data.customer_code);
}

function handleCustomerIdentificationSuccess(data) {
    console.log('Customer identification successful for:', data.customer_code);
}
