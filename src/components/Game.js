import React, { useState, useEffect } from 'react'
import { calculateWinner } from '../helpers.js'
import Board from './Board'
import InfoPane from './InfoPane'
import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4000";
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
        socket.on('name.chosen', function (data) {
            console.log (data);
        });
        socket.on('game.created', function (data) {
            setGame(data);
            setMyPlayer("green")
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
        if (activePlayer[0].color !== myPlayer) return alert("It's not your turn, homie.");
        if (selectedCard == null) return;
        if (selectedCard > square.displayNumber) return alert(`${selectedCard} is greater than ${square.displayNumber} ya dum-dum.`);
        game.cards.forEach(card => {
            if (card.displayNumber === selectedCard) {
                card.location = "board";
            }
        })
        game.board.forEach(DBsquare => {
            if (DBsquare.displayNumber === square.displayNumber) {
                DBsquare.color = myPlayer;
            }
        })
        game.players.some((player, i) => {
            console.log(player.name, i)
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
        console.log(game)
        socket.emit('play.card', game)
    }

    const handleCardSelect = (number) => {
        setSelectedCard(number)
    }

    const nameSelf = () => {
        let name = prompt("What is your name?");
        socket.emit('choose.name', name)
    }

    const newGame = () => {
        let name = prompt("What is your name?");
        socket.emit('create.game', name)
    }

    const joinGame = () => {
        let name = prompt("What is your name?")
        let game = prompt("Whose game do you want to join?")
        let data = {
            name: name,
            game: game
        }
        setMyPlayer("red");
        socket.emit('join.game', data)
    }

    const dealCards = () => {
        socket.emit('deal.cards', game)
    }

    const pickupCard = () => {
        let activePlayer = game.players.filter(player => player.isActive === true);
        if (activePlayer[0].color !== myPlayer) return alert("It's not your turn, homie.");
        game.players.some((player, i) => {
            console.log(player.name, i)
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
            </div>
            :
            <div></div>
            }
        </>
            
            
            <div style={ButtonStyles}>
                <button onClick={nameSelf}>Name Self</button>
                <button onClick={newGame}>Create Game</button>
                <button onClick={joinGame}>Join Game</button>
                <button onClick={dealCards}>Deal Cards</button>
            </div>
            
            
        </>
    )
}

export default Game