const boardImage = new Image();
boardImage.src = "../images/road.png";

const carImage = new Image();
carImage.src = "../images/car.png";

const board = {
  canvas: document.querySelector("#canvas"),
  frame: 0,
  image: boardImage,
  score: 0,
  start() {
    this.context = this.canvas.getContext("2d");
    this.width = this.image.width;
    this.height = this.image.height;
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    this.interval = setInterval(updateGame, 20);
  },
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  },
  draw() {
    this.context.drawImage(this.image, 0, 0);
  },
  stop() {
    clearInterval(this.interval);
    this.context.fillRect(0, 100, this.width, 200)
    this.context.strokeStyle = 'yellow';
    this.context.font = '30px sans-serif'
    this.context.strokeText('You Crashed!!!', 30, 150)
    this.context.strokeText('Your final score', 30, 200)
    this.context.strokeText(`was ${this.score}`, 30, 250)
  },
  scoreDisplay() {
    this.context.font = '20px sans-serif'
    this.context.fillText(`Your Score: ${this.score}`, this.width - 185, 40)
  }
};

const car = {
  image: carImage,
  size: 30,
  carScale() {
    this.scale = carImage.height / carImage.width;
    this.height = this.scale * this.size;
    this.width = this.size;
  },
  placeCar() {
    this.carScale();
    this.x = (board.width - this.width) / 2;
    this.y = board.height - this.height * 1.1;
    this.draw();
  },
  draw() {
    board.context.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
  },
  moveRight() {
    if (this.x < 210) this.x += 10;
  },
  moveLeft() {
    if (this.x > 40) this.x -= 10;
  },
  checkCrash(obstacle) {
    if (
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y &&
      ((obstacle.x === 0 && this.x < obstacle.width) ||
        (obstacle.x > 0 && this.x + this.width > obstacle.x))
    ) return true;
    return false;
  },
};

const obstacleObj = {
  height: 10,
  maxWidth: 200,
  minWidth: 40,
  maxGap: 80,
  minGap: 50,
  speed: 1,
  draw() {
    board.context.fillRect(this.x, this.y, this.width, this.height);
  },
};

const obstaclesArray = [];

const updateObstacles = () => {
  board.frame++;
  if (board.frame % 150 === 0) {
    const obstacle = { ...obstacleObj };
    obstacle.width = Math.floor(
      Math.random() * (obstacle.maxWidth - obstacle.minWidth + 1) +
        obstacle.minWidth
    );
    obstacle.gap = Math.floor(
      Math.random() * (obstacle.maxGap - obstacle.minGap + 1) + obstacle.minGap
    );
    obstacle.x = 0;
    obstacle.y = 0;
    const opositeObstacle = { ...obstacleObj };
    opositeObstacle.width = board.width - obstacle.width - obstacle.gap;
    opositeObstacle.x = obstacle.width + obstacle.gap;
    opositeObstacle.y = 0;
    obstaclesArray.push(obstacle);
    obstaclesArray.push(opositeObstacle);
  }

  for (const obstacle of obstaclesArray) {
    obstacle.y++;
    obstacle.draw();
    if (car.checkCrash(obstacle)) {
      board.stop()
      break;
    }
  };
};

const updateGame = () => {
  board.clear();
  board.draw();
  board.scoreDisplay();
  car.draw();
  updateObstacles();
  if (board.frame - 450 > 0 && board.frame % 150 === 0) board.score++;
};

const startGame = () => {
  board.start();
  car.placeCar();
  obstaclesArray.splice(0, obstaclesArray.length)
};


window.addEventListener("load", () => {
  document.querySelector("#start-button").addEventListener("click", startGame);
});

document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") car.moveRight();
  if (e.key === "ArrowLeft") car.moveLeft();
});
