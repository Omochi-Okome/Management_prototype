const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/admin',adminController.getLoginScreen);

router.post('/adminLogin',adminController.postLogin);

router.get('/admin/home',adminController.getHome);

router.get('/admin/employeeInformation',adminController.getEmployeeInformation);

router.get('/admin/workRecord',adminController.getWorkRecord);

module.exports = router;