const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.get('/',homeController.getHome);

router.post('/input',homeController.postAttendance);

module.exports = router;