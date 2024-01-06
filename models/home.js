const getDB = require('../util/database').getDB;

//出退勤記録
class attendanceRegistration {
    constructor(employeeID,employeePassword){
        this.employeeID = employeeID;
        this.employeePassword = employeePassword;
    }
    //従業員IDとパスワードのチェック
    checkIDPassword(){
        const DB = getDB();
        const collection = DB.collection('EmployeeData');
        let checkResult;
        return collection
            .find({employeeID:parseInt(this.employeeID),employeePassword:parseInt(this.employeePassword)})
            .toArray()
            .then(data => {
                if (data.length > 0) {
                    return true;
                } else {
                    checkResult ='パスワードかIDが誤っています。'
                    return false;
                }
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
    }
    //従業員データの全取得
    fetchAll() {
        const db = getDB();
        return db.collection('EmployeeData')
          .find()
          .toArray()
          .then(data => {
            return data;
          })
      }
} 

module.exports = {attendanceRegistration};