type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Placement = Prettify<Side | `${Side}-${Alignment}`>;

export type Elements = {
  reference: HTMLElement;
  popper: HTMLElement;
};

export type ElementRects = {
  reference: ClientRectObject;
  popper: ClientRectObject;
  // arrow?: ClientRectObject;
};

export type Coords = {
  x: number;
  y: number;
};

export type Boundary = Array<Element | Window>;
export type Padding = number | Prettify<Partial<Record<Side, number>>>;

export type ClientRectObject = {
  width: number;
  height: number;
  x: number;
  y: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type Rect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type LitePositionOptions = {
  placement?: Placement;
  middleware?: Array<Middleware | null | undefined | false>;
};

export interface LitePositionReturn extends Coords {
  /**
   * The final chosen placement of the floating element.
   */
  placement: Placement;
  /**
   * Object containing data returned from all middleware, keyed by their name.
   */
  middlewareData: MiddlewareData;
}

export interface MiddlewareReturn extends Partial<Coords> {
  data?: {
    [key: string]: any;
  };
  reset?: boolean | { placement?: Placement; rects?: boolean | ElementRects };
}

export interface MiddlewareState extends Coords {
  initialPlacement: Placement;
  placement: Placement;
  middlewareData: MiddlewareData;
  elements: Elements;
  rects: ElementRects;
  boundaryRect: ClientRectObject;
}

export type Middleware = {
  name: string;
  options?: any;
  fn: (state: MiddlewareState) => MiddlewareReturn;
};

export interface MiddlewareData {
  [x: string]: any;
  arrow?: {
    x: number;
    y: number;
    rect: ClientRectObject;
  };
  shift?: {
    offsetX: number;
    offsetY: number;
  };
  offset?: {
    offsetX: number;
    offsetY: number;
  };
}
