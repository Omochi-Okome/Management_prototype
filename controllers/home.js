require('date-utils');
const {attendanceRegistration} = require('../models/home');
const {recordStartWork,recordEndWork,fetchName,fetchHourlyWage,calculateWage} = require('../models/work');

exports.getHome = (req,res) => {
    res.render('../views/home.ejs')
}

exports.postAttendance = async(req,res) => {
    const employeeID = req.body.EmployeeID;
    const employeePassword = req.body.EmployeePassword;
    const action = req.body.action;
    const collectionName = 'EmployeeData';
    var currentTime = new Date();
    var formatted = currentTime.toFormat("YYYY-MM-DDTHH24:MI");
    const nowTime = formatted;
    const fetchWage = new fetchHourlyWage(collectionName);

    try {
        const employeeHourlyWage = await fetchWage.fetchHourlyWage(employeeID);
        const employeeName = await new fetchName(collectionName).fectchName(employeeID);
        
        let result;
        let recordTime;
        if(action === 'startWork') {
            const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword)
            recordTime = new recordStartWork(nowTime,employeeName,employeeID,employeeHourlyWage);
            result = await attendance.checkIDPassword();
        }
            if(result) {
                await recordTime.writeStartTime(); 
            }
        else if(action == 'break') {
            console.log('工事中');
        }
        else if(action === 'endWork') {
            const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword)
            const recordTime = new recordEndWork(employeeID,nowTime);
            const calculateTodayWage = new calculateWage('workTimeRecord');
            const result = await attendance.checkIDPassword();
            if(result) {
                await recordTime.writeEndTime();
                await calculateTodayWage.calculateTodayWage(employeeID);
            }
        }
        res.redirect('/');
    } catch(err) {
        console.log(err);
        res.redirect('/');
    }
}

// exports.postAttendance = (req,res) => {
//     const employeeID = req.body.EmployeeID;
//     const employeePassword = req.body.EmployeePassword;
//     const action = req.body.action;
//     const collectionName = 'EmployeeData';
//     var currentTime = new Date();
//     var formatted = currentTime.toFormat("YYYY-MM-DDTHH24:MI:SS");
//     const nowTime = formatted;
//     const fetchWage = new fetchHourlyWage(collectionName);
    

//     const fetch = new fetchName('EmployeeData');
//     fetchWage.fetchHourlyWage(employeeID)
//     .then(employeeHourlyWage => {
//         fetch.fectchName(employeeID)
//         .then(employeeName => {
//             if (action === "startWork") {
//                 const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword)
//                 const recordTime = new recordStartWork(nowTime,employeeName,employeeID,employeeHourlyWage);
//                 attendance.checkIDPassword()
//                 .then(result => {
//                 if(result) {
//                 recordTime.writeStartTime(); 
//                 }
//                 })
//                 .catch(err =>{
//                 res.redirect('/');
//                 });  
//             } else if (action === "break") {
//                 console.log("工事中")
//             } else if (action === "endWork") {
//                 const attendance = new attendanceRegistration(collectionName,employeeID,employeePassword)
//                 const recordTime = new recordEndWork(employeeID,nowTime);
//                 const calculateTodayWage = new calculateWage('workTimeRecord');
//                 attendance.checkIDPassword()
//                 .then(result => {
//                 if(result) {
//                 recordTime.writeEndTime(); 
//                 calculateTodayWage.calculateTodayWage(employeeID);
//                 }
//                 })
//                 .catch(err =>{
//                     res.redirect('/');
//                 });
//             }
//         res.redirect('/');
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     }
//     )
//     .catch(err => {
//         console.log(err);
//     })  
// }

