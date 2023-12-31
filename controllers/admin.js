const {administrator} = require('../models/admin');
const {attendanceRegistration} = require('../models/home');
const {getWorkRecord,reCalculateWage} = require('../models/work');
const {insertEditedRecord} = require('../models/edit');
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
    attendance.inspectDB()
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
        const formattedStartTimes = result.map(employee => dayjs(employee.startTime).format("YYYY年MM月DD日HH時mm分"));
        const formattedEndTimes = result.map(employee => dayjs(employee.endTime).format("YYYY年MM月DD日HH時mm分"));
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

exports.getWorkRecordEdit = (req,res) => {
    const collectionName = "workTimeRecord";
    const workRecord = new getWorkRecord(collectionName);
    workRecord.getWorkRecord()
    .then(result => {
        const _id = result.map(employee => employee._id);
        const employeeNames = result.map(employee => employee.employeeName);
        const employeeIDs = result.map(employee => employee.employeeID);
        const startTimes = result.map(employee => employee.startTime);
        const endTimes = result.map(employee => employee.endTime);
        const todayWages = result.map(employee => employee.todayWage);
        const formattedStartTimes = result.map(employee => dayjs(employee.startTime).format("YYYY年MM月DD日HH時mm分"));
        const formattedEndTimes = result.map(employee => dayjs(employee.endTime).format("YYYY年MM月DD日HH時mm分"));
        res.render('../views/admin/workRecordEdit',{
            _id:_id,
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

exports.postWorkRecordEdit = async(req,res) => {
    const _id = req.body._id;
    const formattedStartTime = req.body.formattedStartTime;
    const formattedEndTime = req.body.formattedEndTime;
    try{
        for (let i = 0; _id && i <= _id.length - 1; i++) {
            console.log("姿を見せなさい"+_id.length)
            if(formattedEndTime[i] === ''){
                formattedEndTime[i] = null;
            }
            const insertDate = new insertEditedRecord(_id[i],formattedStartTime[i],formattedEndTime[i]);
            await insertDate.editedRecord();
            const calculateTodayWage = new reCalculateWage('workTimeRecord');
            await calculateTodayWage.recalculateTodayWage(_id[i]);
        }
    } catch(err) {
        console.log(err);
    }
    res.redirect('/admin/workRecord');
}