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
        socket.on('turn.over', function (data) {
            console.log (data);
        });
        socket.on('name.chosen', function (data) {
            console.log (data);
        });
        socket.on('game.created', function (data) {
            setGame(data);
            setMyPlayer("green")
        });
        socket.on('game.joined', function (data) {
            setGame(data);
            setMyPlayer("red")
        });
        socket.on('cards.dealt', function (data) {
            setGame(data);
            setisAGame(true);
            console.log(game)
            console.log(myPlayer)
        });
        socket.on('turn.over', function (data) {
            setGame(data);
            console.log(game)
            setSelectedCard(null)
            console.log(myPlayer)
        });
      }, []);
    
    const handleClick = (square) => {
        if (selectedCard == null) return;
        if (selectedCard > square.displayNumber) return;
        game.cards.map(card => {
            if (card.displayNumber === selectedCard) {
                card.location = "board";
            }
        })
        game.board.map(DBsquare => {
            if (DBsquare.displayNumber === square.displayNumber) {
                DBsquare.color = myPlayer;
            }
        })
        console.log(game)
        socket.emit('move.made', game)
    }

    const handleCardSelect = (number) => {
        setSelectedCard(number)
        console.log(selectedCard)
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
        socket.emit('join.game', data)
    }

    const dealCards = () => {
        socket.emit('deal.cards', game)
    }

    const pickupCard = () => {
        console.log("TODO: this shit")
    }



    return (
        <>{}
        <>
        {isAGame ?
            <div styles={styles}>
             <Board squares={game.board} onClick={handleClick} />
            <InfoPane selected={selectedCard} 
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