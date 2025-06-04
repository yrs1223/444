let video;
let handpose;
let predictions = [];

let catcherX = 320;
let ball;
let score = 0;

function setup() {
  createCanvas(640, 480);
  
  // 開啟攝影機
  video = createCapture(VIDEO, () => {
    console.log("📷 攝影機已啟用");
  });
  video.size(width, height);
  video.hide();

  // 載入 handpose 模型
  handpose = ml5.handpose(video, () => {
    console.log("✋ 手部模型載入完成");
  });

  handpose.on("predict", (results) => {
    predictions = results;
  });

  ball = new Ball();
}

function draw() {
  background(220);

  // 顯示攝影機畫面（鏡像） - 移到最前
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 如果偵測到手部，更新接盤位置
  if (predictions.length > 0) {
    let hand = predictions[0].landmarks;
    let palmX = hand[9][0];
    catcherX = width - palmX; // 鏡像處理
  }

  // 繪製接盤
  fill(0, 100, 255);
  rectMode(CENTER);
  rect(catcherX, height - 20, 80, 10);

  // 處理球的邏輯
  ball.update();
  ball.display();

  // 判斷是否接到球
  if (
    ball.y > height - 30 &&
    ball.x > catcherX - 40 &&
    ball.x < catcherX + 40
  ) {
    if (ball.correct) {
      score++;
    } else {
      score--;
    }
    ball = new Ball(); // 重生球
  }

  // 如果球掉到底也換新
  if (ball.y > height) {
    ball = new Ball();
  }

  // 顯示分數
  fill(0);
  textSize(20);
  text("分數：" + score, 10, 30);
}

// 球的類別
class Ball {
  constructor() {
    this.x = random(50, width - 50);
    this.y = 0;
    this.speed = 3;
    this.text = random(["2+2=4", "2+2=5"]);
    this.correct = this.text === "2+2=4";
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(this.correct ? "green" : "red");
    ellipse(this.x, this.y, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.text, this.x, this.y);
  }
}
