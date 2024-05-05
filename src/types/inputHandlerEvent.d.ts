type InputHandlerEvent = {
  type: string;
  chessboard: Chessboard;
  squareFrom: Square;
  squareTo: Square;
  promotion: string;
  legalMove: unknown;
};

type Result = {
  type: string;
  piece: string;
};
