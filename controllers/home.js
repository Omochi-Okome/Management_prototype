require('date-utils');
const {attendanceRegistration} = require('../models/home');
const {recordStartWork,recordEndWork} = require('../models/work');

exports.getHome = (req,res) => {
    res.render('../views/home.ejs')
}

exports.postAttendance = (req,res) => {
    const employeeID = req.body.EmployeeID;
    const employeePassword = req.body.EmployeePassword;
    const action = req.body.action;
    const collectionName = 'EmployeeData';
    var currentTime = new Date();
    var formatted = currentTime.toFormat("YYYY-MM-DDTHH24:MI:SS");
    const nowTime = formatted;
    if (action === "startWork") {
        const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword)
        const recordTime = new recordStartWork(nowTime,employeeID);
        attendance.checkIDPassword()
        .then(result => {
            if(result) {
               recordTime.writeStartTime(); 
            }
        })
        .catch(err =>{
            res.redirect('/');
        });
        
    } else if (action === "break") {
        console.log("工事中")
    } else if (action === "endWork") {
        const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword)
        const recordTime = new recordEndWork(employeeID,nowTime);
        attendance.checkIDPassword()
        .then(result => {
            if(result) {
               recordTime.writeEndTime(); 
            }
        })
        .catch(err =>{
            res.redirect('/');
        });
    }
    res.redirect('/');    
}