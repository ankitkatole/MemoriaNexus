const express = require('express')

const Inbox = require('../models/inbox')
const { User } = require("../models/user")
const getInbox = async (req, res) => {

    // logic to send profile photo and name of the user
    const email = req.body.email
    let inboxArray = []
    const uniqueEmails = new Set()

    try{

        const inbox = await Inbox.findOne({User : email})

        if(inbox.Messages.length == 0 && inbox.Recived.length == 0){
            res.send("inbox empty")
        }
        else{
            const lengthSent = inbox.Messages.length
            const lengthRecived = inbox.Recived.length
    
            for(let i = 0; i < lengthSent;i++){
                const to = inbox.Messages[i].to
                if(!uniqueEmails.has(to)) {
                    const user = await User.findOne({"UserInfo.email" : to})
                    const segregatedData = {
                        email : to,
                        name : user.UserInfo.name,
                        image : user.UserInfo.picture,
                    }
                    inboxArray.push(segregatedData)
                    uniqueEmails.add(to)
                }
            }
    
            for(let i = 0; i < lengthRecived;i++){
                const from = inbox.Recived[i].from
                if(!uniqueEmails.has(from)) {
                    const user = await User.findOne({"UserInfo.email" : from})
                    const segregatedData = {
                        email : from,
                        name : user.UserInfo.name,
                        image : user.UserInfo.picture,
                    }
                    inboxArray.push(segregatedData)
                    uniqueEmails.add(from)
                }
            }
    
            res.send({data : inboxArray})
        }

        

    }catch(error){
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

const getChat = async (req, res) => {

    // logic to get chats of both the users
    const me = req.body.me
    const other = req.body.other
    console.log(me,other)

    let meArray
    let otherArray

    try{

        const inbox = await Inbox.findOne({User : me})

        const lengthSent = inbox.Messages.length
        const lengthRecived = inbox.Recived.length

        let i = 0
        for(i = 0; i < lengthSent;i++){
            if(inbox.Messages[i].to == other){
                meArray = inbox.Messages[i].data
                break
            }
        }

        if(i == lengthSent){
            meArray = []
        }

        i = 0
        for(i = 0; i < lengthRecived;i++){
            if(inbox.Recived[i].from == other){
                otherArray = inbox.Recived[i].data
                break
            }
        }

        if(i == lengthRecived){
            otherArray = []
        }

        res.send({myMessages : meArray, senderMessages : otherArray})
 
    }catch(error){
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

const sendMessage = async (req, res) => {

    // logic to store message in both user inbox collection
    const from = req.body.from
    const to = req.body.to
    const message = req.body.message

    try{

        const userFrom = await Inbox.findOne({User : from})

        const fromMessagesLength = userFrom.Messages.length
        
        let i = 0
        for(i = 0; i < fromMessagesLength;i++) {
            if(userFrom.Messages[i].to == to) {
                userFrom.Messages[i].data.push({
                    mes : message,
                    at : Date.now()
                })

                break
            }
        }

        if(i == fromMessagesLength) {
            userFrom.Messages.push({
                to : to,
                data : [{
                    mes : message,
                    at : Date.now()
                }]
            })
        }

        await userFrom.save()

        const userTo = await Inbox.findOne({User : to})

        const toRecivedLength = userTo.Recived.length
        
        i = 0
        for(i = 0; i < toRecivedLength;i++) {
            if(userTo.Recived[i].from == from) {
                userTo.Recived[i].data.push({
                    mes : message,
                    at : Date.now()
                })

                break
            }
        }

        if(i == toRecivedLength) {
            userTo.Recived.push({
                from : from,
                data : [{
                    mes : message,
                    at : Date.now()
                }]
            })
        }

        await userTo.save()

        res.send("Message send successfully!")
        
    }catch(error){
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

module.exports = {getInbox, getChat, sendMessage}