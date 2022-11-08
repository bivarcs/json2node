const Json2Node = require('../class.ts').Json2Node;

test('class', () => {
  const json2Node = new Json2Node({
    on: [
      ["filter:img:attribute", (event) => {
        return {
          ...{
            loading: "lazy",
          },
          ...event.data,
        };
      },],
    ],
  });

  const divE = json2Node.create({
    tagName: "div",
    children: [
      {
        tagName: "p",
        attribute: {
          className: "p-class",
        },
        children: "hello",
      },
      {
        attribute: {
          src: "image.png",
        },
        tagName: "img",
      },
    ],
  });

  console.log(divE.outerHTML);

  expect(divE.tagName).toBe("DIV");

  expect(divE.childNodes[0].tagName).toBe("P");

  expect(divE.childNodes[0].textContent).toBe("hello");
});
