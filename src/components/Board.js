import React from 'react'
import Square from './Square'

const style = {
    borderRadius: '10px',
    width: '60vw',
    height: '60vh',
    margin: '0 auto',
    display: 'grid',
    gridTemplate: 'repeat(10, 1fr) / repeat(10, 1fr)'
}

const Board = ({ squares, onClick }) => (
    <div style={style}>
        {squares.map((square, i) => (
            <Square 
                color={square.color} 
                displayNumber={square.displayNumber} 
                key={i} number={square.number} 
                onClick={() => onClick(square)} 
            />
        ))}
    </div>
)

export default Board