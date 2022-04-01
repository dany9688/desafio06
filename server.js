const express = require('express');
const res = require('express/lib/response');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const fs = require('fs');
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const moment = require('moment');


httpServer.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
})

app.use(express.static('public'))

app.set('views', './public/views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index', {products})
})

let products = [
    {
    title: "Libro",
    price: 15,
    thumbnail: "www.google.com",
    id: 0
},
{
    title: "Carpeta",
    price: 153,
    thumbnail: "www.google.com.ar",
    id: 1
}
]

let mensajes = [
    {
        email: "lala@lala.com",
        date: "22/12/22 11:33:44",
        mensaje: "lalala"
    }
]


io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('products', products);
    socket.emit('mensajes', mensajes);
    
    socket.on('new-product',data => {
        products.push(data);
        io.sockets.emit('products', products);
    });
    socket.on('new-mensaje',data => {
        console.log(data);
        let guardar = JSON.stringify(data);
        mensajes.push(data);
        const ruta = './mensajes.txt';
        fs.writeFileSync(ruta, guardar)
        io.sockets.emit('mensajes', mensajes);
    });

});

