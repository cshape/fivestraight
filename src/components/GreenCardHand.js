import React from 'react'
import Card from './Card'

const GreenCardHand = ({ cards, number, onClick, selected }) => {
    let color = '2px solid darkblue'
    let amISelected = () => {
      if (number == selected) {
        color = '4px solid red'
      }
    }
    amISelected()
    return <div>
        {cards.map((card, i) => (
            <Card selected={selected} color={color} displayNumber={card.displayNumber} key={i} number={number} onClick={() => onClick(number)} />
        ))}
    </div>
}

export default GreenCardHand

