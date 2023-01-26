const mongoose = require('mongoose');
const modelsUsuario = require("../models/modelsusuario")

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/usuario", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    
});


class Container {
    
    async getUsuario(data){
        const usuario = await modelsUsuario.findOne({username: data});
        return usuario;
    }

    async addUsuario(data){
        const dataAdd = new modelsUsuario(data);
        const add = await dataAdd.save();
        return add;
        
    }
    
}

module.exports = Container;




    
   

