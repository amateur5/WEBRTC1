const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serviraj statičke datoteke iz 'public' foldera
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Konfiguracija Socket.io za chat i WebRTC signaling
io.on('connection', (socket) => {
    console.log('Novi korisnik je povezan');
    
    // Rukovanje chat porukama
    socket.on('chat message', (msg) => {
        console.log('Poruka primljena: ', msg);
        io.emit('chat message', msg);
    });

    // Rukovanje WebRTC signalizacijom
    socket.on('webrtc-offer', (offer) => {
        console.log('Primljena WebRTC ponuda');
        socket.broadcast.emit('webrtc-offer', offer); // Šalje ponudu svim korisnicima osim posiljaoca
    });

    socket.on('webrtc-answer', (answer) => {
        console.log('Primljen WebRTC odgovor');
        socket.broadcast.emit('webrtc-answer', answer); // Šalje odgovor svim korisnicima osim posiljaoca
    });

    socket.on('webrtc-ice-candidate', (candidate) => {
        console.log('Primljen ICE kandidat');
        socket.broadcast.emit('webrtc-ice-candidate', candidate); // Šalje ICE kandidat svim korisnicima osim posiljaoca
    });

    socket.on('disconnect', () => {
        console.log('Korisnik je odjavljen');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
