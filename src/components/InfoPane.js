import React from 'react'
import CardHand from './CardHand'

const style = {
    borderRadius: '10px',
    width: '20vw',
    height: '20vh',
    margin: '0 left'
}



const InfoPane = ({ pickUp, cards, game, myPlayer, onClick, selected }) => (
    <div style={style}>
        {game.players.map((player, i) => (
            player.isActive ?
            <p>It is {player.color}'s turn</p>
            :
            <p></p>
        ))}
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