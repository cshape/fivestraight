import React, { useState } from 'react'
import { calculateWinner } from '../helpers.js'
import Board from './Board'
import InfoPane from './InfoPane'

const styles = {
    width: '200px',
    position: 'absolute',
    top: '0',
    left: '0'
}

const Game = () => {

    const [players, setPlayers] = useState(["green", "red"])
    const [board, setBoard] = useState(Array(100).fill(null))
    const [loaded, setLoaded] = useState(false)
    const [greens, setGreens ] = useState(Array(1).fill(null))
    const [reds, setReds] = useState(Array(1).fill(null))
    const [greenIsNext, setgreenIsNext] = useState(true)
    const [Cards, setCards] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)
    const [myPlayer, setMyPlayer] = useState('')

    const winner = calculateWinner(board)
    const actualNumbers = [
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

    const availableCards = [
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

    let createSquares = () => {
        if (loaded == true) return;
        let newArray = [] 

        actualNumbers.map((number, i) => {
            var sqr = new Object()
            sqr.displaynumber = number;
            sqr.id = i;
            sqr.color = 'lightblue';
            newArray.push(sqr)
        })
        setBoard([...newArray])
        let cardsClone = [];
        let greenCardObj = {};
        let redCardObj = {};
        let greenCards = [];
        let redCards = [];
        for (var i = 3; i >= 0; i--) {
            let pickup = availableCards.splice(Math.floor(Math.random() * availableCards.length), 1);
            greenCards = [...greenCards, ...pickup]
            greenCardObj.name = 'green';
            greenCardObj.numbers = greenCards;
          }
        for (var i = 3; i >= 0; i--) {
            let pickup = availableCards.splice(Math.floor(Math.random() * availableCards.length), 1);
            redCards = [...redCards, ...pickup]
            redCardObj.name = 'red';
            redCardObj.numbers = redCards;
          }
        cardsClone.push(greenCardObj)
        cardsClone.push(redCardObj)
        setCards(cardsClone)
        setLoaded(true)
    }

    createSquares();
    
    const handleClick = (i, square) => {
        const boardCopy = [...board]
        // if user clicks an occupied square or if game is won, return
        calculateWinner(board)
        if (winner) return;
        if (reds.includes(i)) return;
        if (greens.includes(i)) return;
        if (selectedCard == null) return;
        if (selectedCard > square.displaynumber) return;
        if (greenIsNext === true) {
            setGreens(greens.concat(i))
            boardCopy.map((square) => {
                if (square.id == i) {
                    square.color = 'green'
                }
            })
        } else {
            setReds(reds.concat(i))
            boardCopy.map(square => {
                if (square.id == i) {
                    square.color = 'red'
                }
            })
        }
        console.log(selectedCard)
        setSelectedCard(null)
        setBoard(boardCopy);
        if (greenIsNext == true) {
            let newCards = Cards[0].numbers.filter(number => number !== selectedCard)
            let newCardObj = Cards;
            newCardObj[0].numbers = newCards;
            setCards(newCardObj)
            console.log("green: ", newCards)
        } else {
            let newCards = Cards[1].numbers.filter(number => number !== selectedCard)
            let newCardObj = Cards;
            newCardObj[1].numbers = newCards;
            setCards(newCardObj)
            console.log("red: ", newCards)
        }
        let newCards = Cards.filter(card => card.numbers !== selectedCard)
        setgreenIsNext(!greenIsNext)
        // setCards(newCards)
        console.log(board)
        console.log(Cards)
    }

    const handleCardSelect = (number) => {
        setSelectedCard(number)
        console.log(selectedCard)
    }

    const pickupCard = () => {
        let cardsClone = [];
        let greenCards = Cards[0];
        let redCards = Cards[1];
        let pickupNumber = availableCards.splice(Math.floor(Math.random() * availableCards.length), 1);
        console.log(pickupNumber)
        if (greenIsNext) {
            greenCards.numbers.push(pickupNumber)
            console.log(greenCards.numbers)
            console.log(greenCards)
        } else {
            redCards.numbers.push(pickupNumber)
            console.log(redCards)
        }
        cardsClone.push(greenCards)
        cardsClone.push(redCards)
        setCards([...cardsClone])
        setgreenIsNext(!greenIsNext)
    }

    return (
        <>{}
            <Board squares={board} onClick={handleClick} />
            <div styles={styles}>
                <InfoPane selected={selectedCard} 
                          cards={Cards} 
                          greenNext={greenIsNext} 
                          onClick={handleCardSelect}
                          pickUp={pickupCard}
                          />
            </div>
        </>
    )
}

export default Game