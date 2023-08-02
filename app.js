const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let currentSlide = 1; // Número inicial do slide

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    
    // Enviar o número do slide atual para o cliente
    socket.emit('current slide', currentSlide);
    
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('image change', function(image) {
        console.log('image change: ' + image);
        
        // Atualizar o número do slide quando a imagem mudar
        currentSlide = image;
        
        // Enviar a alteração do slide para todos os clientes conectados
        io.emit('image change', image);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
