import React from 'react'

const Square = ({ onClick, displayNumber, color }) => {
    return <button
    style={{
        background: `${color}`,
        border: '2px solid darkblue',
        fontSize:  '30px',
        fontWeight: '800',
        cursor: 'pointer',
        outline: 'none'
      }}        
        onClick={onClick}>
        {displayNumber}
    </button>
}

export default Square