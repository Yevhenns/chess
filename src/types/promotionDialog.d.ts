declare module 'cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js' {
  interface PromotionDialogConstructor {
    new (chessboard: Chessboard);
  }
  export const PromotionDialog: PromotionDialogConstructor;

  interface PromotionDialogResultTypeObject {
    pieceSelected: string;
    canceled: string;
  }
  export const PROMOTION_DIALOG_RESULT_TYPE: PromotionDialogResultTypeObject;
}
