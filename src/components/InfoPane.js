import React from 'react'
import Card from './Card'

const style = {
    borderRadius: '10px',
    width: '20vw',
    height: '20vh',
    margin: '0 left',
    margin: '0 top'
}

const InfoPane = ({ cards, greenNext, onClick, selected }) => (
    <div style={style}>
        <p>{greenNext ? "It's Green's turn" : "It's Red's turn"}</p>
        {cards.map((card, i) => (
            <Card selected={selected}
                  key={i} 
                  number={card} 
                  onClick={() => onClick(card)} 
            />
        ))}
    </div>
)

export default InfoPane