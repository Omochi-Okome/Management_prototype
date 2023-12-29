const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;
const dayjs = require('dayjs');
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

class CommonDBOperation {
    constructor(collectionName,startTime,breakTime,endTime,employeeID){
        this.collectionName = collectionName;
        this.startTime = startTime;
        this.breakTime = breakTime;
        this.endTime = endTime;
        this.employeeID = employeeID;
    }
    //データの全取得
    fetchAll() {
        const db = getDB();
        return db.collection(this.collectionName)
          .find()
          .toArray()
          .then(data => {
            console.log(data);
            return data;
          })
      }
}

//出勤時刻の記録
class recordStartWork {
    constructor(startTime,employeeName,employeeID,employeeHourlyWage){
        this.collectionName = "workTimeRecord";
        this.startTime = startTime;
        this.employeeName = employeeName;
        this.employeeID = parseInt(employeeID);
        this.employeeHourlyWage = parseInt(employeeHourlyWage);
        this.todayWage = null
    }
    async writeStartTime() {
        const DB = getDB();
        const collection = DB.collection(this.collectionName);

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
                })
                console.log(result);
            } catch(err) {
            console.log(err);
            }   
        } else {
            console.log('不正な出勤を感知しました')
        }   
    }
}

//退勤時刻の記録
class recordEndWork {
    constructor(employeeID,endTime){
        this.employeeID = employeeID;
        this.endTime = endTime;
        this.collectionName = "workTimeRecord";
    }
    async writeEndTime() {
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
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
                console.log('更新に成功しました')
            } else {
                console.log('更新に失敗しました。')
                console.log(result);
            }
        } catch(err) {
            console.log(err);
        }
    }
}

//労働記録の取得
class getWorkRecord {
    constructor(collectionName){
        this.collectionName = collectionName;
    }

    getWorkRecord() {
        const workRecord = new CommonDBOperation(this.collectionName);
        return workRecord.fetchAll();
    }
}

//労働記録をするにあたってEmployeeDataから氏名を取得
class fetchName {
    constructor(collectionName){
        this.collectionName = collectionName;
    }

    fectchName(employeeID) {
        const DB = getDB();
        return DB.collection(this.collectionName)
            .findOne({employeeID:parseInt(employeeID)})
            .then(result => {
                if (result) {
                    return result.employeeName;
                } else {
                    console.log('IDがおかしいぞ');
                    return null;
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}

//給料計算をするために時給を取得
class fetchHourlyWage {
    constructor(collectionName){
        this.collectionName = collectionName;
    }
    fetchHourlyWage(employeeID) {
        const DB = getDB();
        return DB.collection(this.collectionName)
            .findOne({employeeID:parseInt(employeeID)})
            .then(result => {
                if (result) {
                    return result.employeeHourlyWage;
                } else {
                    console.log('IDがおかしいぞ');
                    return null;
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}


//勤務した日の給料計算
class calculateWage {
    constructor(collectionName){
        this.collectionName = collectionName;
    }
    async calculateTodayWage(employeeID) {
        const DB = getDB();
        try {
            const result = await DB.collection(this.collectionName)
                .findOne({employeeID:parseInt(employeeID),todayWage:null})
                console.log('この私が確かめてやろう。result:'+result);
                console.log('この私が確かめてやろう。result.startTime:'+result.startTime);
                console.log('この私が確かめてやろう。result.endTime:'+result.endTime);
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

                    await DB.collection(this.collectionName)
                        .updateOne({_id:result._id,todayWage:null},updateData);
                } else {
                    console.log("データを取得できませんでした");
                }
            } else {
                console.log('エラーが発生しました。');
            }
            
            } catch(err) {
                console.log('エラーが発生。',err);
        }
    }
}


module.exports= {recordStartWork,recordEndWork,getWorkRecord,fetchName,fetchHourlyWage,calculateWage};