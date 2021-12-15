// js
import React, { useEffect } from 'react';
import reactDom from 'react-dom';
import './index.css'

const shuffle = (arr) => { return arr.sort(() => Math.round(Math.random() * 100) - 50); }

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = this.initialBoard(3,"you")
  }

  initialBoard = (size, first) => {
    let state = {boardSize: size,
    numRed: 0,
    numBlue: 0,
    turn: "red",
    title:"",
    firstTurn: first,
    gameOver: false,
    winMessage: "",
    lineCoordinates: {},
    boxColors: {},
    lastLine: null
  }
  for (let i=0; i<2; i++){
    for (let j=0; j<state.boardSize+1; j++) {
      for (let k=0; k<state.boardSize; k++) {
        state.lineCoordinates[i+","+j+","+k]=0
      }
    }
  }
  for (let i=0; i< state.boardSize; i++) {
    for (let j=0; j< state.boardSize; j++) {
      state.boxColors[i+","+j] = "rgb(255,255,255)"
    }
  }
  return state
}

  fillLine = (currentCoord) => {
    let changes = JSON.parse(JSON.stringify(this.state));
    if (this.state.lineCoordinates[currentCoord] === 0) {
      //event.target.style.backgroundColor =  this.state.turn
      let newState=this.state.lineCoordinates
      newState[currentCoord] = this.state.turn === "red"? 1 : -1
      changes= {...changes,
        lineCoordinates: newState,
        lastLine: currentCoord
      }
      var splitCoord=currentCoord.split(',')
      var i = splitCoord[0]
      var j = splitCoord[1]
      var k = splitCoord[2]

      let newBoxColors = this.state.boxColors

      var madeSquare = 0
      if (i === "0") {
        if (this.checkSquare(j,k) === 4) {
          madeSquare = 1
          newBoxColors[j+','+k] =  (this.state.turn ==="red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"
          changes = {
            ...changes,
            numRed: (changes.turn ==="red") ? changes.numRed+1 : changes.numRed,
            numBlue: (changes.turn ==="blue") ? changes.numBlue+1 : changes.numBlue,
            boxColors: newBoxColors,
          }
        }
        if (this.checkSquare(parseFloat(j)-1,k) === 4) {
          madeSquare = 1
          newBoxColors[(parseFloat(j)-1)+','+k] = (changes.turn ==="red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"
          changes = {
            ...changes,
            numRed: (changes.turn ==="red") ? changes.numRed+1 : changes.numRed,
            numBlue: (changes.turn ==="blue") ? changes.numBlue+1 : changes.numBlue,
            boxColors: newBoxColors,
          }
        }
      } else {
        if (this.checkSquare(k,j) === 4) {
          madeSquare = 1
          newBoxColors[k+','+j] = (changes.turn ==="red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"
          changes = {
            ...changes,
            numRed: (changes.turn ==="red") ? changes.numRed+1 : changes.numRed,
            numBlue: (changes.turn ==="blue") ?changes.numBlue+1 : changes.numBlue,
            boxColors: newBoxColors,
          }
        }
        if (this.checkSquare(k,parseFloat(j)-1) === 4) {
          madeSquare = 1
          newBoxColors[k+','+(parseFloat(j)-1)] = (changes.turn ==="red") ? "rgba(255,0,0,0.5)" : "rgba(0,0,255,0.5)"
          changes = {
            ...changes,
            numRed: (changes.turn ==="red") ? changes.numRed+1 : changes.numRed,
            numBlue: (changes.turn ==="blue") ? changes.numBlue+1 : changes.numBlue,
            boxColors: newBoxColors,
          }
        }
      }
      if (madeSquare === 0) {
        changes = {...changes,
          turn: changes.turn === "red" ? "blue" : "red",
        }
      } else {
        const isGameOver = changes.numRed+changes.numBlue === changes.boardSize**2;
        changes = {...changes,
          winMessage: !isGameOver? false : changes.numBlue > changes.numRed? "blue":"red",
          gameOver: isGameOver
        }
      }
    }
    this.setState({...changes},()=>{
      if((this.state.firstTurn==="computer"&&changes.turn==="red"||
      this.state.firstTurn==="you"&&changes.turn==="blue")&&!this.state.gameOver)
        this.goComputer();
    });
    return changes;
  }
  checkSquare = (j,k) => {
    var checker1 = Math.abs(this.state.lineCoordinates['0,'+j+','+k])
    var checker2 = Math.abs(((parseFloat(j)+1))>this.state.boardSize ? 0 : this.state.lineCoordinates['0,'+(parseFloat(j)+1)+','+k])
    var checker3 = Math.abs(this.state.lineCoordinates['1,'+k+','+j])
    var checker4 = Math.abs(((parseFloat(k)+1))>this.state.boardSize ? 0 : this.state.lineCoordinates['1,'+(parseFloat(k)+1)+','+j])
    return checker1+checker2+checker3+checker4
  }

  checkGameOver = () => {
    this.setState((prevState) =>   ({
      winMessage: (prevState.numRed+prevState.numBlue === prevState.boardSize**2)? this.makeWinMessage(prevState) : ""
    }))
  }

  makeWinMessage = (state) => {
    var winMessage
      if (state.numRed > state.numBlue) {
        winMessage = "Red wins! Select a board size to start a new game."
      } else if (state.numRed < state.numBlue) {
        winMessage = "Blue wins! Select a board size to start a new game."
      } else {
        winMessage = "Draw! Select a board size to start a new game."
      }
      return (winMessage)
  }

  selectColor = (int) => {
    if (int===0) {
      return ("rgb(255,255,255)")
    } else if (int===1) {
      return ("rgb(255,0,0)")
    } else if (int===-1) {
      return ("rgb(0,0,255)")
    }
  }

  title = (event) => {
    this.setState({title:event.target.dataset.coord})
  }

  tint = (event) => {
    var currentCoord=event.target.dataset.coord
    if (this.state.lineCoordinates[currentCoord] === 0) {
        if (this.state.turn === "red") {
          event.target.style.backgroundColor = "rgba(255,0,0,0.5)"
        } else {
          event.target.style.backgroundColor = "rgba(0,0,255,0.5)"
        }
    }
  }

  untint = (event) => {
    var currentCoord=event.target.dataset.coord
    if (this.state.lineCoordinates[currentCoord] === 0) {
      event.target.style.backgroundColor = "rgb(255,255,255)"
    }
  }

  makeBoard = (boardSize) => {
    var cols=[];
    for (let i=0; i<=2*boardSize; i++) {
      var row=[]
      for (let j=0; j<=2*boardSize; j++) {
        if (i%2 === 0) {
          if (j%2 ===0) {
            row.push(React.createElement("div",
            {className: "dot", id: "dot"+Math.floor(i/2)+","+Math.floor(j/2)}
            ,""))
          } else {
            row.push(React.createElement("div"
              , {className: "horizContainer", "data-coord":"0,"+Math.floor(i/2)+ "," +Math.floor(j/2)
              , onClick:(event)=>this.fillLine(event.target.dataset.coord), style:{backgroundColor: this.selectColor(this.state.lineCoordinates["0,"+Math.floor(i/2)+ "," +Math.floor(j/2)])}
              , onMouseEnter:this.tint, onMouseLeave:this.untint, onMouseHover:this.title}
              , ""))
          }
        } else {
          if (j%2 === 0) {
            row.push(React.createElement("div"
              ,{className: "vertContainer","data-coord":"1,"+Math.floor(j/2)+ "," +Math.floor(i/2)
              , onClick:(event)=>this.fillLine(event.target.dataset.coord), style:{backgroundColor: this.selectColor(this.state.lineCoordinates["1,"+Math.floor(j/2)+ "," +Math.floor(i/2)])}
              , onMouseEnter:this.tint, onMouseLeave:this.untint, onMouseHover:this.title}
              ,""))
          } else {
            row.push(React.createElement("div"
              ,{className: "box", id: "box"+Math.floor(i/2)+','+Math.floor(j/2), style: {backgroundColor: this.state.boxColors[Math.floor(i/2)+','+Math.floor(j/2)]}}
              ,""))

          }
        }
      }
      cols.push(React.createElement("div",{className:"row"},row))
    }
    return (React.createElement("div",{id:"game-board"},cols))
  }
  

  getChilds= ()=>{
    let unusedLines = []
    for (const [key, value] of Object.entries(this.state.lineCoordinates)) {
      if(!value)
        unusedLines.push(key)
    }
    unusedLines = shuffle(unusedLines);
    return unusedLines.map(line => {
      const copyState = JSON.parse(JSON.stringify(this.state));
      const nextStep = new App();
      nextStep.state = copyState;
      const changes = nextStep.fillLine(line);
      nextStep.state = changes;
      return nextStep
    })  }
  getEvaluate(){
      return this.state.numRed- this.state.numBlue
  }
  goComputer(){

    let changes = {}
    do{
      const alpha = {coord:"-1,-1,-1",eval:-Infinity};
      const beta = {coord:"-1,-1,-1",eval:Infinity};
      const best =this.minimax(this, 3,alpha,beta, this.state.firstTurn!=="you")
      this.fillLine(best.coord);
    }while((this.state.firstTurn==="computer"&&changes.turn==="red"||
    this.state.firstTurn==="you"&&changes.turn==="blue")&&!this.state.gameOver);
  }
  minimax(position, depth, alpha, beta, maximizingPlayer){
    if(depth===0)
      return {eval:position.getEvaluate(), coord: position.state.lastLine}
    if(position.state.gameOver)
      return {eval:position.getEvaluate(), coord: position.state.lastLine}
    if(maximizingPlayer){
      let maxEval = {coord:"-1,-1,-1",eval:-Infinity};
      const childs = position.getChilds();
      for(const child of childs){
        const newEval = child.minimax(child, depth -1,alpha, beta, false)
        if(newEval.eval>maxEval.eval)
          maxEval = {eval:newEval.eval,coord: child.state.lastLine}
        if(newEval.eval>alpha.eval)
          alpha = {eval:newEval.eval,coord: child.state.lastLine}
        if(beta.eval<=alpha.eval)
          break
      }
      return maxEval
    }
    else{
      let minEval = {coord:"-1,-1,-1",eval:Infinity};
      const childs = position.getChilds();
      for(const child of childs){
        const newEval = child.minimax(child, depth -1, alpha, beta, true)
        if(newEval.eval<minEval.eval)
          minEval = {eval:newEval.eval,coord: child.state.lastLine}
        if(newEval.eval<beta.eval)
          beta = {eval:newEval.eval,coord: child.state.lastLine}
        if(beta.eval<=alpha.eval)
          break
      }
      return minEval
    }
  }
  firstTurnHandler(event) {
    this.setState(this.initialBoard(this.state.boardSize, event.target.value),()=>{
      if(this.state.firstTurn==="computer")
        this.goComputer();
    })
  }
  render() {
    return (
      <div id="game">
        <h1>{this.state.title}</h1>
        <div id="header">
          <p id="score"> Red({this.state.firstTurn}): {this.state.numRed} Blue({this.state.firstTurn!=="computer"?"computer":"you"}): {this.state.numBlue} </p>
          <p id="winner"> {this.state.winMessage? `Win ${this.state.winMessage}`: ""} </p>
        <label>
        Who goes first
        <div>
          <select value={this.state.firstTurn} onChange={(ev)=>this.firstTurnHandler(ev)}>
            <option value="you">you</option>
            <option value="computer">computer</option>
          </select>
          </div>
        </label>
        </div>
        <div id="board">
          {this.makeBoard(this.state.boardSize)}
        </div>
        <button onClick={()=>this.setState(this.initialBoard(3,this.state.firstTurn),()=>{
      if(this.state.firstTurn==="computer")
        this.goComputer();
    })}>Start new game</button>
      </div>
    );
  }
}

reactDom.render(<App/>,document.getElementById('root'))

