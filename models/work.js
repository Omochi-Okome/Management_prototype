const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;

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
    writeStartTime() {
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
        const updateData = {
            $set: {
                employeeName:this.employeeName,
                employeeID:this.employeeID,
                startTime: this.startTime,
                endTime: this.endTime,
                employeeHourlyWage: this.employeeHourlyWage,
                todayWage: this.todayWage,
            }
        };
        return collection
            .insertOne({
                employeeName:this.employeeName,
                employeeID:this.employeeID,
                startTime:this.startTime,
                endTime:null,
                employeeHourlyWage:this.employeeHourlyWage,
                todayWage:this.todayWage
            },updateData)
            .then(result => {
            })
            .catch(err => {
            console.log(err);
            })
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
                    console.log('名前がわかったぞ！'+result.employeeName);
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
                    console.log('時給がわかったぞ！'+result.employeeHourlyWage);
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


module.exports= {recordStartWork,recordEndWork,getWorkRecord,fetchName,fetchHourlyWage};