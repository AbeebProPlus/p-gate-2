require("dotenv").config();
const crypto = require('crypto');
const mailService = require("../services/mailService");

exports.handleWebhookEvent = (req, res) => {
    try {
        const isValidSignature = validateSignature(req);
        if (!isValidSignature) {
            return res.status(400).json({ error: 'Invalid signature' });
        }
        const event = req.body;
        switch (event.event) {
            case 'charge.success':
                handleChargeSuccess(event.data);
                break;
            case 'customeridentification.failed':
                handleCustomerIdentificationFailed(event.data);
                break;
            case 'customeridentification.success':
                handleCustomerIdentificationSuccess(event.data);
                break;
            case 'dedicatedaccount.assign.failed':
                handleDedicatedAccountAssignFailed(event.data);
                break;
            case 'dedicatedaccount.assign.success':
                handleDedicatedAccountAssignSuccess(event.data);
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
    console.log(data)
    console.log('Customer identification failed for:', data.customer_code);
}

function handleCustomerIdentificationSuccess(data) {
    console.log("Identification sucess", data)
    console.log('Customer identification successful for:', data.customer_code);
}

function handleDedicatedAccountAssignFailed(data) {
    console.log(data)
    console.log('Dedicated account assignment failed!');
}

async function handleDedicatedAccountAssignSuccess(data) {
    console.log("Assignment success",data)
    console.log("Extracted details")
    console.log({
        "name": data.customer.first_name + " " + data.customer.last_name,
        "email": data.customer.email,
        "phone": data.customer.phone,
        "customercode": data.customer.customer_code,
        "bank": data.dedicated_account.bank.name,
        "accountName": data.dedicated_account.account_name,
        "accountNumber": data.dedicated_account.account_number,
        "active": data.dedicated_account.active,
        "createdAt": data.dedicated_account.created_at,
        "accountType": data.dedicated_account.assignment.account_type,
        "assignedAt": data.dedicated_account.assignment.assigned_at
    })
    try {
        await mailService.sendMail(data.customer.email, 'Dedicated Account Creation',
            'Dear ' + data.customer.first_name + '\nYour dedicated account has been created successfully. Here are the details:\n' +
            'Account Name: ' + data.dedicated_account.account_name + '\n' +
            'Account Number: ' + data.dedicated_account.account_number + '\n' +
            'Bank: ' + data.dedicated_account.bank.name + '\n' +
            'Account Type: ' + data.dedicated_account.assignment.account_type + '\n' +
            'Please make your payments to us using this account. Thank you!'
        );
        console.log('Email sent successfully to:', data.customer.email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

function handleChargeSuccess(data) {
    console.log(data)
    console.log('Charge successful for:', data.reference);
}