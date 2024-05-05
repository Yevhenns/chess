declare module 'cm-chessboard/src/extensions/markers/Markers.js' {
  interface MarkersConstructor {
    new (chessboard: Chessboard, props: { autoMarkers: string });
  }
  export const Markers: MarkersConstructor;

  interface MarkerTypeObject {
    frame: {
      class: string;
      slice: string;
    };
    framePrimary: {
      class: string;
      slice: string;
    };
    frameDanger: {
      class: string;
      slice: string;
    };
    circle: {
      class: string;
      slice: string;
    };
    circlePrimary: {
      class: string;
      slice: string;
    };
    square: {
      class: string;
      slice: string;
    };
    dot: {
      class: string;
      slice: string;
      position: string;
    };
    bevel: {
      class: string;
      slice: string;
    };
  }
  export const MARKER_TYPE: MarkerTypeObject;
}
