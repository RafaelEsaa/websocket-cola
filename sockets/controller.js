const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl

const socketController = (socket) => {
  //---
  // Esto ocurre apenas se levante el servidor y se conecte un cliente
  socket.emit('ultimo-ticket', ticketControl.ultimo)
  socket.emit('ultimos-4', ticketControl.ultimos4)
  socket.emit('tickets-pendientes', ticketControl.tickets.length)
  //---


  //Con el .ON escucho y dentro con .EMIT, mando el mensaje/accion
  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    
    callback(siguiente) // numero del ticket creado

    // TODO: Notificar que hay un nuevo ticket
  });

  socket.on('atender-ticket', ({escritorio}, callback) => {
    if(!escritorio){
      return callback({
        ok: false,
        msg: 'El escritorio es obligatorio'
      })
    }

    const ticket = ticketControl.atenderTicket(escritorio)

    // Notificar cambio de los ultimos 4
    socket.broadcast.emit('ultimos-4', ticketControl.ultimos4)
    socket.emit('tickets-pendientes', ticketControl.tickets.length)
    if(!ticket) {
      callback({
        ok: false,
        msg: 'Ya no hay tickets pendiente'
      })
    } else {
      callback({
        ok: true,
        ticket
      })
    }
  })
};

module.exports = {
    socketController
}