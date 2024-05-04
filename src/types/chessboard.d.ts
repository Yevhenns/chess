declare module 'cm-chessboard/src/Chessboard.js' {
  interface ColorObject {
    white: string;
    black: string;
  }
  export const COLOR: ColorObject & {
    new (options: ColorObject);
  };

  interface FenObject {
    start: string;
    empty: string;
  }
  export const FEN: FenObject & {
    new (options: FenObject);
  };

  interface InputEventTypeObject {
    moveInputStarted: string;
    movingOverSquare: string;
    validateMoveInput: string;
    moveInputCanceled: string;
    moveInputFinished: string;
  }
  export const INPUT_EVENT_TYPE: InputEventTypeObject & {
    new (options: InputEventTypeObject);
  };

  interface borderTypeObject {
    none: string;
    thin: string;
    frame: string;
  }
  export const BORDER_TYPE: borderTypeObject & {
    new (options: borderTypeObject);
  };

  interface Chessboard {
    setPieceAt(square: string, piece: string): void;
    getPieceAt(square: string): string | null;
    clearSquare(square: string): void;
    clear(): void;
    fen(): FenObject;
    enableMoveInput(eventhandler: unknown, color: string): void;
    setPosition(fen: string, animated: boolean): void;
  }

  interface ChessboardConstructor {
    new (
      context: HTMLElement | null,
      props: {
        assetsUrl: string;
        position: string;
        style: {
          pieces: { file: string };
          cssClass: string;
          borderType: string;
        };
        extensions: unknown[];
      }
    ): Chessboard;
  }

  export const Chessboard: ChessboardConstructor;
}
