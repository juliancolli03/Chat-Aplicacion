const mongoose = require('mongoose');

const collectionChat = "mensajes"

const schemaChat = new mongoose.Schema({
    
        
    id: String,
    username: String,
    text: String,
    fecha: String,
    id:Number
})

const models = mongoose.model(collectionChat, schemaChat)

module.exports = models