const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/', publicController.home);
router.get('/website/:id', publicController.detail);

module.exports = router;
