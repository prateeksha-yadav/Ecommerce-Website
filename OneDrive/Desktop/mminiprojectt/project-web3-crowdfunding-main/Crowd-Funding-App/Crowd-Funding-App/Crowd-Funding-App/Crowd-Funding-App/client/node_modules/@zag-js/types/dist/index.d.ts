import { JSX } from './jsx.js';
export { NormalizeProps, PropTypes, createNormalizer } from './prop-types.js';
import 'csstype';

type RequiredBy<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;
type Direction = "ltr" | "rtl";
type Orientation = "horizontal" | "vertical";
type MaybeElement<T extends HTMLElement = HTMLElement> = T | null;
type DirectionProperty = {
    /**
     * The document's text/writing direction.
     */
    dir?: Direction;
};
type CommonProperties = {
    /**
     * The unique identifier of the machine.
     */
    id: string;
    /**
     * A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.
     */
    getRootNode?: () => ShadowRoot | Document | Node;
};
type RootProperties = {
    /**
     * The owner document of the machine.
     */
    doc?: Document;
    /**
     * The root node of the machine. Useful for shadow DOM.
     */
    rootNode?: ShadowRoot;
    /**
     * The related target when the element is blurred.
     * Used as a polyfill for `e.relatedTarget`
     */
    pointerdownNode?: HTMLElement | null;
};
type Context<T> = T & RootProperties;
type Style = JSX.CSSProperties;

export { CommonProperties, Context, Direction, DirectionProperty, JSX, MaybeElement, Orientation, RequiredBy, RootProperties, Style };
