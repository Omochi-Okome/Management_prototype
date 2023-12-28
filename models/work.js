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

class recordEmployeeWork {
    constructor(startTime,employeeID){
        this.collectionName = "workTimeRecord";
        this.startTime = startTime;
        this.employeeID = parseInt(employeeID);
    }
    writeStartTime() {
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
        const updateData = {
            $set: {
                employeeID:this.employeeID,
                startTime: this.startTime,
                breakTime: this.breakTime,
                endTime: this.endTime
            }
        };
        return collection
            .insertOne({ startTime:this.startTime,employeeID:this.employeeID},updateData)
            .then(result => {
            })
            .catch(err => {
            console.log(err);
            })
    }

}

module.exports= {recordEmployeeWork};