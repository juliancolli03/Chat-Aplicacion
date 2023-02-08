const passport = require ("passport")
const {getUsuario} = require("../controllers/ingresar")
const { Router } = require('express');
const container = require("../container/contenedor")

const googleIngresar = Router()
const  GoogleStrategy  =require ("passport-google-oauth").OAuth2Strategy
const dbUsuario = new container()
const { config } = require( "dotenv");
config();

passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: "79842872100-klul5sjikmo666l0pqkeo72ocsdqp2vt.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google",
    },
    function (accessToken, refreshToken, profile, done) {
      const response = dbUsuario.includes(profile.emails[0].value);
      // IF EXITS IN DATABASE
      if (response) {
        done(null, profile);
      } else {
        // SAVE IN DATABASE
        dbUsuario.addUsuario(profile.emails[0]);
        done(null, profile);
      }
    }
  )
);

googleIngresar.post("/", passport.authenticate("auth-google", { 
    failureRedirect: "/ingresar/errorIngresar", 
    successRedirect: "/chat",
}));
googleIngresar.get("/", getUsuario);


module.exports={googleIngresar}