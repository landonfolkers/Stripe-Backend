require("dotenv").load();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
let stripe = require('stripe')(process.env.STRIPE_KEY)

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/charge', (req, res) => {
    const options = {
      amount: +req.body.amount,
      currency: "usd",
      description: req.body.description,
      source: req.body.token,
  };
  stripe.charges.create(options, (error, charge) => {
      error
          ? res.status(400).json({error: error.message})
          : res.json({data: charge});
  })
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
