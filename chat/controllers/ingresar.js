const getUsuario = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/productos")
    }
    return res.render("inicioDeIngreso")
    
};

const salir = (req, res) => {
    const usuario = req.user.name;
    req.logout(err => {
        const saludo = `Hasta luego ${usuario}`;
        res.render("saludo", {saludo});
    });
};

module.exports = {
    getUsuario,
    salir
}