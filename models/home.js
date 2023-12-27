const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;

class CommonDBOperation {
    constructor(collectionName,EmployeeID,EmployeePassword){
        this.collectionName = collectionName;
        this.EmployeeID = EmployeeID;
        this.EmployeePassword = EmployeePassword;
    }

    inspectDB(){
        const DB = getDB();
        const collection = DB.collection(this.collectionName);
        console.log(this.collectionName);
        console.log(this.EmployeeID);
        console.log(this.EmployeePassword);
        return collection
            .find({EmployeeID:this.EmployeeID,EmployeePassword:this.EmployeePassword})
            .toArray()
            .then(data => {
                if (data.length > 0) {
                    console.log("パスワードとIDが一致しました!!");
                    console.log(`オブジェクトID:${data[0]._id}`);
                    console.log(`ID:${data[0].EmployeeID}`);
                    console.log(`Password:${data[0].EmployeePassword}`);
                } else {
                    console.log("パスワードかIDが誤っています。");
                }
                return data;
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
          })
      }

}

class attendanceRegistration {
    constructor(collectionName,EmployeeID,EmployeePassword){
        this.EmployeeID = EmployeeID;
        this.EmployeePassword = EmployeePassword;
        this.collectionName = collectionName;
    }

    record(){
        const operation = new CommonDBOperation(this.collectionName,parseInt(this.EmployeeID),parseInt(this.EmployeePassword));
        return operation.inspectDB();
    }

} 

module.exports = {CommonDBOperation, attendanceRegistration};