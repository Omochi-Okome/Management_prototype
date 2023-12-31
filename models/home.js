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
        return collection
            .find({employeeID:parseInt(this.employeeID),employeePassword:parseInt(this.employeePassword)})
            .toArray()
            .then(data => {
                if (data.length > 0) {
                    console.log('パスワードとIDが一致しました!!');
                    console.log(`従業員名:${data[0].employeeName}`);
                    console.log(`ID:${data[0].employeeID}`);
                    console.log(`Password:${data[0].employeePassword}`);
                    console.log(`時給:${data[0].employeeHourlyWage}円`);
                    return true;
                } else {
                    console.log('パスワードかIDが誤っています。');
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