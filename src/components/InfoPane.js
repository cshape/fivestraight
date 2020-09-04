import React from 'react'
import GreenCardHand from './GreenCardHand'
import RedCardHand from './RedCardHand'

const style = {
    borderRadius: '10px',
    width: '20vw',
    height: '20vh',
    margin: '0 left'
}



const InfoPane = ({ pickUp, cards, greenNext, onClick, selected }) => (
    <div style={style}>
        <p>{greenNext ? "It's Green's turn" : "It's Red's turn"}</p>
            {greenNext ? 
            <GreenCardHand cards={cards.filter(card => card.location == "green")} 
            selected={selected} onClick={onClick} 
            /> : 
            <RedCardHand cards={cards.filter(card => card.location == "red")}
            selected={selected} 
            onClick={onClick}  
            />
        }
    <button onClick={pickUp}>
        Pick up
    </button>
    </div>
)

export default InfoPane