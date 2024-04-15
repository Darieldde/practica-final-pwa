var express = require('express');
var router = express.Router();
const Product = require('../models/products');

var fs = require('fs');

var Cart = require('../models/cart');

router.get('/add/:id', async function(req, res, next) {
  try {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = await Product.findById(productId).exec();
    if (!product) {
      return res.redirect('/');
    }
    cart.add(product, productId);
    req.session.cart = cart;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'Carrito de compras',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find({}).lean();
    let productsChunks = [];
    let chunkSize = 4;
    for (let i = 0; i < products.length; i += chunkSize) {
      productsChunks.push(products.slice(i, i + chunkSize));
    }
    res.render('index', {
      products: productsChunks
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos de la base de datos');
  }
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/');
});

module.exports = router;
