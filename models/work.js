const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

//出勤時刻の記録
class recordStartWork {
    constructor(startTime,employeeName,employeeID,employeeHourlyWage){
        this.startTime = startTime;
        this.employeeName = employeeName;
        this.employeeID = parseInt(employeeID);
        this.employeeHourlyWage = parseInt(employeeHourlyWage);
        this.todayWage = null;
    }
    async writeStartTime() {
        const DB = getDB();
        const collection = DB.collection('workTimeRecord');
        let checkResult;

        const NGData = await collection.findOne({
            employeeID:this.employeeID,
            endTime:null
        });
        if(!NGData) {
            try {
                const result = await collection.insertOne({
                employeeName:this.employeeName,
                employeeID:this.employeeID,
                startTime:this.startTime,
                breakStartTime:null,
                breakEndTime:null,
                endTime:null,
                employeeHourlyWage:this.employeeHourlyWage,
                todayWage:this.todayWage
                });
                checkResult = '正常に出勤登録ができました！'
            } catch(err) {
            console.log(err);
            }   
        } else {
            checkResult = 'すでに出勤しています。'
            console.log('すでに出勤しています');
        }   
        return checkResult;
    }
}

//休憩時刻の記録

class recordBreakWork {
    constructor(breakStartTime,employeeID){
        this.breakStartTime = breakStartTime;
        this.employeeID = employeeID;
    }
    async writeBreakStartTime() {
        console.log('休憩開始時刻：'+this.breakStartTime);//休憩開始時刻は正しく取得できている
        const DB = getDB();
        const collection = DB.collection('workTimeRecord');
        let checkResult;
        try {
            const pastRecord1 = await collection.findOne({
                employeeID:parseInt(this.employeeID),
                breakStartTime:null,
                todayWage:null
            });
            
            if(pastRecord1 !== null){
                console.log("STARTが作動");

                const findStartTime =  await collection.findOne({
                    employeeID:parseInt(this.employeeID),
                    todayWage:null,
                });
                console.log('findOneの結果：'+JSON.stringify(findStartTime))
                const updateData = {
                    $set: {
                        employeeID:parseInt(this.employeeID),
                        breakStartTime:this.breakStartTime
                    }
                }
                const result = await collection.updateOne({employeeID:parseInt(this.employeeID),todayWage:null},updateData)
                if (result.modifiedCount >0) {
                    console.log('休憩の打刻に成功しました');
                    checkResult ='休憩の打刻に成功しました。'
                } else {
                    console.log('休憩の打刻ができませんでした。');
                    checkResult = '出勤や休憩のデータがないか、すでに退勤されています。';
                }
            } else {
                const pastRecord2 = await collection.findOne({
                    employeeID:parseInt(this.employeeID),
                    breakEndTime:null,
                    todayWage:null
                })
                if(pastRecord2 !== null) {
                    console.log("ENDが作動");
                    const findStartTime =  await collection.findOne({
                        employeeID:parseInt(this.employeeID),
                        todayWage:null,
                    });
                    console.log('findOneの結果：'+JSON.stringify(findStartTime))
                    const updateData = {
                        $set: {
                            employeeID:parseInt(this.employeeID),
                            breakEndTime:this.breakStartTime
                        }
                    }
                    const result = await collection.updateOne({employeeID:parseInt(this.employeeID),todayWage:null},updateData)
                    if (result.modifiedCount >0) {
                        console.log('休憩の打刻に成功しました');
                        checkResult ='休憩の打刻に成功しました。'
                    } else {
                        console.log('休憩の打刻ができませんでした。');
                        checkResult = '出勤や休憩のデータがないか、すでに退勤されています。';
                    }
                } else{
                    console.log('STARTにもENDにも引っ掛からなかった');
                    checkResult = '出勤や休憩が未完了か、すでに退勤されています。';
                }
            }
            
        } catch(err) {
            console.log(err);
        }
    return checkResult;
    }
}

//退勤時刻の記録
class recordEndWork {
    constructor(employeeID,endTime){
        this.employeeID = employeeID;
        this.endTime = endTime;
    }
    async writeEndTime() {
        const DB = getDB();
        const collection = DB.collection('workTimeRecord');
        let checkResult;
        try{
            const findStartTime = await collection.findOne({
                employeeID:parseInt(this.employeeID),
                endTime:null
            });
            const existingData = findStartTime && findStartTime.startTime ? findStartTime.startTime : null;
            const updateData = {
                $set: {
                    employeeID: parseInt(this.employeeID),
                    startTime: existingData,
                    endTime: this.endTime
                }
            };
            const forgetResult = await collection.findOne({employeeID:parseInt(this.employeeID),breakStartTime:{$exists:true,$ne:null},breakEndTime:null});
            if(forgetResult){
                console.log('休憩終了の打刻忘れ');
                checkResult = '休憩終了の打刻を先にしてください。'
            } else {
                const result = await collection.updateOne({ employeeID:parseInt(this.employeeID),endTime:null }, updateData);
                if (result.modifiedCount >0) {
                    console.log('更新に成功しました');
                    checkResult ='今日もお疲れ様でした！'
                } else {
                    console.log('出勤のデータがありません。');
                    checkResult = '出勤のデータがありません。';
                }
            }
            
        } catch(err) {
            console.log(err);
        }
    return checkResult;
}
}

