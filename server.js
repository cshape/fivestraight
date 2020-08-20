const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const port = process.env.PORT || 4000;

const server = http.Server(app).listen(8080);
const io = socketIo(server);

const rogueplayers = [];
const game = {};

const board = [
    73, 72, 71, 70, 69, 68, 67, 66, 65, 0,
    74, 57, 58, 59, 60, 61, 62, 63, 64, 99,
    75, 56, 21, 20, 19, 28, 17, 36, 37, 98,
    76, 55, 22, 13, 14, 15, 16, 35, 38, 97,
    77, 54, 23, 12, 1, 4, 5, 34, 39, 96,
    78, 53, 24, 11, 2, 3, 6, 33, 40, 95,
    79, 52, 25, 10, 9, 8, 7, 32, 41, 94,
    80, 51, 26, 27, 28, 29, 30, 31, 42, 93,
    81, 50, 49, 48, 47, 46, 45, 44, 43, 92,
    82, 83, 84, 85, 86, 87, 88, 89, 90, 91
]

const Player = (name, id) => {
    this.name = name;
    this.id = id;
    this.color = '';
    this.isActive = false;
    this.isConnected = true;
}

// WHEN PLAYERS VISIT THE PAGE - they choose their name (or if their localStorage has a name we use that) and then can start a new game or join an existing one

io.on("connection", function(socket) {
    
    let newPlayer = new Player (socket.name, socket.id);
    rogueplayers.push(newPlayer)
    console.log("New client connected. ID: ", socket.id);

    // TODO: add disconnect logic to tick that disconnect Bool in the relevant game for the relevant player

    socket.on("disconnect", () => {// Bind event for that socket (player)
        console.log("Client disconnected. ID: ", socket.id);
        socket.broadcast.emit("clientdisconnect", id);
    });


    // Event for when any player makes a move
    socket.on("make.move", function(data) {
       // check if it was a pickup or put down and update shit
        socket.broadcast.emit("move.made", data); // Emit for the player who made the move
    });

    // Event to inform player that the opponent left
    socket.on("disconnect", function() {
       // update the object and then display error
    });
});

// WHEN PLAYERS ENTER THEIR NAME - client sends name, server starts a socket connection and creates a temp top level rogueplayer object for them with name and id

// WHEN PLAYER CREATES A GAME - a new game object is created and populated, rogueplayer is deleted and moved to the game object

// WHEN PLAYER JOINS A GAME - rogueplayer is deleted and moved to the game object

// WHEN PLAYER DISCONNECTS - shift them to disconnected status and display error message

// WHEN PLAYER COMPLETES A TURN - update the game object and send it to the client as the state

// WHEN PLAYERS MARK THE GAME AS COMPLETE - send the game object to the DB and delete it from the server

