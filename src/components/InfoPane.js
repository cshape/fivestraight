import React from 'react'
import Card from './Card'
import GreenCardHand from './GreenCardHand'
import RedCardHand from './RedCardHand'

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
            {greenNext ? 
            <GreenCardHand cards={cards} selected={selected} onClick={onClick} /> : 
            <RedCardHand cards={cards} selected={selected} onClick={onClick}  />
            // todo make the cards show up in those components
        }
    </div>
)

export default InfoPane