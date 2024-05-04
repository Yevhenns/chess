import { useEffect } from 'react';
import {
  Chessboard,
  FEN,
  INPUT_EVENT_TYPE,
  BORDER_TYPE,
  COLOR,
} from '../../../node_modules/cm-chessboard/src/Chessboard.js';
import {
  PROMOTION_DIALOG_RESULT_TYPE,
  PromotionDialog,
} from '../../../node_modules/cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js';
import {
  MARKER_TYPE,
  Markers,
} from '../../../node_modules/cm-chessboard/src/extensions/markers/Markers.js';
import { Accessibility } from '../../../node_modules/cm-chessboard/src/extensions/accessibility/Accessibility.js';
import { Chess } from 'chess.js';

export const Game = () => {
  useEffect(() => {
    const chess = new Chess();

    let seed = 71;
    function random() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }
    function makeEngineMove(chessboard) {
      const possibleMoves = chess.moves({ verbose: true });
      if (possibleMoves.length > 0) {
        const randomIndex = Math.floor(random() * possibleMoves.length);
        const randomMove = possibleMoves[randomIndex];
        setTimeout(() => {
          // smoother with 500ms delay
          chess.move({ from: randomMove.from, to: randomMove.to });
          chessboard.setPosition(chess.fen(), true);
          chessboard.enableMoveInput(inputHandler, COLOR.white);
        }, 500);
      }
    }

    function inputHandler(event) {
      console.log('inputHandler', event);
      if (event.type === INPUT_EVENT_TYPE.movingOverSquare) {
        return; // ignore this event
      }
      if (event.type !== INPUT_EVENT_TYPE.moveInputFinished) {
        event.chessboard.removeLegalMovesMarkers();
      }
      if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
        // mark legal moves
        const moves = chess.moves({ square: event.squareFrom, verbose: true });
        event.chessboard.addLegalMovesMarkers(moves);
        return moves.length > 0;
      } else if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        const move = {
          from: event.squareFrom,
          to: event.squareTo,
          promotion: event.promotion,
        };
        const result = chess.move(move);
        if (result) {
          event.chessboard.state.moveInputProcess.then(() => {
            // wait for the move input process has finished
            event.chessboard.setPosition(chess.fen(), true).then(() => {
              // update position, maybe castled and wait for animation has finished
              makeEngineMove(event.chessboard);
            });
          });
        } else {
          // promotion?
          let possibleMoves = chess.moves({
            square: event.squareFrom,
            verbose: true,
          });
          for (const possibleMove of possibleMoves) {
            if (possibleMove.promotion && possibleMove.to === event.squareTo) {
              event.chessboard.showPromotionDialog(
                event.squareTo,
                COLOR.white,
                result => {
                  console.log('promotion result', result);
                  if (
                    result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected
                  ) {
                    chess.move({
                      from: event.squareFrom,
                      to: event.squareTo,
                      promotion: result.piece.charAt(1),
                    });
                    event.chessboard.setPosition(chess.fen(), true);
                    makeEngineMove(event.chessboard);
                  } else {
                    // promotion canceled
                    event.chessboard.enableMoveInput(inputHandler, COLOR.white);
                    event.chessboard.setPosition(chess.fen(), true);
                  }
                }
              );
              return true;
            }
          }
        }
        return result;
      } else if (event.type === INPUT_EVENT_TYPE.moveInputFinished) {
        if (event.legalMove) {
          event.chessboard.disableMoveInput();
        }
      }
    }

    const board = new Chessboard(document.getElementById('board'), {
      assetsUrl: '../../../node_modules/cm-chessboard/assets/',
      position: FEN.start,
      style: {
        pieces: { file: 'pieces/staunty.svg' },
        cssClass: 'green',
        borderType: BORDER_TYPE.frame,
      },
      extensions: [
        { class: Markers, props: { autoMarkers: MARKER_TYPE.square } },
        { class: PromotionDialog },
        { class: Accessibility, props: { visuallyHidden: true } },
      ],
    });
    board.enableMoveInput(inputHandler, COLOR.white);

    function inputHandler(event) {
      console.log(event);
      if (
        event.type === INPUT_EVENT_TYPE.moveInputStarted ||
        event.type === INPUT_EVENT_TYPE.validateMoveInput
      ) {
        return true;
      }
    }
    console.log(board);
  }, []);

  return (
    <div>
      <p>Game</p>
      <div id="board" />
    </div>
  );
};
