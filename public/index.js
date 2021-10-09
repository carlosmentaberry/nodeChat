const socket = io();
let nombre = undefined;


socket.on("message_back", (data) => {
    render(data);
});

const render = (data) => {
    let fullhtml = `<table class="table table-sm">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Time</th>
                            <th scope="col">Message</th>
                        </tr>
                        </thead>
                        <tbody>`;

    let html = data.map((x) => {
        return `<tr>
                    <th scope="row"><p>${x.nombre}</p></th>
                    <td><p style="color:brown">${x.time}</p></td>
                    <td><p class="text-success"><em>${x.msn}</em></p></td>
                </tr>`}).join(" ");
    fullhtml += html + `</table>`;
    document.getElementById("caja").innerHTML = fullhtml;
}
let user = undefined;
const addMsn = () => {
    if (!nombre) {
        nombre = prompt('Ingresa un nombre');
        user = { nombre: nombre, id: socket.id };
        socket.emit("Log_Connecte_Users", user);
    }
    let obj = {
        nombre: user.nombre,
        msn: document.getElementById("msn").value,
        time: new Date().toLocaleString(),
        id: socket.id
    }
    socket.emit("data_client", obj);


    document.getElementById("username").innerHTML = "(" + nombre + ")";
    document.getElementById("msn").value = "";
    document.getElementById("msn").focus();
    return false;
}