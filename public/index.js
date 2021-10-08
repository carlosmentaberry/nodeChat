const socket = io();

socket.on("message_back", (data) =>{
    console.log(data);
    render(data);
    socket.emit("message_client", "hola server");
})

const render = (data) =>{
    let html = data.map(x => {
        return `<p><strong>${x.nombre}</strong> : ${x.msn}</p>`;
    }).join(" ");
    document.getElementById("caja").innerHTML = html;
}

const addMsn = () => {
    let obj =  {
        nombre: document.getElementById("nb").value, 
        msn: document.getElementById("msn").value
    }

    socket.emit("data_client", obj);

    document.getElementById("msn").value = "";
    return false;
}