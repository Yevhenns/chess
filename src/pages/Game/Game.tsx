import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Chess } from 'chess.js';
import {
  Chessboard,
  COLOR,
  FEN,
  INPUT_EVENT_TYPE,
  BORDER_TYPE,
} from 'cm-chessboard/src/Chessboard.js';
import { Accessibility } from 'cm-chessboard/src/extensions/accessibility/Accessibility.js';
import {
  MARKER_TYPE,
  Markers,
} from 'cm-chessboard/src/extensions/markers/Markers.js';
import {
  PROMOTION_DIALOG_RESULT_TYPE,
  PromotionDialog,
} from 'cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js';
import { Clock } from '../../components/Clock';
import { Result } from '../../components/Result';
import css from './Game.module.css';

export const Game = () => {
  const [isThinking, setIsThinking] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const chess = new Chess();

    let seed = 71;
    function random() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    function makeEngineMove(chessboard: Chessboard) {
      setIsGameOver(chess.isGameOver());
      const thinkingTime = () => {
        return Math.floor(Math.random() * 5000) + 250;
      };

      const possibleMoves = chess.moves({ verbose: true });
      if (possibleMoves.length > 0) {
        const randomIndex = Math.floor(random() * possibleMoves.length);
        const randomMove = possibleMoves[randomIndex];
        setIsThinking(true);
        setTimeout(() => {
          chess.move({ from: randomMove.from, to: randomMove.to });
          chessboard.setPosition(chess.fen(), true);
          chessboard.enableMoveInput(inputHandler, COLOR.white);
          setIsThinking(false);
        }, thinkingTime());
      }
    }

    function inputHandler(event: InputHandlerEvent) {
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
          const possibleMoves = chess.moves({
            square: event.squareFrom,
            verbose: true,
          });
          for (const possibleMove of possibleMoves) {
            if (possibleMove.promotion && possibleMove.to === event.squareTo) {
              event.chessboard.showPromotionDialog(
                event.squareTo,
                COLOR.white,
                (result: Result) => {
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
        // pieces: {
        // file: '../../../node_modules/cm-chessboard/assets/pieces/staunty.svg',
        // },
        cssClass: 'green',
        borderType: BORDER_TYPE.frame,
      },
      extensions: [
        { class: Markers, props: { autoMarkers: MARKER_TYPE.dot } },
        { class: PromotionDialog },
        { class: Accessibility, props: { visuallyHidden: true } },
      ],
    });
    board.enableMoveInput(inputHandler, COLOR.white);
  }, []);

  return (
    <div className={css.layout}>
      <NavLink to="/">Back</NavLink>
      <img src="/terminator.png" width={100} height={100} />
      <Clock count={isThinking} isGameOver={isGameOver} />
      {isThinking ? <p>Thinking...</p> : <p>Your turn</p>}
      <div id="board" />
      <span>You</span>
      <Clock count={!isThinking} isGameOver={isGameOver} />
      {isGameOver && <Result />}
    </div>
  );
};
