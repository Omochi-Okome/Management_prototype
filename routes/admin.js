const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/admin',adminController.getLoginScreen);

router.post('/adminLogin',adminController.postLogin);

module.exports = router;