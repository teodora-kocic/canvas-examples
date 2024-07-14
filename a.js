const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

let blueCirclesArray = [];

class BlueCircle {
  constructor(x, y, radius, mass, bgColor) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.bgColor = bgColor;
    this.opacity = 1;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.bgColor;
    c.fill();
    c.restore();
    if (this.opacity < 0) {
      c.clearRect();
    }
  }

  update() {
    let interval;
    let change = -0.01;
    interval = setInterval(() => {
      this.opacity += change;
      if (this.opacity <= 0) {
        change = 0;
        this.opacity = 0;
        clearInterval(interval);
      }
    }, 100);
  }
}

const distance = (x1, y1, x2, y2) => {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
};

for (let i = 0; i < 10; i++) {
  let radius = 30;
  let x = Math.random() * (window.innerWidth - radius * 2) + radius;
  let y = Math.random() * (window.innerHeight / 2 - radius * 2) + radius;

  if (i !== 0) {
    for (let j = 0; j < blueCirclesArray.length; j++) {
      if (
        distance(x, y, blueCirclesArray[j].x, blueCirclesArray[j].y) -
          radius * 4 <
        0
      ) {
        x = Math.random() * (window.innerWidth - radius * 2) + radius;
        y = Math.random() * (window.innerHeight / 2 - radius * 2) + radius;
        j = -1;
      }
    }
  }

  blueCirclesArray.push(new BlueCircle(x, y, radius, 1, "blue"));
}

const animateBlueCircles = () => {
  for (let i = 0; i < blueCirclesArray.length; i++) {
    blueCirclesArray[i].draw();
  }
};

animateBlueCircles();

class RedCircle {
  constructor(x, y, radius, mass, bgColor) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8,
    };
    this.mass = mass;
    this.bgColor = bgColor;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    c.fillStyle = this.bgColor;
    c.fill();
    c.stroke();
  }

  update() {
    if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.draw();

      return;
    }

    if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.draw();

      return;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.draw();
  }
}

const redCircle = new RedCircle(
  window.innerWidth / 2 - 30,
  window.innerHeight - 30,
  30,
  1,
  "red",
);

redCircle.draw();

const animateRedCircle = () => {
  requestAnimationFrame(animateRedCircle);
  requestAnimationFrame(animateBlueCircles);
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  redCircle.update();
  detectCollision();
};

const startAnimation = () => {
  requestAnimationFrame(animateBlueCircles);
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  redCircle.update();
};

window.addEventListener("click", function (e) {
  const minPositionX = redCircle.x - redCircle.radius;
  const maxPositionX = redCircle.x + redCircle.radius;

  const minPositionY = redCircle.x - redCircle.radius;
  const maxPositionY = redCircle.x + redCircle.radius;
  if (
    e.x >= minPositionX &&
    e.x <= maxPositionX &&
    e.y >= minPositionY &&
    e.x <= maxPositionY
  ) {
    animateRedCircle();
  }
});

const detectCollision = () => {
  for (let i = 0; i < blueCirclesArray.length; i++) {
    if (
      distance(
        redCircle.x,
        redCircle.y,
        blueCirclesArray[i].x,
        blueCirclesArray[i].y,
      ) <
      redCircle.radius + blueCirclesArray[i].radius
    ) {
      blueCirclesArray[i].update();
    }
  }
};

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
