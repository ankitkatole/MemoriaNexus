const mongoose = require('mongoose')

const inboxSchema = new mongoose.Schema({
    User : {
        type : String,
        required : true
    },
    Messages : {
        type : [
            {
                to : String,
                data : [
                    {
                        mes : String,
                        at : Number
                    }
                ]
            }
        ],
        required : false
    },
    Recived : {
        type : [
            {
                from : String,
                data : [
                    {
                        mes : String,
                        at : Number
                    }
                ]
            }
        ],
        required : false
    }
})

const Inbox = mongoose.model("Inbox", inboxSchema)

module.exports = Inbox
