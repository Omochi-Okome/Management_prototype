const mongoDB = require('mongodb');
const getDB = require('../util/database').getDB;

//編集した労働データを挿入する
class insertEditedRecord{
    constructor(_idArray,formattedStartTime,formattedEndTime){
        this._id = _idArray;
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

//チェックが入った対象のデータを削除する
class deleteSpecificRecord {
    async deleteRecord(_id){
        console.log('_idは'+_id);
        const DB = getDB();
        const collection = DB.collection('workTimeRecord')
        try{
            const result = await collection.deleteOne({
                _id:new mongoDB.ObjectId(_id)
            });
        } catch(err) {
            console.log(err);
        }
        
    }
}

module.exports = {insertEditedRecord,deleteSpecificRecord};