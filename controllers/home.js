const {attendanceRegistration} = require('../models/home');

exports.getHome = (req,res) => {
    res.render('../views/home.ejs')
}

exports.postAttendance = (req,res) => {
    const employeeID = req.body.EmployeeID;
    const employeePassword = req.body.EmployeePassword;
    const collectionName = 'EmployeeData';
    const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword);
    attendance.record();
    res.redirect('/');
}