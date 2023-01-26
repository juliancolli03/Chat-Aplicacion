const socket = io()

const autor = new normalizr.schema.Entity('autor',{},{idAttribute: "email"})
const messageSchema = new normalizr.schema.Entity('mensaje', {
  autores: autor
})
const messagesSchema = new normalizr.schema.Entity("messages", {
  messages: [messageSchema]
});
socket.on("menssages",data=>{
    const dataDesnor = normalizr.denormalize(data.result, messagesSchema, data.entities)    
    console.log(dataDesnor)
    const html = dataDesnor.messages.map(msj => {
        return `<div>
        <strong>${msj.usuario}</strong>
        <strong>${msj.fecha}</strong>
        <em>${msj.text}</em>
        </div>`
    })
    .join(" ")

    document.getElementById("messagesDeUsers").innerHTML = html
    })

   

function addMsj() {
    
    const message = {
        autor:{
            email: document.getElementById("email").value,
        },
        text: document.getElementById("textoo").value,


    }
    
    socket.emit('new-message', message)

    

    //   return false


        
    
}