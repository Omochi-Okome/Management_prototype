const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;

//編集した労働データを挿入する
class insertEditedRecord{
    constructor(_id,formattedStartTime,formattedEndTime){
        this._id = _id;
        this.formattedStartTime = formattedStartTime;
        this.formattedEndTime = formattedEndTime;
    }
    async editedRecord() {
        const DB = getDB();
        const collection = DB.collection('workTimeRecord');
        try{
            const updateData = {
                $set: {
                    startTime: this.formattedStartTime,
                    endTime: this.formattedEndTime
                }
            };
            const result = await collection.updateOne(
                {
                    _id:new mongoDB.ObjectId(this._id),
                },
                updateData
            );

            if (result.modifiedCount >0) {
                console.log('更新に成功しました。');
            } else {
                console.log('データに変更がありません。');
            }
        } catch(err) {
            console.log(err);
        }
    }
}

module.exports = {insertEditedRecord};