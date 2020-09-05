import React from 'react'
import CardHand from './CardHand'

const style = {
    borderRadius: '10px',
    width: '20vw',
    height: '20vh',
    margin: '0 left'
}



const InfoPane = ({ pickUp, cards, greenNext, myPlayer, onClick, selected }) => (
    <div style={style}>
        <p>{greenNext ? "It's Green's turn" : "It's Red's turn"}</p>
            <CardHand 
            myPlayer={myPlayer} 
            cards={cards}
            selected={selected} 
            onClick={onClick}  
            />
    <button onClick={pickUp}>
        Pick up
    </button>
    </div>
)

export default InfoPane