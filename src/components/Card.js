import React from 'react'

const Card = ({ number, onClick }) => {
    return <button
    style={{
        border: '2px solid darkblue',
        fontSize:  '30px',
        fontWeight: '800',
        cursor: 'pointer',
        outline: 'none'
      }}        
      onClick={onClick}
      >
        {number}
    </button>
}

export default Card