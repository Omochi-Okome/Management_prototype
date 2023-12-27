const {CommonDBOperation,attendanceRegistration} = require('../models/home');

exports.getHome = (req,res) => {
    res.render('../views/home.ejs')
}

exports.postAttendance = (req,res) => {
    const EmployeeID = req.body.EmployeeID;
    const EmployeePassword = req.body.EmployeePassword;
    const collectionName = 'EmployeeData';
    const attendance = new attendanceRegistration(collectionName,EmployeeID,EmployeePassword);
    attendance.record();
    res.redirect('/');
}