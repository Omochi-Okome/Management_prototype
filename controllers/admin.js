const {administrator} = require('../models/admin');
const {attendanceRegistration} = require('../models/home');
const {getWorkRecord} = require('../models/work');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

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

//続き、給料計算
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
        const employeeNames = result.map(employee => employee.employeeName);
        const employeeIDs = result.map(employee => employee.employeeID);
        const startTimes = result.map(employee => employee.startTime);
        const endTimes = result.map(employee => employee.endTime);
        const todayWages = result.map(employee => employee.todayWage);
        const formattedStartTimes = result.map(employee => dayjs(employee.startTime).format("YYYY年MM月DD日HH時mm分ss秒"));
        const formattedEndTimes = result.map(employee => dayjs(employee.endTime).format("YYYY年MM月DD日HH時mm分ss秒"));
        res.render('../views/admin/workRecord',{
            employeeName:employeeNames,
            employeeID:employeeIDs,
            startTime:startTimes,
            endTime:endTimes,
            formattedStartTime:formattedStartTimes,
            formattedEndTime:formattedEndTimes,
            todayWage:todayWages,

        })
    })
    .catch(err => {
        console.log(err)
    })
}