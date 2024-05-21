import React, { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [start, setStart] = useState(initialIndex)
  const [clicks, setClicks] = useState({})



  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const coordinates = []
    let startpoint = 1
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const column = i % 3;
      const x = column + startpoint;
      const y = row + startpoint;
      coordinates.push({ x, y })
    }
    let result = coordinates[start]
    return (`${result.x}, ${result.y}`)
  }


  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinateMessage = `Coordinates (${getXY()})`
    return coordinateMessage
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setStart(initialIndex)
    setClicks({})
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(start, direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const gridSize = 3;

    const row = Math.floor(start / gridSize);
    const column = start % gridSize

    switch (direction) {
      case 'left':
        if (column > 0) {
          return start - 1;
        }
        break;
      case 'right':
        if (column < gridSize - 1) {
          return start + 1;
        }
        break;
      case 'up':
        if (row > 0) {
          return start - gridSize;
        }
        break;
      case 'down':
        if (row < gridSize - 1) {
          return start + gridSize;
        }
        break;
      default:
        break;
    }

    return start;


  }

  function move(evt) {
    evt.preventDefault();
    const direction = evt.target.id;
    setStart((prevIndex) => {
      const nextIndex = getNextIndex(prevIndex, direction);
      if (nextIndex === prevIndex) {
        setMessage(`You can't go ${direction}`);
      } else {
        setSteps(steps + 1);
        setMessage('');
      }
      return nextIndex;
    });
  }
  

  function onChange(evt) {
    evt.preventDefault();
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const payload = {
      x: (start % 3) + 1,
      y: Math.floor(start / 3) + 1,
      steps,
      email,
    };
  
    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const { message } = await response.json();
      setMessage(message);
      setEmail('')
      
    } catch (error) {
      setMessage(error.message);
      console.error('There was an error!', error);
    }
  }
  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{steps === 1 ? `You moved ${steps} time` :`You moved ${steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === start ? ' active' : ''}`}>
              {idx === start ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit} data-testid='submitform'>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
