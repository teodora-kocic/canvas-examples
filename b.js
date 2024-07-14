const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

let rotationAngle = 0;
let rotateSpeed = 0.02;

const numSlices = 6;
const sliceAngle = (Math.PI * 2) / numSlices;

const mouse = {
  x: undefined,
  y: undefined,
};

let isNegativeX = false;
let isNegativeY = false;

let normalizedMouse = {
  x: undefined,
  y: undefined,
};

const colors = ["red", "blue", "green", "yellow", "orange", "purple"];

const startPointX = canvas.width / 2;
const startPointY = canvas.height / 2;

let spinning = false;

class Triangle {
  constructor(bgColor, index) {
    this.bgColor = bgColor;
    this.index = index;
    this.path = new Path2D();
    this.startAngle = undefined;
    this.endAngle = undefined;
  }

  draw(drowLabel = false) {
    this.startAngle = rotationAngle + (this.index + 3) * sliceAngle;
    this.endAngle = this.startAngle + sliceAngle;

    c.beginPath();
    c.moveTo(startPointX, startPointY);
    c.arc(startPointX, startPointY, 150, this.startAngle, this.endAngle);
    c.closePath();
    c.fillStyle = this.bgColor;
    c.fill();
    if (drowLabel) {
      this.drawSegmentLabel();
    }
  }

  showLabel() {
    this.draw(true);
  }

  drawSegmentLabel() {
    c.save();
    c.fillStyle = "white";
    var x = Math.floor(canvas.width / 2);
    var y = Math.floor(canvas.height / 2);
    c.translate(x, y);
    c.rotate(this.startAngle + Math.PI / 6);
    c.moveTo(x, y);
    var dx = 150;
    var dy = 10;

    c.textAlign = "right";
    c.font = "24pt Helvetica";

    c.fillText(this.bgColor, dx, dy);

    c.restore();
  }
}

const triangles = colors.map((color, index) => new Triangle(color, index));

const drawTriangles = () => {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  triangles.forEach((tri) => {
    tri.draw();
  });
};

drawTriangles();

const stopSpinning = () => {
  spinning = false;
  checkForSelectedTriangle();
};

const startSpinning = (spinDirection = 1) => {
  rotateSpeed =
    spinDirection > 0 ? Math.abs(rotateSpeed) : -Math.abs(rotateSpeed);
  spinning = true;
  animateRotation();
};

function animateRotation() {
  if (spinning) {
    rotationAngle += rotateSpeed;
    drawTriangles();
    requestAnimationFrame(animateRotation);
  }
}

const checkForSelectedTriangle = () => {
  if (
    normalizedMouse.x > 150 ||
    normalizedMouse.x < -150 ||
    normalizedMouse.y > 150 ||
    normalizedMouse.y < -150
  ) {
    return;
  }

  const angle =
    (Math.atan2(normalizedMouse.y, normalizedMouse.x) * 180) / Math.PI;

  const degRotated = (rotationAngle * 180) / Math.PI;
  const rotationDiff = Math.ceil(degRotated / 60);

  const originalElementAtClickPlace = triangles.findIndex((_tri, index) => {
    if (!isNegativeX && !isNegativeY && [3, 4].includes(index)) {
      if (index === 3 && angle < 60) {
        return true;
      }

      if (index === 4 && angle >= 60) {
        return true;
      }
    }

    if (!isNegativeX && isNegativeY && [1, 2].includes(index)) {
      if (index === 1 && angle >= 60) {
        return true;
      }

      if (index === 2 && angle < 60) {
        return true;
      }
    }

    if (isNegativeX && !isNegativeY && [4, 5].includes(index)) {
      if (index === 4 && angle >= 60) {
        return true;
      }

      if (index === 5 && angle < 60) {
        return true;
      }
    }

    if (isNegativeX && isNegativeY && [0, 1].includes(index)) {
      if (index === 0 && angle < 60) {
        return true;
      }

      if (index === 1 && angle >= 60) {
        return true;
      }
    }

    return false;
  });

  // OVA RACUNICA NE RADI NAJBOLJE, LOSE ZBOG ZAOKRUZIVANJA (rotationDiff polja) POVREMENO REGISTRUJE POLJE PORED KLIKNUTOG
  let animateElementIndex = originalElementAtClickPlace
    ? (originalElementAtClickPlace - rotationDiff) % 6
    : -1;

  if (originalElementAtClickPlace > -1 && animateElementIndex < 0) {
    animateElementIndex = 6 + animateElementIndex;
  }

  animateDraw(animateElementIndex);
};

const animateDraw = (index, timesLeft = 5) => {
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  triangles.forEach((tri, i) => {
    if (index === i) {
      tri.showLabel();
    } else {
      tri.draw();
    }
  });

  if (timesLeft !== 0) {
    animateDraw(index, timesLeft - 1);
  }
};

calculateCoordsData = () => {
  isNegativeX = mouse.x < window.innerWidth / 2;
  isNegativeY = mouse.y < window.innerHeight / 2;

  normalizedMouse = {
    x: isNegativeX
      ? window.innerWidth / 2 - mouse.x
      : mouse.x - window.innerWidth / 2,
    y: isNegativeY
      ? window.innerHeight / 2 - mouse.y
      : mouse.y - window.innerHeight / 2,
  };
};

window.addEventListener("click", function (e) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;

  calculateCoordsData();

  if (spinning) {
    stopSpinning();
    return;
  }

  startSpinning(mouse.x < canvas.width / 2 ? -10 : 10);
});

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});
