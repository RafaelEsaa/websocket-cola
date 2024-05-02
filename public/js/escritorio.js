// Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert')
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search)

if(!searchParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

divAlert.style.display = "none";
const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

const socket = io();

socket.on("connect", () => {
  // console.log('Conectado');

  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  // console.log('Desconectado del servidor');

  btnAtender.disabled = true;
});

socket.on("ultimo-ticket", (ultimo) => {
//   lblNuevoTicket.innerText = "Ticket " + ultimo;
});

socket.on("tickets-pendientes", (ticketsPendientes) => {
  console.log('tickets pendientes ', ticketsPendientes)
  lblPendientes.innerText = ticketsPendientes;
});

btnAtender.addEventListener("click", () => {
    socket.emit('atender-ticket', { escritorio }, ({ok, ticket, msg}) => {
        if(!ok){
            lblTicket.innerText = `Nadie`;
            return divAlert.style.display = '';
        }
        lblTicket.innerText = `Ticket ` + ticket.numero;
    })
});