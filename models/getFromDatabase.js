const getDB = require('../util/database').getDB;

//労働記録の取得
class getWorkRecord {
    getWorkRecord() {
        const db = getDB();
        return db.collection('workTimeRecord')
            .find()
            .toArray()
            .then(data => {
                return data;
            })
    }
}

//労働記録をするにあたってEmployeeDataから氏名を取得
class fetchName {
    fectchName(employeeID) {
        const DB = getDB();
        return DB.collection('EmployeeData')
            .findOne({employeeID:parseInt(employeeID)})
            .then(result => {
            if (result) {
                return result.employeeName;
            } else {
                console.log('IDが誤っています。');
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
    fetchHourlyWage(employeeID) {
        const DB = getDB();
        return DB.collection('EmployeeData')
            .findOne({employeeID:parseInt(employeeID)})
            .then(result => {
                if (result) {
                    return result.employeeHourlyWage;
                } else {
                    console.log('IDが誤っています。');
                    return null;
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
}

//名前と日時から特定して返す
class getSpecificWorkRecord {
    getSpecificWorkRecord(employeeName,inputMonth) {
        this.inputMonth = inputMonth;
        this.employeeName = employeeName;
        const db = getDB();
        return db.collection('workTimeRecord')
            .find({
                employeeName:employeeName,
                startTime:{$regex: inputMonth}
            })
            .toArray()
            .then(data => {
                return data;
            })
    }
}

module.exports = {getWorkRecord,fetchName,fetchHourlyWage,getSpecificWorkRecord}