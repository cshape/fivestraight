import React from 'react'
import Card from './Card'

const CardHand = ({ cards, number, onClick, myPlayer, selected }) => {
    let color = '2px solid darkblue'
    let amISelected = () => {
      if (number === selected) {
        color = '4px solid red'
      }
    }
    amISelected()
    return <div>
         {
         // eslint-disable-next-line
         cards.map((card, i) => {
           if (card.location === myPlayer ) {
            return <Card selected={selected} color={color} displayNumber={card.displayNumber} key={i} number={card.number} onClick={() => onClick(card.displayNumber)} />
           }
         }
        )}
    </div>
}

export default CardHand