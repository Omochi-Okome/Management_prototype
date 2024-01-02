require('date-utils');
const {attendanceRegistration} = require('../models/home');
const {recordStartWork,recordEndWork,fetchName,fetchHourlyWage,calculateWage} = require('../models/work');

//ホーム画面表示
exports.getHome = (req,res) => {
    const checkResult = req.query.message;
    res.render('../views/home.ejs',{
        message:checkResult
    })
}

//従業員IDとパスワード送信
exports.postAttendance = async(req,res) => {
    const employeeID = req.body.EmployeeID;
    const employeePassword = req.body.EmployeePassword;
    const action = req.body.action;
    var currentTime = new Date();
    var formatted = currentTime.toFormat('YYYY-MM-DDTHH24:MI');
    const nowTime = formatted;
    const fetchWage = new fetchHourlyWage();

    try {
        const employeeHourlyWage = await fetchWage.fetchHourlyWage(employeeID);
        const employeeName = await new fetchName().fectchName(employeeID);
        
        let result;
        let recordTime;

        if(action === 'startWork') {
            const attendance = new attendanceRegistration(employeeID,employeePassword);
            recordTime = new recordStartWork(nowTime,employeeName,employeeID,employeeHourlyWage);
            result = await attendance.checkIDPassword();
            console.log('どうなっとるんや'+result);
        
            if(result) {
               const checkResult = await recordTime.writeStartTime();
               res.redirect(`/?message=${checkResult}`);
            } else {
                res.redirect(`/?message=IDかパスワードが誤っています`);
            }
        }
        else if(action == 'break') {
            res.redirect(`/?message=工事中です`);
        }

        else if(action === 'endWork') {
            const attendance = new attendanceRegistration(employeeID,employeePassword)
            const recordTime = new recordEndWork(employeeID,nowTime);
            const calculateTodayWage = new calculateWage();
            const result = await attendance.checkIDPassword();
            if(result) {
                const checkResult = await recordTime.writeEndTime();
                res.redirect(`/?message=${checkResult}`);
                await calculateTodayWage.calculateTodayWage(employeeID);   
            } else {
                res.redirect(`/?message=IDかパスワードが誤っています`);
            }
        }

    } catch(err) {
        console.log(err);
        res.redirect('/');
    }
}