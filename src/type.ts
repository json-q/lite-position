type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Alignment = 'start' | 'end';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Placement = Prettify<Side | `${Side}-${Alignment}`>;

export type Elements = {
  reference: HTMLElement;
  popper: HTMLElement;
}

export type ElementRects = {
  reference: ClientRectObject;
  popper: ClientRectObject;
  // arrow?: ClientRectObject;
};

export type Coords = {
  x: number;
  y: number;
};

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
  middleware?: Middleware[];
  // placement?: Placement;
  // /**
  //  * @desc 边缘检测的节点，通常情况下，此属性与 `autoUpdate` 的 boundary 数据应保持相同
  //  * @descEN Boundary elements for edge detection. This property should typically match the boundary data in `autoUpdate`.
  //  */
  // boundary?: Array<Element | Window>;
  // arrow?: HTMLElement;
  // /**
  //  * @description 是否自动应用样式
  //  * @descEN Whether to automatically apply styles
  //  * @default true
  //  */
  // applyStyle?: boolean;
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
  reset?: boolean | { placement?: Placement; rects?: boolean | ElementRects; };
}


export interface MiddlewareState extends Coords {
  initialPlacement: Placement;
  placement: Placement;
  middlewareData: MiddlewareData;
  elements: Elements;
  rects: ElementRects;
}

export type Middleware = {
  name: string;
  options?: any;
  fn: (state: MiddlewareState) => MiddlewareReturn;
};


export  interface MiddlewareData{
  [x:string]:any
}
