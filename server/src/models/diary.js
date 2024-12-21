const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiarySchema = new Schema({
    user_id : {
        type : String,
        required : true,
    },
    diary : {
        type : [],
        required : true
    }
}, { timestamps: true });

const Diary = mongoose.model('Diary', DiarySchema);

module.exports =  Diary ;