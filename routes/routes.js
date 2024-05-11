const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/controllers");

router.post("/create-customer", paymentController.createCustomer);
router.post(
  "/validate-customer/:customer_code/identification",
  paymentController.validateCustomer
);
router.post("/dedicated-account/assign", paymentController.createVirtualAccount);

module.exports = router;
