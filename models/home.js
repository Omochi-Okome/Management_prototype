const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;

class CommonDBOperation {
    constructor(collectionName,employeeID,employeePassword){
        this.collectionName = collectionName;
        this.employeeID = employeeID;
        this.employeePassword = employeePassword;
    }

    inspectDB() {
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
        console.log(this.collectionName);
        console.log(this.employeeID);
        console.log(this.employeePassword);
        return collection
            .find({employeeID:this.employeeID,employeePassword:this.employeePassword})
            .toArray()
            .then(data => {
                if (data.length > 0) {
                    console.log("パスワードとIDが一致しました!!");
                    console.log(`従業員名:${data[0].employeeName}`);
                    console.log(`ID:${data[0].employeeID}`);
                    console.log(`Password:${data[0].employeePassword}`);
                    console.log(`時給:${data[0].employeeHourlyWage}円`);
                    return true;
                } else {
                    console.log("パスワードかIDが誤っています。");
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
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

class attendanceRegistration {
    constructor(collectionName,employeeID,employeePassword){
        this.employeeID = employeeID;
        this.employeePassword = employeePassword;
        this.collectionName = collectionName;
    }

    checkIDPassword(){
        const operation = new CommonDBOperation(this.collectionName,parseInt(this.employeeID),parseInt(this.employeePassword));
        return operation.inspectDB();
    }

    fetchAll(){
        const operation = new CommonDBOperation(this.collectionName);
        return operation.fetchAll();
    }

} 

module.exports = {CommonDBOperation, attendanceRegistration};