const {administrator} = require('../models/admin');
const {attendanceRegistration} = require('../models/home');
const {getWorkRecord} = require('../models/work');

//以下ログイン前
exports.getLoginScreen = (req,res) => {
    res.render('../views/admin/admin.ejs');
}

exports.postLogin = (req,res) => {
    const administratorID = req.body.adminID;
    const administratorPassword = req.body.adminPassword;
    const collectionName = 'administratorData';
    const attendance = new administrator(collectionName,administratorID,administratorPassword);
    attendance.record()
    .then(loginResult => {
        if(loginResult) {
            res.redirect('/admin/home');
        } else {
            res.redirect('/admin');
        }
    })
    .catch(err => {
        console.log(err);
        res.redirect('/admin');
    })
}

//以下ログイン後
exports.getHome = (req,res) => {
    res.render('../views/admin/admin_home.ejs');
}

exports.getEmployeeInformation = (req,res) => {
    const collectionName = 'EmployeeData';
    const attendance = new attendanceRegistration(collectionName);
    attendance.fetchAll()
    .then(result => {
        const employeeNames = result.map(employee => employee.employeeName);
        const employeeIDs = result.map(employee => employee.employeeID);
        const employeePasswords = result.map(employee => employee.employeePassword);
        const employeeHourlyWages = result.map(employee => employee.employeeHourlyWage);
        res.render('../views/admin/employeeInformation',{
        employeeName:employeeNames,
        employeeID:employeeIDs,
        employeePassword:employeePasswords,
        employeeHourlyWage:employeeHourlyWages,
    }
    )})
    .catch(err => {
        console.log(err);
    })
}

exports.getWorkRecord = (req,res) => {
    const collectionName = "workTimeRecord";
    const workRecord = new getWorkRecord(collectionName);
    workRecord.getWorkRecord()
    .then(result => {
        const employeeIDs = result.map(employee => employee.employeeID);
        const startTimes = result.map(employee => employee.startTime);
        const endTimes = result.map(employee => employee.endTime);
        res.render('../views/admin/workRecord',{
            employeeID:employeeIDs,
            startTime:startTimes,
            endTime:endTimes
        })
    })
    .catch(err => {
        console.log(err)
    })
}