/*! @bivarcs/json2node 0.0.1 | MIT | https://github.com/bivarcs/json2node */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Json2Node = factory());
})(this, function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
  };
  class Emitter {
    constructor(options) {
      this.Emitter$entries = {};
      if (options && options.on) {
        options.on.forEach(entry => {
          this.on(...entry);
        });
      }
    }
    on(type, callback, options) {
      let entries = this.Emitter$entries;
      if (!entries[type] || !entries[type].some(entry => {
        return type === entry[0] && callback === entry[1];
      })) {
        if (!entries[type]) {
          entries[type] = [];
        }
        entries[type].push([type, callback, __spreadValues(__spreadValues({}, {
          once: false,
          order: 0
        }), options)]);
        entries[type].sort((a, b) => (a[2].order || 0) - (b[2].order || 0));
      }
    }
    off(type, callback) {
      let entries = this.Emitter$entries;
      if (entries[type]) {
        entries[type] = entries[type].filter(entry => {
          return callback !== entry[1];
        });
      }
    }
    emit(type, data) {
      let entries = this.Emitter$entries;
      if (entries[type]) {
        entries[type].forEach(entry => {
          entry[1]({
            data,
            target: this,
            type
          });
          if (entry[2].once) {
            this.off(type, entry[1]);
          }
        });
      }
    }
    destroy() {
      this.Emitter$entries = {};
    }
  }
  class Json2Node extends Emitter {
    constructor(options) {
      super(options);
    }
    convertTo(elementJSON) {
      const tagName = elementJSON.tagName;
      let attribute = elementJSON.attribute;
      const events = elementJSON.on;
      const children = elementJSON.children;
      const isSvg = elementJSON.svg || -1 !== ["animate", "animateMotion", "animateTransform", "circle", "clipPath", "color-profile", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "hatch", "hatchpath", "image", "line", "linearGradient", "marker", "mask", "mesh", "meshgradient", "meshpatch", "meshrow", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "set", "solidcolor", "stop", "svg", "switch", "symbol", "text", "textPath", "tspan", "unknown", "use", "view"].indexOf(tagName);
      const element = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);
      if (!(void 0 === children || null === children)) element.appendChild(this.create(children));
      for (let property in attribute) {
        let value = attribute[property];
        if ("class" === property) {
          if ("string" === typeof value) {
            if (isSvg) {
              element.className.baseVal = value;
            } else {
              element.className = value;
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
        events.forEach(entry => {
          element.addEventListener(...entry);
        });
      }
      this.emit(tagName + ":element", element);
      return element;
    }
    create(options) {
      if (void 0 === options || null === options) {
        return document.createDocumentFragment();
      } else if (options instanceof Node && -1 !== [1, 3, 8, 11].indexOf(options.nodeType)) {
        return options;
      } else if ("undefined" !== typeof options.tagName) {
        return this.convertTo(options);
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
  return Json2Node;
});
