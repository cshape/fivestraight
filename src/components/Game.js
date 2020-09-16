import React, { useState, useEffect } from 'react'
import Board from './Board'
import InfoPane from './InfoPane'
import io from "socket.io-client";
const ENDPOINT = "https://fivestraightserver.herokuapp.com/";
// const ENDPOINT = "http://127.0.0.1:4000"
const socket = io(ENDPOINT);

const styles = {
    width: '200px',
    position: 'absolute',
    top: '0',
    left: '0'
}

const ButtonStyles = {
    flex: 1,
    flexDirection: 'column'
}

const Game = () => {
    const [selectedCard, setSelectedCard] = useState(null)
    const [myPlayer, setMyPlayer] = useState('')
    const [game, setGame] = useState({})
    const [isAGame, setisAGame] = useState(false)

    useEffect(() => {
        socket.on('game.created', function (data) {
            setGame(data);
            console.log(data)
            setisAGame(true); 
        });
        socket.on('game.joined', function (data) {
            setGame(data);
        });
        socket.on('cards.dealt', function (data) {
            setGame(data);
            setisAGame(true); 
        });
        socket.on('turn.over', function (data) {
            setGame(data);
            setSelectedCard(null)
        });
      }, []);
    
    const playCard = (square) => {
        let activePlayer = game.players.filter(player => player.isActive === true);
        if (activePlayer[0].name !== myPlayer) return alert("It's not your turn, homie.");
        if (selectedCard == null) return;
        if (selectedCard > square.displayNumber) return alert(`${selectedCard} is greater than ${square.displayNumber} ya dum-dum.`);
        // eslint-disable-next-line
        game.cards.forEach(card => {
            if (card.displayNumber === selectedCard) {
                card.location = "board";
            }
        })
        // eslint-disable-next-line
        game.board.forEach(DBsquare => {
            if (DBsquare.displayNumber === square.displayNumber) {
                DBsquare.color = activePlayer[0].color;
            }
        })
        // eslint-disable-next-line
        game.players.some((player, i) => {
            console.log(player.name, i)
            if (player.isActive === true) {
                game.players[i].isActive = false;
                let nextPlayerNum = i+1;
                if (game.players[nextPlayerNum] !== undefined) {
                    game.players[nextPlayerNum].isActive = true
                    return true;
                } else {
                    game.players[0].isActive = true
                }
            }
        })
        socket.emit('play.card', game)
    }

    const handleCardSelect = (number) => {
        setSelectedCard(number)
    }

    const newGame = () => {
        let name = prompt("What is your name?");
        setMyPlayer(name)
        socket.emit('create.game', name)
    }

    const joinGame = () => {
        let name = prompt("What is your name?")
        let game = prompt("What is the unique ID of the game you're joining?")
        let data = {
            name: name,
            game: game
        }
        setMyPlayer(data.name);
        console.log(data.game)
        socket.emit('join.game', data)
    }

    const dealCards = () => {
        socket.emit('deal.cards', game)
    }

    const pickupCard = () => {
        let activePlayer = game.players.filter(player => player.isActive === true);
        if (activePlayer[0].name !== myPlayer) return alert("It's not your turn, homie.");
        // todo don't let them pick up if they have 4 cards
        game.players.forEach(player => {
            if (player.isActive === true) {
                let availableCards = game.cards.filter(card => card.location === "deck");
                let randomNumber = Math.floor(Math.random() * availableCards.length);
                let cardNumber = availableCards[randomNumber].displayNumber
                let card2deal = game.cards.filter(card => card.displayNumber === cardNumber)
                card2deal[0].location = player.name;
                }
            })
        // eslint-disable-next-line
        game.players.some((player, i) => {
            console.log(player.name, i)

            // set the active player to be the next player, 
            // or if we're already on the last player, set it to the first player

            if (player.isActive === true) {
                game.players[i].isActive = false;
                let nextPlayerNum = i+1;
                console.log(game.players[nextPlayerNum])
                if (game.players[nextPlayerNum] !== undefined) {
                    game.players[nextPlayerNum].isActive = true
                    return true;
                } else {
                    console.log(game.players[0])
                    game.players[0].isActive = true
                }
            }
        })
        socket.emit('pickup.card', game)
    }


    return (
        <>{}
        <>
        {isAGame ?
            <div styles={styles}>
             <Board squares={game.board} onClick={playCard} />
            <InfoPane 
                      game={game}
                      selected={selectedCard} 
                      cards={game.cards} 
                      onClick={handleCardSelect}
                      pickUp={pickupCard}
                      myPlayer={myPlayer}
                      />
            <p>The ID for this game is {game.uniqueID}</p>
            <h1>Players:</h1>
            {
                game.players.map(player => (
                        <p>{player.name}: {player.color}</p>
                ))
            }
            </div>
            :
            <div>Welcome to 5Straight </div>
            }
        </>
            
            
            <div style={ButtonStyles}>
                <button onClick={newGame}>Create Game</button>
                <button onClick={joinGame}>Join Game</button>
                <button onClick={dealCards}>Deal Cards</button>
            </div>
            
            
            
        </>
    )
}

export default Game