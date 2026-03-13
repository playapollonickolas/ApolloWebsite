const stripe = require('stripe')('your-secret-key');

app.post('/create-payment-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000, // price in cents
    currency: 'brl',
    automatic_payment_methods: { enabled: true }, // enables cards + PIX
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});


