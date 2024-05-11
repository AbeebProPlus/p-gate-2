require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/routes");
const paystackWebhookRoute = require('./routes/webhookroutes');

const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(paystackWebhookRoute);
app.use(router);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
