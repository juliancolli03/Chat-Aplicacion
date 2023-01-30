const mongoose = require('mongoose');
const modelsChat = require("../models/modelsChat")
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/usersnames", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
   
});


class Container {
    
    async getChat(){
        const data = await modelsChat.find()
        return data
    }

    async addChat(data){
        const dataAdd = new modelsChat(data)
        const add = await dataAdd.save()
        return add
    }
    async borrarChat(){
        const chatsAnteriores=modelsChat.deleteMany({})
        return chatsAnteriores
    }
}

module.exports = Container;