//勤務した日の給料計算
class calculateWage {
    async calculateTodayWage(employeeID) {
        const DB = getDB();
        try {
            const result = await DB.collection('workTimeRecord')
                .findOne({employeeID:parseInt(employeeID),todayWage:null})
                if(result && result.startTime &&result.endTime){
                    const startTime = dayjs(result.startTime);
                    const breakStartTime = dayjs(result.breakStartTime);
                    const breakEndTime = dayjs(result.breakEndTime);
                    const endTime = dayjs(result.endTime);
                if (startTime.isValid() && endTime.isValid()) {
                    if(breakStartTime.isValid() && breakEndTime.isValid()){
                        const calculateWorkTime = endTime.diff(startTime,'minutes');
                        const calculateBreakTime = breakEndTime.diff(breakStartTime,'minutes');
                        const employeeMinutesWage = result.employeeHourlyWage/60;
                        const todayWage = (calculateWorkTime - calculateBreakTime)*employeeMinutesWage;
                        const updateData = {
                            $set: { todayWage: parseInt(todayWage)}
                        };
                        await DB.collection('workTimeRecord')
                            .updateOne({_id:result._id,todayWage:null},updateData);
                    } else {
                        const calculateWorkTime = endTime.diff(startTime,'minutes');
                        const employeeMinutesWage = result.employeeHourlyWage/60;
                        const todayWage = calculateWorkTime*employeeMinutesWage;
                        const updateData = {
                            $set: { todayWage: parseInt(todayWage)}
                        };
                        await DB.collection('workTimeRecord')
                            .updateOne({_id:result._id,todayWage:null},updateData);
                    }
                } else {
                    console.log('データを取得できませんでした');
                }
            } else {
                console.log('エラーが発生しました。');
            }
            
            } catch(err) {
                console.log('エラーが発生。',err);
        }
    }
}

//労働データの編集後の給与再計算
class reCalculateWage {
    async recalculateTodayWage(_id) {
        const DB = getDB();
        try {
            const result = await DB.collection('workTimeRecord')
                .findOne({_id:new mongoDB.ObjectId(_id)})
                if(result && result.startTime &&result.endTime){
                    const startTime = dayjs(result.startTime);
                    const breakStartTime = dayjs(result.breakStartTime);
                    const breakEndTime = dayjs(result.breakEndTime);
                    const endTime = dayjs(result.endTime);
                if (startTime.isValid() && endTime.isValid()) {
                    if(breakStartTime.isValid() && breakEndTime.isValid()){
                        console.log('第3関門');
                        const calculateWorkTime = endTime.diff(startTime,'minutes');
                        const calculateBreakTime = breakEndTime.diff(breakStartTime,'minutes');
                        const employeeMinutesWage = result.employeeHourlyWage/60;
                        const todayWage = (calculateWorkTime - calculateBreakTime)*employeeMinutesWage;
                        console.log('賃金:'+todayWage);
                        const updateData = {
                            $set: { todayWage: parseInt(todayWage)}
                        };
                        console.log('updateDataの中身:'+updateData);
                        await DB.collection('workTimeRecord')
                            .updateOne({_id:result._id},updateData);
                    } else{
                        console.log('第4関門');
                        const calculateWorkTime = endTime.diff(startTime,'minutes');
                        const employeeMinutesWage = result.employeeHourlyWage/60;
                        const todayWage = calculateWorkTime*employeeMinutesWage;
                        const updateData = {
                            $set: { todayWage: parseInt(todayWage)}
                        };
                        await DB.collection('workTimeRecord')
                            .updateOne({_id:result._id},updateData);
                    }
                } else {
                    console.log('データを取得できませんでした');
                }
            } else {
                console.log('エラーが発生しました。');
            }
            
            } catch(err) {
                console.log('エラーが発生。',err);
        }
    }
}




module.exports= {
    recordStartWork,
    recordBreakWork,
    recordEndWork,
    calculateWage,
    reCalculateWage,
};