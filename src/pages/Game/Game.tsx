import { useEffect } from 'react';
import { Chessboard, FEN, INPUT_EVENT_TYPE } from '../../../node_modules/cm-chessboard/src/Chessboard.js'

export const Game = () => {
  useEffect(() => {
    const board = new Chessboard(document.getElementById("board"), {
      assetsUrl: "../../../node_modules/cm-chessboard/assets",
      position: FEN.start
    })
    // console.log(board)
    board.enableMoveInput(inputHandler) // This enables the move input

    function inputHandler(event) {
      console.log(event)
      if (event.type === INPUT_EVENT_TYPE.moveInputStarted ||
        event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        return true // false cancels move
      }
    }
    console.log(board)
  }, [])

  return (
    <div>
      <p>Game</p>
      <div id="board" />
    </div>
  );
};
