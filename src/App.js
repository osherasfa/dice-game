import React from 'react';
import Die from './components/Die'
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'
import {useWindowSize} from 'react-use';
import './App.css';

export default function App() {
  const [dice, setDice] = React.useState(initializeDice())
  const [tenzies, setTenzies] = React.useState(false)
  const {width, height} = useWindowSize();

  /* Checking dice and determining if user won*/
  React.useEffect(() => {
    let diceSame = true
    let diceHeld = true

    dice.map(die => {
      if(dice[0].value !== die.value)
        diceSame = false
      if(!die.isHeld)
        diceHeld = false
      return null
    })
    diceSame && diceHeld && setTenzies(true) // If all held and same, Announce about wining
  },[dice])

  /* Return new single die object */
  function generateNewDie() {
    return {id:nanoid() , value:Math.ceil(Math.random() * 6), isHeld: false}
  }

  /* Initialize new Dice */
  function initializeDice() {
    const newDice = []
    for(let i = 0; i < 10; i++)
      newDice.push(generateNewDie())
    return newDice
  }

  /* Changing isHeld property by match id */
  function dieHandler(id) {
    !tenzies && setDice(prevDice => prevDice.map(die => (die.id === id ? {...die, isHeld: !die.isHeld} : die)))
  }

  /* Generating new Dice (execpt for holding die) */
  function randomizerDice() {
    setDice(prevDice => prevDice.map(die => { return die.isHeld ? die : generateNewDie() }))
  }
  
  /* Set New Game  */
  function generateNewGame() {
    setDice(initializeDice())
    setTenzies(false)
  }

  /* Organizing data into JSX element */
  const diceElements = dice.map(die => {
    return <Die 
              key={die.id} 
              isHeld={die.isHeld} 
              value={die.value} 
              dieHandler={() => dieHandler(die.id)}
            />
  })

  return (
    <React.Fragment>
      {tenzies && <Confetti width={width} height={height}/>} 
      <div className='dice-container'>
          <h1 className='dice-title'>Tenzies</h1>
          <p className='dice-description'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className='dice'>{diceElements}</div>
          <button className='dice-button' onClick={tenzies ? generateNewGame : randomizerDice}>{tenzies ? "Reroll" : "Roll"}</button>
      </div>
    </React.Fragment>
  );
}

