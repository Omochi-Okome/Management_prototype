const {administrator} = require('../models/admin');
const {attendanceRegistration} = require('../models/home');
const {getWorkRecord,reCalculateWage,getSpecificWorkRecord} = require('../models/work');
const {insertEditedRecord} = require('../models/edit');
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

//管理者ログイン画面
exports.getLoginScreen = (req,res) => {
    res.render('../views/admin/admin.ejs',{
        message:req.query.message
    });
}

//入力した管理者IDとパスワードを送信
exports.postLogin = async(req,res) => {
    const administratorID = req.body.adminID;
    const administratorPassword = req.body.adminPassword;
    const attendance =  new administrator(administratorID,administratorPassword);

    try{    
        const result = await attendance.inspectDB();
        if(result) {
            res.redirect('/admin/home');
        } else {
            res.redirect('/admin?message=管理者IDかパスワードが誤っています');
        }
    } catch(err) {
        console.log(err);
    }
}

//ログイン後の管理者画面
exports.getHome = (req,res) => {
    res.render('../views/admin/admin_home.ejs');
}

//従業員データの取得
exports.getEmployeeInformation = (req,res) => {
    const attendance = new attendanceRegistration();
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

//労働データの取得
exports.getWorkRecord = (req,res) => {
    const workRecord = new getWorkRecord();
    workRecord.getWorkRecord()
    .then(result => {
        const message = req.query.message;
        const employeeNames = result.map(employee => employee.employeeName);
        const employeeIDs = result.map(employee => employee.employeeID);
        const startTimes = result.map(employee => employee.startTime);
        const endTimes = result.map(employee => employee.endTime);
        const todayWages = result.map(employee => employee.todayWage);
        const formattedStartTimes = result.map(employee => dayjs(employee.startTime).format('YYYY年MM月DD日HH時mm分'));
        const formattedEndTimes = result.map(employee => dayjs(employee.endTime).format('YYYY年MM月DD日HH時mm分'));
        res.render('../views/admin/workRecord',{
            employeeName:employeeNames,
            employeeID:employeeIDs,
            startTime:startTimes,
            endTime:endTimes,
            formattedStartTime:formattedStartTimes,
            formattedEndTime:formattedEndTimes,
            todayWage:todayWages,
            message:message
        })
    })
    .catch(err => {
        console.log(err)
    })
}

//労働データの編集
exports.getWorkRecordEdit = (req,res) => {
    const workRecord = new getWorkRecord();
    workRecord.getWorkRecord()
    .then(result => {
        const _id = result.map(employee => employee._id);
        const employeeNames = result.map(employee => employee.employeeName);
        const employeeIDs = result.map(employee => employee.employeeID);
        const startTimes = result.map(employee => employee.startTime);
        const endTimes = result.map(employee => employee.endTime);
        const todayWages = result.map(employee => employee.todayWage);
        const formattedStartTimes = result.map(employee => dayjs(employee.startTime).format('YYYY年MM月DD日HH時mm分'));
        const formattedEndTimes = result.map(employee => dayjs(employee.endTime).format('YYYY年MM月DD日HH時mm分'));
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

//編集した労働データの送信
exports.postWorkRecordEdit = async(req,res) => {
    const _id = req.body._id;
    const formattedStartTime = req.body.formattedStartTime;
    const formattedEndTime = req.body.formattedEndTime;
    try{
        for (let i = 0; _id && i <= _id.length - 1; i++) {
            if(formattedEndTime[i] === ''){
                formattedEndTime[i] = null;
            }
            const insertDate = new insertEditedRecord(_id[i],formattedStartTime[i],formattedEndTime[i]);
            await insertDate.editedRecord();
            const calculateTodayWage = new reCalculateWage();
            await calculateTodayWage.recalculateTodayWage(_id[i]);
        }
    } catch(err) {
        console.log(err);
    }
    res.redirect('/admin/workRecord');
}

//検索条件の送信
exports.postPayrollReserch = (req,res) => {
    const employeeName = req.body.employeeName;
    const inputMonth = req.body.inputMonth;
    res.redirect(`/admin/WorkRecord/search?employeeName=${employeeName}&inputMonth=${inputMonth}`);
}

exports.getWorkRecordSearch = async(req,res) => {
    const employeeName = req.query.employeeName;
    const inputMonth = req.query.inputMonth;
    console.log('氏名:'+employeeName+'年月:'+inputMonth);
    const workRecord = new getSpecificWorkRecord();
    try{
        if(employeeName !=='' & inputMonth !== ''){
            const result = await workRecord.getSpecificWorkRecord(employeeName,inputMonth);
            const _ids =  result.map(employee => employee._id);
            const employeeNames = result.map(employee => employee.employeeName);
            const employeeIDs = result.map(employee => employee.employeeID);
            const startTimes = result.map(employee => employee.startTime);
            const endTimes = result.map(employee => employee.endTime);
            const todayWages = result.map(employee => employee.todayWage);
            const formattedStartTimes = result.map(employee => dayjs(employee.startTime).format('YYYY年MM月DD日HH時mm分'));
            const formattedEndTimes = result.map(employee => dayjs(employee.endTime).format('YYYY年MM月DD日HH時mm分'));
            res.render('../views/admin/payrollSearchResult.ejs',{
                _id: _ids,
                employeeName:employeeNames,
                employeeID:employeeIDs,
                startTime:startTimes,
                endTime:endTimes,
                formattedStartTime:formattedStartTimes,
                formattedEndTime:formattedEndTimes,
                todayWage:todayWages,
            })
        } else {
            res.redirect('/admin/WorkRecord?message=従業員氏名と日時の両方を選択してください');
        }        
    } catch(err) {
      console.log(err);  
    }
}