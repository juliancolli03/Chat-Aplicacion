const mongoose = require('mongoose');
const modelsChat = require("../models/modelsChat")
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/usuario", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
   
});


class Container {
    
    async getChat(){
        const data = await modelsChat.find({}, {_id:0, __v:0})
        return data
    }

    async addChat(data){
        const dataAdd = new modelsChat(data)
        const add = await dataAdd.save()
        return add
    }
}

module.exports = Container;