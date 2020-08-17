import React from 'react'

const Card = ({ number, onClick, selected }) => {
    let color = '2px solid darkblue'
    let amISelected = () => {
      if (number == selected) {
        color = '4px solid red'
      }
    }
    amISelected()
    return <button
    style={{
        border: `${color}`,
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