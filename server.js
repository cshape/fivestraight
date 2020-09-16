const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const port = process.env.PORT || 4000;

const server = http.Server(app).listen(port);
const io = socketIo(server);

let rogueplayers = [];

const boardNumbers = [
    73, 72, 71, 70, 69, 68, 67, 66, 65, 0,
    74, 57, 58, 59, 60, 61, 62, 63, 64, 99,
    75, 56, 21, 20, 19, 18, 17, 36, 37, 98,
    76, 55, 22, 13, 14, 15, 16, 35, 38, 97,
    77, 54, 23, 12, 1, 4, 5, 34, 39, 96,
    78, 53, 24, 11, 2, 3, 6, 33, 40, 95,
    79, 52, 25, 10, 9, 8, 7, 32, 41, 94,
    80, 51, 26, 27, 28, 29, 30, 31, 42, 93,
    81, 50, 49, 48, 47, 46, 45, 44, 43, 92,
    82, 83, 84, 85, 86, 87, 88, 89, 90, 91
]

function Player(name) {
    this.name = name;
    this.color = 'green';
    this.isActive = false;
    this.isConnected = true;
}

function Card(number, i) {
    this.location = "deck";
    this.displayNumber = number;
    this.number = i;
}

function Square(number, i) {
    this.displayNumber = number;
    this.number = i;
    this.color = "";
}



let games = [];


// WHEN PLAYERS VISIT THE PAGE - we start the connection (done)

io.on("connection", function(socket) {
    console.log("New client connected. ID: ", socket.id);

//todo: remove the name self thing and just have create game or join game with no rogueplayers bs

// WHEN PLAYER CHOOSES A NAME - we creat a new Player obj and send it back to the client (not done on frontend, backend fine)

socket.on("choose.name", function(data) {
    let newPlayer = new Player (data);
    newPlayer.isActive = true;
    rogueplayers.push(newPlayer)
    console.log("new player:", newPlayer.name)
    socket.emit("name.chosen", newPlayer); // Emit for the player who made the move
});

// WHEN PLAYER CREATES A GAME - a new game object is created and populated, rogueplayer is deleted and moved to the game object
    
    socket.on("create.game", function(data) {
        let game = {};
        console.log("game created")
        let players = [];
        let player = rogueplayers.filter(player => player.name = data);
        rogueplayers = rogueplayers.filter(player => player.name !== data)
        players.push(player[0]);
        let cards = boardNumbers.map((number, i) => {
            let card = new Card(number, i);
            return card;
        })
        let board = boardNumbers.map((number, i) => {
            let square = new Square(number, i);
            return square;
        })
        game.players = players;
        game.cards = cards;
        game.board = board;
        game.uniqueID = Math.floor(Math.random() * 99999) + 1
        socket.emit("game.created", game);
        games.push(game)
    });

    // WHEN PLAYER JOINS A GAME - rogueplayer is deleted and moved to the game object
  
    socket.on("join.game", function(data) {
        let game = {}
        games.map(oldgame => {
            if (oldgame.uniqueID == data.game) {
                game = oldgame
            } else {
                console.log("couldn't find that game")
            }
        })
        let newPlayer = new Player (data.name);

        // todo check if game.players exists before crashing
        
        if (game.players.length == 1 || game.players.length == 3) {
            newPlayer.color = "red"
        } else {
            newPlayer.color = "green"
        }
        console.log("new player:", newPlayer.name)
        game.players.push(newPlayer)
        io.emit("game.joined", game);
    });

    // TODO: add disconnect logic to tick that disconnect Bool in the relevant game for the relevant player

    socket.on("disconnect", () => {// Bind event for that socket (player)
        console.log("Client disconnected. ID: ", socket.id);
        io.sockets.emit("clientdisconnect", socket.id);
    });

    // WHEN CARDS ARE DEALT

    //TODO: map over only the cards that are remaining, cuz sometimes one player will only get 3 cards.

    socket.on("deal.cards", function(data) {
        let availableCards = data.cards.filter(card => card.location === "deck");
        data.players.map(player => {
            i = 0
            while (i < 4) {
                let randomNumber = Math.floor(Math.random() * availableCards.length);
                let cardNumber = availableCards[randomNumber].displayNumber
                let card2deal = data.cards.filter(card => card.displayNumber === cardNumber)
                card2deal[0].location = player.name;
                availableCards = availableCards.filter(card => card.displayNumber !== cardNumber)
                console.log(availableCards.length)
                i++
            }
        })
        io.emit("cards.dealt", data)
        console.log(data)
    });

    // Event for when any player plays a card

    socket.on("play.card", function(data) {
        io.emit("turn.over", data);
        console.log(data)
    });

    // Event for when any player makes a move
    socket.on("pickup.card", function(data) {
        io.emit("turn.over", data); // Emit for the player who made the move
    });
});


// WHEN PLAYERS MARK THE GAME AS COMPLETE - send the game object to the DB and delete it from the server

