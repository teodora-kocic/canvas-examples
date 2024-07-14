const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");
const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

const rectWidth = 300;
const numOfRects = 3;
const numOfSquares = 6;
const squareWidth = rectWidth / numOfSquares;
const squareHeight = squareWidth;

let stopAt = undefined;

class Rect {
  constructor(x, y, w, h, numOfSquares, color, dx, squareArray) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.numOfSquares = numOfSquares;
    this.color = color;
    this.dx = dx;
    this.squareArray = squareArray;
  }

  draw() {
    c.strokeStyle = this.color;
    c.lineWidth = "2";
    c.strokeRect(this.x, this.y, this.w, this.h);
    c.stroke();
    for (let j = 0; j < this.squareArray.length; j++) {
      c.fillStyle = this.squareArray[j].color;
      c.fillRect(
        this.x + j * squareWidth,

        this.y + this.h / 2 - squareWidth / 2,
        squareWidth,
        squareHeight,
      );
    }
  }

  update() {
    this.x += this.dx * 2;

    if (this.x + this.w <= 0) {
      this.x = canvas.width + this.w;
      this.x += this.dx;
    }
    if (this.x - this.w > canvas.width) {
      this.x = 0 - this.w;
      this.x += this.dx;
    }

    if (stopAt && Math.abs(stopAt - this.x) < 2) {
      this.dx = 0;
      if (rects.every((r) => r.dx === 0)) {
        animate = false;
      }
    }

    this.draw();
  }
}

const rects = [];

for (let i = 0; i < numOfRects; i++) {
  let squareArray = [];
  let width = rectWidth;
  let height = Math.random() * (rectWidth / 2 - squareHeight) + squareHeight;
  let x = Math.random() * (canvas.width - rectWidth);
  let y = Math.random() * (canvas.height - height);

  let squares = numOfSquares;
  let dx = Math.random() > 0.5 ? 1 : -1;

  for (let j = 0; j < numOfSquares; j++) {
    squareArray.push({
      x: x + j * squareWidth,

      y: y + height / 2 - squareWidth / 2,
      squareWidth,
      squareHeight,
      color: colors[j],
    });
  }

  rects.push(new Rect(x, y, width, height, squares, "white", dx, squareArray));
}

const drawRects = () => {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < rects.length; i++) {
    rects[i].draw();
  }

  requestAnimationFrame(drawRects);
};

drawRects();

let animate = true;

const animateRects = () => {
  if (!animate) {
    return;
  }

  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = 0; i < rects.length; i++) {
    rects[i].update();
  }

  requestAnimationFrame(animateRects);
};

canvas.addEventListener("click", function (e) {
  animateRects();
});

canvas.addEventListener("click", function (e) {
  rects.find((rect) => {
    rect.squareArray.find((s) => {
      const maxWidth = s.x + squareWidth;
      const minWidth = s.x;
      const maxHeight = s.y + squareHeight;
      const minHeight = s.y;

      if (
        e.x >= minWidth &&
        e.x <= maxWidth &&
        e.y >= minHeight &&
        e.y <= maxHeight
      ) {
        rect.dx = 0;
        stopAt = rect.x;
        return true;
      }
    });
  });
});

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
