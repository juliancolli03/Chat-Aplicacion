const {getUsuario,salir} = require("../controllers/ingresar")
const container = require("../container/contenedor")
const passport = require ("passport")
const LocalStrategy = require("passport-local").Strategy
const bCrypt = require("bcrypt")
const { Router } = require('express');

const dbUsuario = new container();
const ingresar = Router();
const registrarse = Router()
const salirse = Router()

function createHash(password) {
    return bCrypt.hashSync( password, bCrypt.genSaltSync(10), null );
}
  
passport.use("register", new LocalStrategy({
    passReqToCallback: true,
}, async (req, username, password, done) => {
    const { name } = req.body;
    const usuario = await dbUsuario.getUsuario(username);

    if (usuario) {
        return done("el usuario ya esta registrado", false);
    }

    const newUser = {
        username,
        password: createHash(password),
        name,
    };

   const dataUser = await dbUsuario.addUsuario(newUser);
    done(null, newUser);
}));

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}

passport.use("login", new LocalStrategy(async (username, password, done) => {

    const usuario = await dbUsuario.getUsuario(username);

    if (!usuario) {
        return done("no existe el usuario", false);
    };

    if (!isValidPassword(usuario, password)) {
        return done("Contraseña incorrecta", false)
    };

    return done(null, usuario);
}));   

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
    const usuario = await dbUsuario.getUsuario(username);
    done(null, usuario);
});

ingresar.get("/", getUsuario);
ingresar.post("/", passport.authenticate("login", { 
    failureRedirect: "/ingresar/errorIngresar", 
    successRedirect: "/chat",
}));
ingresar.get("/errorIngresar", (req, res,done) => {
    done("error de log in");
});

registrarse.get("/", getUsuario);
registrarse.post("/", passport.authenticate("register", {
    failureRedirect: "/registrarse/errorRegistro", 
    successRedirect: "/chat",
}));
registrarse.get("/errorRegistro", (req, res,done)=> {
    done("error de registro");
});

salirse.get("/", salir);
module.exports= {ingresar,registrarse,salirse}