const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/controllers");

router.post("/create-customer", paymentController.createCustomer);
router.post(
  "/validate-customer/:customer_code/identification",
  paymentController.validateCustomer
);

module.exports = router;
