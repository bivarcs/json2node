# Json2Node
![](https://img.shields.io/npm/types/@bivarcs/json2node)
![](https://img.shields.io/node/v/@bivarcs/json2node)
![](https://img.shields.io/github/license/bivarcs/json2node)

Convert JSON to Node.

## Demo
https://bivarcs.github.io/json2node/demo/

```html
<div id="target"></div>

<script>
const json2Node = new Json2Node;

document.getElementById("target").appendChild(json2Node.create([
  "hello! My name is ",
  {
    attribute: {
      href: "https://example.com",
      rel: "noopener",
    },
    children: "@bivarcs",
    tagName: "a",
  },
  "!!",
]));

/*
<div id="target"></div>
=>
<div id="target">hello! My name is <a href="https://example.com" rel="noopener">@bivarcs</a>!!</div>
*/
</script>
```

## Installation
### Package Manager
npm: `npm i @bivarcs/json2node`  
yarn: `yarn add @bivarcs/json2node`  

A command is needed to prepare dependent libraries.

```
npm run src:setup
```

### CDN
```js
<script src="https://unpkg.com/@bivarcs/json2node/dist/js/json2node.min.js"></script>
```

## Document
- [API Documentation](https://bivarcs.github.io/json2node/docs/) (via: [Typedoc](https://github.com/TypeStrong/typedoc))

## Usage

### ElementJSON
JSON representing the element.

| Name               | Type      | Description |
| ------------------ | --------- | ----------- |
| `attribute?`          | `object`  | Position x of look at. |
| `children?`          | `any`  | Processed by `create()` recursively. |
| `tagName`          | `string`  | Tag Name. |
| `on?`          | `Array<[string, EventListener, EventListenerOptions]>`  | Array of `addEventListener()` arguments. |
| `svg?`          | `boolean`  | It is treated as an svg element. If it does not overlap with HTML elements, it is not necessary to specify. |

### basic usage
ElementJSON as an argument.

```js
const json2Node = new Json2Node;

const newDiv = json2Node.create({
  attribute: {
    class: "a",
  },
  children: "hello world!",
  tagName: "div",
  on: [
    ["click", (event) => console.log(event), {passive: true},],
  ],
});

/*
<div class="a">hello world!</div>
*/
```

### Node
A node is always returned.

```js
element.append(json2Node.create(any));
```

### children
.with child elements

```js
const newDiv2 = json2Node.create({
  children: {
    children: {
      children: "hello!",
      tagName: "a",
    },
    tagName: "p",
  },
  tagName: "div",
});

// <div><p><a>hello!</a></p></div>
```

### DocumentFragment
Create document fragments.

```js
const newDiv3 = json2Node.create([
  {
    children: "hello",
    tagName: "div",
  },
  {
    children: "my friend!",
    tagName: "div",
  },
]);

// <div>hello</div><div>my friend!</div>
```

### TextNode
.Create a text node.

```js
const newDiv4 = json2Node.create("hello");

// "text node" (TextNode)
```

### HTMLElement
A combination of values of various types can be specified at once.
element as an argument.

```js
const newDiv5 = json2Node.create(document.createElement("div"));

// DIV (HTMLElement)
```

### NULL
`null` and `undefined` are ignored.  
You have flexibility to create elements.

```js
const hoge = false;

const newDiv6 = json2Node.create([
  {
    children: "hello",
    tagName: "div",
  },
  hoge ? {
    children: "friend!",
    tagName: "p",
  } : null,
]);

// <div>hello</div>
// <div>hello</div><p>friend!</p> (If hoge=true)
```

### example
```js
const newDiv7 = json2Node.create({
    children: [
      "hello! My name is ",  // [0]: TextNode
      { //[1]: HTMLElement
        attribute: {
          href: "https://example.com",
          rel: "noopener",
        },
        children: "@bivarcs",
        tagName: "a",
      },
      "!!", // [2]: TextNode
    ],
    tagName: "div",
  });

/*
<div>hello! My name is<a href="https://example.com" rel="noopener">@bivarcs</a>!!</div>
*/
```

## License
Json2Node is available under the [MIT license](LICENSE.md).










































