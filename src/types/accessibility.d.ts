declare module 'cm-chessboard/src/extensions/accessibility/Accessibility.js' {
  interface AccessibilityConstructor {
    new (chessboard: Chessboard, props: { visuallyHidden: string });
  }
  export const Accessibility: AccessibilityConstructor;
}
