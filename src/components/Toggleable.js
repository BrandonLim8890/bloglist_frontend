import React, { useState } from 'react'

const Toggleable = props => {
  const [visibility, setVisibility] = useState(true)

  const showOnVisibile = { display: visibility ? '' : 'none' }
  const hideOnVisibile = { display: visibility ? 'none' : '' }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  return (
    <div>
      <div style={showOnVisibile}>
        <button onClick={toggleVisibility} >{props.buttonLabel}</button>
      </div>
      <div style={hideOnVisibile}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )

}

export default Toggleable