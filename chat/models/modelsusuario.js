const mongoose = require("mongoose")

const collectionUsuario = "Users";

const schemaUsuario = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
});

const modelsUsuario = mongoose.model(collectionUsuario, schemaUsuario);

module.exports= modelsUsuario