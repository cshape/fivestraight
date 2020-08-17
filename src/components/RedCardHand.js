import React from 'react'
import Card from './Card'

const RedCardHand = ({ cards, number, onClick, selected }) => {
    let color = '2px solid darkblue'
    let amISelected = () => {
      if (number == selected) {
        color = '4px solid red'
      }
    }
    amISelected()
    return <div>
        {cards[1].numbers.map((number, i) => (
            <Card selected={selected} color={color} displayNumber={number} key={i} number={i} onClick={() => onClick(number)} />
        ))}
    </div>
}

export default RedCardHand