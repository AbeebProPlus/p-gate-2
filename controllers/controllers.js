require("dotenv").config();
const https = require("https");
const secretKey = process.env.SECRET_KEY;
const payStack = {
  createCustomer: async (req, res) => {
    try {
      const { email, firstName, lastName, phone } = req.body;
      const requestData = JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/customer",
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      };
      const paystackReq = https.request(options, (paystackRes) => {
        let data = "";
        paystackRes.on("data", (chunk) => {
          data += chunk;
        });

        paystackRes.on("end", () => {
          try {
            const responseData = JSON.parse(data);
            res.status(paystackRes.statusCode).json(responseData);
          } catch (error) {
            console.error("Error parsing Paystack API response:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
        });
      });

      paystackReq.on("error", (error) => {
        console.error("Paystack API request error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      });
      paystackReq.write(requestData);
      paystackReq.end();
    } catch (error) {
      console.error("Error handling request to Paystack API:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  validateCustomer: async (req, res) => {
    try {
      const { country, type, account_number, bvn, bank_code, first_name, last_name } = req.body;
      const requestData = JSON.stringify({
        country,
        type,
        account_number,
        bvn,
        bank_code,
        first_name,
        last_name
      });
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/customer/${req.params.customer_code}/identification`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      };
      const paystackReq = https.request(options, (paystackRes) => {
        let data = '';
        paystackRes.on('data', (chunk) => {
          data += chunk;
        });
        paystackRes.on('end', () => {
          res.status(paystackRes.statusCode).send(data);
        });
      });
      paystackReq.on('error', (error) => {
        res.status(500).json({ error: error.message })
      });

      paystackReq.write(requestData);
      paystackReq.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  createVirtualAccount: async (req, res) => {
    try {
      const { email, firstName, middleName, lastName, phone, preferredBank, country, accountNumber, bvn, bankCode } = req.body;
      const requestData = JSON.stringify({
        email,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        phone,
        preferred_bank: preferredBank,
        country,
        account_number: accountNumber,
        bvn,
        bank_code: bankCode
      });
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/dedicated_account/assign",
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      };
      const paystackReq = https.request(options, (paystackRes) => {
        let data = "";
        paystackRes.on("data", (chunk) => {
          data += chunk;
        });
  
        paystackRes.on("end", () => {
          try {
            const responseData = JSON.parse(data);
            res.status(paystackRes.statusCode).json(responseData);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });
      });
  
      paystackReq.on("error", (error) => {
        console.error("Paystack API request error:", error);
        res.status(500).json({ error: error.message });
      });
      paystackReq.write(requestData);
      paystackReq.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getCustomerByEmailOrCode: async (req, res) => {
    try {
      const { email_or_code } = req.params;

      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: `/customer/${email_or_code}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      };

      const paystackReq = https.request(options, (paystackRes) => {
        let data = "";

        paystackRes.on("data", (chunk) => {
          data += chunk;
        });

        paystackRes.on("end", () => {
          try {
            const responseData = JSON.parse(data);
            res.status(paystackRes.statusCode).json(responseData);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });
      });

      paystackReq.on("error", (error) => {
        console.error("Paystack API request error:", error);
        res.status(500).json({ error: error.message });
      });

      paystackReq.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAvailableProviders: async (req, res) => {
    try {
      const options = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/dedicated_account/available_providers",
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      };

      const paystackReq = https.request(options, (paystackRes) => {
        let data = "";

        paystackRes.on("data", (chunk) => {
          data += chunk;
        });

        paystackRes.on("end", () => {
          try {
            const responseData = JSON.parse(data);
            res.status(paystackRes.statusCode).json(responseData);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });
      });

      paystackReq.on("error", (error) => {
        console.error("Paystack API request error:", error);
        res.status(500).json({ error: error.message });
      });

      paystackReq.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

const paymentController = payStack;
module.exports = paymentController;
