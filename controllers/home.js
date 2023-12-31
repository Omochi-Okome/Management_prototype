require('date-utils');
const {attendanceRegistration} = require('../models/home');
const {recordStartWork,recordEndWork,fetchName,fetchHourlyWage,calculateWage} = require('../models/work');

//ホーム画面表示
exports.getHome = (req,res) => {
    res.render('../views/home.ejs')
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
            const attendance = new attendanceRegistration(employeeID,employeePassword)
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
            const attendance = new attendanceRegistration(employeeID,employeePassword)
            const recordTime = new recordEndWork(employeeID,nowTime);
            const calculateTodayWage = new calculateWage();
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