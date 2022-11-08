import * as Emitter from "../Emitter"

/**
 * Arguments of native `addEventListener()`.
 */
export type EventOptions = [string, EventListener, EventListenerOptions?];

/**
 * An object representing an element attributes.
 */
export type AttributeJSON = {
  [key: string]: any
}

/**
 * An object representing an element.
 */
export type ElementJSON = {
  attribute?: AttributeJSON | null
  children?: any
  on?: Array<EventOptions>
  svg?: any
  tagName: string
}

/**
 * see Emitter.Options.
 */
export type Options = Emitter.Options;

/**
 * Json2Node class
 */
export class Json2Node extends Emitter.Emitter {
  constructor(options?: Options) {
    super(options);
  }

  /**
   * Convert JSON to HTMLElement.
   */
  private convertTo(elementJSON: ElementJSON): Node {
    const tagName = elementJSON.tagName;
    let attribute = elementJSON.attribute;
    const events = elementJSON.on;
    const children = elementJSON.children;

    const isSvg = elementJSON.svg || -1 !== [
      "animate",
      "animateMotion",
      "animateTransform",
      "circle",
      "clipPath",
      "color-profile",
      "defs",
      "desc",
      "discard",
      "ellipse",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feDropShadow",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "filter",
      "foreignObject",
      "g",
      "hatch",
      "hatchpath",
      "image",
      "line",
      "linearGradient",
      "marker",
      "mask",
      "mesh",
      "meshgradient",
      "meshpatch",
      "meshrow",
      "metadata",
      "mpath",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "radialGradient",
      "rect",
      "set",
      "solidcolor",
      "stop",
      "svg",
      "switch",
      "symbol",
      "text",
      "textPath",
      "tspan",
      "unknown",
      "use",
      "view",
    ].indexOf(tagName);

    const element = (isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName));
    if (!(undefined === children || null === children)) element.appendChild(this.create(children));

    for (let property in attribute) {
      let value = attribute[property];

      if ("class" === property) {
        if ("string" === typeof value) {
          if (isSvg) {
            element.className.baseVal = value;
          } else {
            (element as HTMLElement).className = value;
          }
        }
      } else {
        var hasProperty = false;

        for (let nativeProperty in element) {
          if (nativeProperty === property) {
            hasProperty = true;
            break;
          }
        }

        if (hasProperty) {
          element[property] = value;

        } else if ("string" === typeof value) {
          if (isSvg) {
            element.setAttributeNS(null, property, value);
          } else {
            element.setAttribute(property, value);
          }
        }
      }
    }

    if (events) {
      events.forEach((entry) => {
        element.addEventListener(...(entry as EventOptions));
      });
    }

    this.emit(tagName + ":element", element);

    return element;
  }

  /**
   * Convert JSON to Node.
   * The return value can always be the argument of `appendChild()`.
   */
  create(options: any): Node {
    if (undefined === options || null === options) {
      return document.createDocumentFragment();

    } else if (options instanceof Node && -1 !== [1, 3, 8, 11,].indexOf(options.nodeType)) {
      return options;

    } else if ("undefined" !== typeof options.tagName) {
      return this.convertTo(options as ElementJSON);

    } else if (Array.isArray(options) || options instanceof HTMLCollection || options instanceof NodeList) {
      var documentFragment = document.createDocumentFragment();

      for (var i = 0; options.length > i; i++) {
        var entry = options[i];

        if (null !== entry) {
          documentFragment.appendChild(this.create(entry));
        }
      }

      return documentFragment;

    } else {
      return document.createTextNode("string" !== typeof options ? options.toString() : options);

    }
  }
}

