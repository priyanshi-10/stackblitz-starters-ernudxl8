const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json()); // For parsing JSON bodies in POST requests

// Initial Cart Data
let cart = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 }
];

// Endpoint 1 to add an item to the cart
app.get('/cart/add', (req, res) => {
  const { productId, name, price, quantity } = req.query;

  if (!productId || !name || !price || !quantity) {
    return res.status(400).send({ error: 'All parameters are required: productId, name, price, quantity.' });
  }
// Check if the product already exists in the cart
  const existingProduct = cart.find(item => item.productId === parseInt(productId));

  if (existingProduct) {
    existingProduct.quantity += parseInt(quantity);
  } else {
    cart.push({
      productId: parseInt(productId),
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity)
    });
  }

  // Send the updated cart as the response
  res.status(200).send({ cartItems: cart });
});


// Endpoint 2 to edit the quantity of an item in the cart
app.get('/cart/edit', (req, res) => {
  const { productId, quantity } = req.query;

  
  if (!productId || !quantity) {
    return res.status(400).send({ error: 'Both productId and quantity are required.' });
  }

  const product = cart.find(item => item.productId === parseInt(productId));

  if (!product) {
    return res.status(404).send({ error: 'Product not found in the cart.' });
  }

  // Update the product quantity
  product.quantity = parseInt(quantity);
  res.status(200).send({ cartItems: cart });
});

// Endpoint 3 to delete an item from the cart
app.get('/cart/delete', (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).send({ error: 'Product ID is required.' });
  }
  const productExists = cart.some(item => item.productId === parseInt(productId));

  if (!productExists) {
    return res.status(404).send({ error: 'Product not found in the cart.' });
  }
  cart = cart.filter(item => item.productId !== parseInt(productId));
// Send the updated cart as the response
  res.status(200).send({ cartItems: cart });
});

//Endpoint 4
app.get('/cart', (req, res) => {
  res.status(200).send({ cartItems: cart });
});

//Endpoint 5
app.get('/cart/total-quantity', (req, res) => {
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  res.status(200).send({ totalQuantity });
});

//Endpoint 6
app.get('/cart/total-price', (req, res) => {
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  res.status(200).send({ totalPrice });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
