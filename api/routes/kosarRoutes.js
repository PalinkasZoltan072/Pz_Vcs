const express = require('express');
const router = express.Router();
const kosarController = require('../controllers/kosarController');

router.get('/:userId', kosarController.getCart);
router.post('/add', kosarController.addToCart);
router.put('/update', kosarController.updateCartItem);
router.delete('/remove', kosarController.removeCartItem);
router.delete('/clear', kosarController.clearCart);

module.exports = router;
