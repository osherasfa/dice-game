import React from 'react';
import Die from './components/Die'
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'
import {useWindowSize} from 'react-use';
import './App.css';

export default function App() {
  const [dice, setDice] = React.useState(initializeDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [counter, setCounter] = React.useState(0)
  const [timer, setTimer] = React.useState(formatTime(0))
  const {width, height} = useWindowSize();
  let start = Date.now();

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

    if(diceSame && diceHeld){ // If all held and same, Announce about wining
      const localCounter = JSON.parse(localStorage.getItem("counter"))
      const localTimer =  localStorage.getItem("timer")
      let bestCounter = localCounter
      let bestTimer = localTimer

      if(localCounter === null || counter < localCounter){
        localStorage.setItem("counter", JSON.stringify(counter))
        bestCounter = counter
      }

      if(localTimer === null || timer < localTimer){
        localStorage.setItem("timer", timer)
        bestTimer = timer
      }

      setCounter(bestCounter)
      setTimer(bestTimer)
      setTenzies(true)
    }
  },[dice])


  React.useEffect(() => {
    if(!tenzies) {
    const interval = setInterval(() => {
      let delta = Date.now() - start; // milliseconds elapsed since start
      let elapsedTime = Math.floor(delta / 1000)
      setTimer(formatTime(elapsedTime)); // in seconds
    }, 1000);

    return () => clearInterval(interval);
  }
  }, [tenzies]);


  /* Formatting time in number to HH:MM:SS format string*/
  function formatTime(time) {
    let hours   = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = time - (hours * 3600) - (minutes * 60);

    if (hours   < 10)
      hours   = "0" + hours
    if (minutes < 10)
      minutes = "0" + minutes
    if (seconds < 10)
      seconds = "0" + seconds

    return hours + ':' + minutes + ':' + seconds
  }

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
    setCounter(prevCounter => prevCounter + 1)
  }
  
  /* Set New Game  */
  function generateNewGame() {
    setDice(initializeDice())
    setTenzies(false)
    setCounter(0)
    setTimer(formatTime(0))
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
          <p className='dice-records'>{tenzies && "BEST:"} Rolls:{counter} Time:{timer}</p>
          <button className='dice-button' onClick={tenzies ? generateNewGame : randomizerDice}>{tenzies ? "Reroll" : "Roll"}</button>
      </div>
    </React.Fragment>
  );
}

