const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/home', publicController.homeData);
router.get('/websites/:id', publicController.publicDetail);

module.exports = router;
