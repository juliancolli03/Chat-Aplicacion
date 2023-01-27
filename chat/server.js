const express = require('express')
const session = require('express-session')
const cookieParser = require("cookie-parser")
const MongoStore = require("connect-mongo")
const {ingresar,salirse,registrarse} = require("./routers/rutaingresar")
// const salir = require("./routers/rutasalir")
// const registrarse = require("./routers/rutaregistro")
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io') 
const container = require("./container/contenedorchat")
const { normalize, denormalize, schema } = require('normalizr')
const util = require ('util')
const passport = require("passport")

let chat = new container();
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const advancedOptions = {useNewUrlParser: true, useUnifiedTopology:true}
let userName;
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://juliancolli:1234@primercluster.zfdig3v.mongodb.net/?retryWrites=true&w=majority",
    mongoOptions: advancedOptions
  }),
  secret: "coderhouse",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {maxAge: 600000}
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/ingresar', ingresar)
app.use("/registrarse", registrarse);
app.use("/salirse", salirse);
app.get('/chat', async (req, res) => {
  let usuario = req.user.name
  userName=usuario
  if (usuario === null || usuario === undefined) {
      return res.redirect("/ingresar")
  }
  res.render('inicio', {chat,usuario} )
})

// app.get('*', function (req, res) {
//   return res.redirect("/ingresar")

// })




io.on('connection', async socket =>{
    const listaMensajes = await chat.getChat()
    const strin = JSON.stringify(listaMensajes)
    const data = JSON.parse(strin)
    const mensajesId = {
      id: 'backendCoder',
      messages: data
    };
    const autor = new schema.Entity('autor',{},{idAttribute: "email"})
    const messageSchema = new schema.Entity('mensaje', {
      autores: autor
    })
    const messagesSchema = new schema.Entity("messages", {
      messages: [messageSchema]
    });
  
    const messagesNorm = normalize(mensajesId, messagesSchema);

    socket.emit('menssages', messagesNorm)
    socket.on('new-message', async data => {

      if (listaMensajes.length === 0) {
        return await chat.addChat({...data, id: 1,fecha:new Date().toLocaleString()
        })
      }
      await chat.addChat({...data, id: listaMensajes.length +1, fecha: new Date().toLocaleString()
      })
  
    
      io.sockets.emit('menssages', listaMensajes)
    })
  })
  
  function print(objeto) {
      console.log(util.inspect(objeto,false,12,true))
  }


const PORT = 8080

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

