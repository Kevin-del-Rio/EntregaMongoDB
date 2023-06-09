const socket = io();
let user;
let chatBox = document.getElementById("chatBox")

Swal.fire({
    title: "Usuario",
    input: "text",
    text: "Ingrese su nombre de Usuario",
    inputValidator: (value) => {
        return !value && "Necesitas un nombre de usuario para continuar!"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    socket.emit("loadChats",{})
});

//Evento al dar Enter
chatBox.onkeyup = (event) => {
    if (event.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            //Guardo el mensaje
            socket.emit("saveChat",{user:user,message: chatBox.value});
            chatBox.value="";
        }
    }
}


//Cargo los mensajes
socket.on("loadChats", data => {
    let log = document.getElementById("messageLogs")
    let messages = "";
    data.forEach(message => {
        messages = messages+`${message.user}: ${message.message} <br>`
    });
    log.innerHTML = messages;
})
