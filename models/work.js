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

        const ngData = await collection.findOne({
            employeeID:this.employeeID,
            endTime:null
        });
        if(!ngData) {
            try {
                const result = await collection.insertOne({
                employeeName:this.employeeName,
                employeeID:this.employeeID,
                startTime:this.startTime,
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

            const result = await collection.updateOne({ employeeID:parseInt(this.employeeID),endTime:null }, updateData);
            if (result.modifiedCount >0) {
                console.log('更新に成功しました');
                checkResult ='今日もお疲れ様でした！'
            } else {
                console.log('出勤のデータがありません。');
                checkResult = '出勤のデータがありません。';
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
                    const endTime = dayjs(result.endTime);
                if (startTime.isValid() && endTime.isValid()) {
                    const calculateWorkTime = endTime.diff(startTime,'minutes');
                    const employeeMinutesWage = result.employeeHourlyWage/60;
                    const todayWage = calculateWorkTime*employeeMinutesWage;
                    const updateData = {
                        $set: { todayWage: parseInt(todayWage)}
                    };

                    await DB.collection('workTimeRecord')
                        .updateOne({_id:result._id,todayWage:null},updateData);
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
                    const endTime = dayjs(result.endTime);
                if (startTime.isValid() && endTime.isValid()) {
                    const calculateWorkTime = endTime.diff(startTime,'minutes');
                    const employeeMinutesWage = result.employeeHourlyWage/60;
                    const todayWage = calculateWorkTime*employeeMinutesWage;
                    const updateData = {
                        $set: { todayWage: parseInt(todayWage)}
                    };

                    await DB.collection('workTimeRecord')
                        .updateOne({_id:result._id},updateData);
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
    recordEndWork,
    calculateWage,
    reCalculateWage,
};