const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/admin',adminController.getLoginScreen);

router.post('/adminLogin',adminController.postLogin);

router.get('/admin/home',adminController.getHome);

router.get('/admin/employeeInformation',adminController.getEmployeeInformation);

router.get('/admin/workRecord',adminController.getWorkRecord);

router.get('/admin/workRecordEdit',adminController.getWorkRecordEdit);

router.post('/admin/workRecordEdit/post',adminController.postWorkRecordEdit);

router.post('/admin/postPayrollReserch',adminController.postPayrollReserch);

router.get('/admin/WorkRecord/search',adminController.getWorkRecordSearch);

module.exports = router;