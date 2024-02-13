import { useState } from "react"

import Player from "./components/Player"
import GameBoard from "./components/GameBoard"
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const PLAYERS ={
  X: 'Player 1',
  O: 'Player 2'
}

const initialGameboard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';

  if(gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, players){
  let winner;      // Checking for a win is done here.
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      winner = players[firstSquareSymbol];
    } 
  }
  return winner;
}


function deriveGameBoard(gameTurns){
  // creating a copy of the initialGameboard to avoid mutation issues when updating state
  let gameBoard = [...initialGameboard].map((innerArray) => [...innerArray])
  for(const turn of gameTurns) {
    const {square, player} = turn; //  Each 'turn' is a tuple containing the square and the player who played there.
    const {row, col} =  square; //  Get the row and column from the user's click.

    gameBoard[row][col] = player;   // Place the next piece in the game board.
  }
  return gameBoard;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(PLAYERS);

  const activePlayer = deriveActivePlayer(gameTurns); // derive the player who should make their move based on whose turn it is
  const gameBoard = deriveGameBoard(gameTurns);
  const winner =  deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectedPlayer(rowIndex, colIndex){
    //setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O' : 'X');
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns); 
      
      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer},
        ...prevTurns,
      ];
      
      return updatedTurns;
    })  
  }

  function handlePlayerNameChange(symbol, newPlayerName){
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newPlayerName
      };
    });
  }

  function handleRestart(){
    setGameTurns([]);
  }
    //console.log("Game Turns", gameTurns);
  return (
    <main>
      <div id="game-container" >
        <ol id="players" className="highlight-player" >         
          <Player 
            initialName={PLAYERS.X} 
            symbol="X" isActive={activePlayer === 'X'} 
            onChangeName={handlePlayerNameChange} 
          />
          <Player 
            initialName={PLAYERS.O} 
            symbol="O" isActive={activePlayer === 'O'} 
            onChangeName={handlePlayerNameChange} 
          />
        </ol>

        { (winner || hasDraw) ? <GameOver winner={winner} onRestart={handleRestart} />  : null }
        <GameBoard 
          onSelectSquare={handleSelectedPlayer} 
          board={gameBoard}
        />
      </div>

      <Log turns={gameTurns}/>
    </main>
  )
}

export default App
