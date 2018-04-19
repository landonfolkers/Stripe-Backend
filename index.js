require("dotenv").load();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
let stripe = require('stripe')('sk_test_FnkbAQtTmcE2zGCCjBCKRP2S')

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/charge', (req, res) => {
  let token = req.body.stripeToken
  let charge = stripe.charges.create({
    amount: req.body.amount * 100,
    currency: 'usd',
    description: 'galvanize payment',
    source: token
  }, (err, charge) => {
    if (err) {
      res.send(err)
    } else {
      res.send({amount: charge.amount / 100})
    };
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World! 🌈'
  });
});

app.use((req, res, next) => {
  res.status(404);
  const error = new Error('Not Found. 🔍');
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
    error: error.stack
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
