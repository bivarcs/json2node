const json2Node = new Json2Node;
const targetE = document.getElementById("target");

targetE.appendChild(json2Node.create([
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
]));