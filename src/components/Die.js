import React from "react"

export default function Die(props) {
    const dieStyleElement = {1: "first", 2: "second", 3: "third", 4: "fourth", 5: "fifth", 6: "fourth"}
    const dieElements = []

    let maxCol = 2
    let iterator = 0
    const dieValue = props.value

    if(dieValue < 4){
        for(iterator = 0; iterator < dieValue; iterator++)
            dieElements.push(<span key={iterator} className="dot"></span>)
    }
    else{
        for(iterator = 0; iterator < maxCol; iterator++) {
            const tempElements = []
            for(let i = 0; i < parseInt(dieValue / 2); i++)
                tempElements.push(<span key={i} className="dot"></span>)

            dieElements.push(<div key={iterator} className="column">{tempElements}</div>)
            if(dieValue === 5 && !iterator) {
                dieElements.push(<div key={iterator + 1} className="column"><span className="dot"></span></div>)
                maxCol++
                iterator++
            }
        }
    }

    
    return(
        <div className={`${dieStyleElement[dieValue]}-face die ` + (props.isHeld ? "held" : "")} onClick={props.dieHandler}>
            {dieElements}
        </div>
    )    
}







        // <span onClick={props.dieHandler}
        // className={"die " + (props.isHeld && "held")}><h1 >{props.value}</h1></span>