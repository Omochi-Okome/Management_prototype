require('date-utils');
const {attendanceRegistration} = require('../models/home');
const {recordEmployeeWork} = require('../models/work');

exports.getHome = (req,res) => {
    res.render('../views/home.ejs')
}

exports.postAttendance = (req,res) => {
    const employeeID = req.body.EmployeeID;
    const employeePassword = req.body.EmployeePassword;
    const action = req.body.action;
    const collectionName = 'EmployeeData';
    var currentTime = new Date();
    var formatted = currentTime.toFormat("YYYY年MM月DD日HH24時MI分SS秒");
    if (action === "startWork") {
        const startTime = formatted;
        const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword);
        const recordTime = new recordEmployeeWork(startTime,employeeID);
        recordTime.writeStartTime();
        attendance.record();
    } else if (action === "break") {
        console.log("工事中")
    } else if (action === "endWork") {
        console.log("工事中");
    }
    res.redirect('/');    
}