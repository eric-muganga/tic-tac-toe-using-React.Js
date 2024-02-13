
import { useState } from "react";

export default function Player({initialName, symbol, isActive, onChangeName}){

    const [playerName, setPlayerName] = useState(initialName)
    const [isEditing, setIsEditing] =useState(false);

    function handleEditClick(){
        setIsEditing(editButtonState => !editButtonState);
        if(isEditing){
            onChangeName(symbol, playerName);
        }
        
    }

    function handleChange(event){
        setPlayerName(event.target.value);

    }


    let playerContent = <span className="player-name">{playerName}</span>
    if(isEditing){
        playerContent = <input type="text" required value={playerName} onChange={handleChange}/>;
    }

    return(
        <li className={isActive ? 'active' : undefined}>
            <span className="player">
                { playerContent }
              <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
          </li>
    );
}