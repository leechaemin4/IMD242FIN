const aspectW = 4;
const aspectH = 0;

const container = document.querySelector('.container-canvas'); // 캔버스 컨테이너
// const gradientText = ' .:-=+#❣︎ෆ❥'; // ASCII 아트 문자
const gradientText = '❥ෆ❣︎#+=-:. ';

let scale = 0.1;
let mousePressedFlag = false; // 마우스 클릭 상태
let lovePositionX; // "Love" 글자의 시작 위치
let canvasSize;
let captureSize;
let tileWidth;

let capture;
let canvas;

function setup() {
  // 컨테이너 크기 계산
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();

  canvasSize = calculateCanvasSize(containerW, containerH, aspectW, aspectH);
  captureSize = [canvasSize[0] * scale, canvasSize[1] * scale];
  tileWidth = canvasSize[0] / captureSize[0];

  // 캔버스 생성
  canvas = createCanvas(canvasSize[0], canvasSize[1]);
  canvas.parent(container);

  // 마우스 이벤트 추가
  canvas.mousePressed(() => {
    mousePressedFlag = true; // 마우스 클릭 상태 활성화
    lovePositionX = width; // "Love" 글자가 오른쪽에서 시작
  });
  canvas.mouseReleased(() => {
    mousePressedFlag = false; // 마우스 클릭 상태 비활성화
  });

  // 웹캠 비디오 초기화
  capture = createCapture(VIDEO, {
    video: {
      width: captureSize[0],
      height: captureSize[1],
    },
    audio: false,
  });
  capture.hide(); // 비디오 숨기기

  // HSB 색상 모드 활성화
  colorMode(HSB);
}

function draw() {
  background(255);
  textSize(tileWidth);
  textAlign(CENTER, CENTER);
  noStroke();

  if (mousePressedFlag) {
    // chat gpt에게 글자 애니메이션 방법 물어봄
    drawLoveAnimation();
  } else {
    drawAsciiArt();
  }
}

function drawAsciiArt() {
  capture.loadPixels();
  if (capture.pixels.length === 0) return;

  for (let idx = 0; idx < capture.pixels.length / 4; idx++) {
    let r = capture.pixels[4 * idx + 0];
    let g = capture.pixels[4 * idx + 1];
    let b = capture.pixels[4 * idx + 2];

    let bright = (r + g + b) / 3;
    let gradientIdx = floor(map(bright, 0, 255, 0, gradientText.length - 1));
    let asciiText = gradientText.charAt(gradientIdx);

    // 타일 좌표 계산
    let column = idx % captureSize[0];
    let row = floor(idx / captureSize[0]);
    let x = column * tileWidth + tileWidth * 0.5;
    let y = row * tileWidth + tileWidth * 0.5;

    fill(random(0, 20), 100, random(150, 255)); // HSB 색상 설정
    text(asciiText, x, y);
  }
}

// chat gpt에게 글자 애니메이션 방법 물어봄
function drawLoveAnimation() {
  let hueValue = frameCount % 360;
  fill(hueValue, 255, 255);

  textFont('Courier New');
  textSize(width / 4);
  textStyle(BOLD);

  text('LOVE is LOVE', lovePositionX, height / 2);

  lovePositionX -= 4;

  if (lovePositionX < -textWidth('LOVE is LOVE')) {
    lovePositionX = width;
  }
}

function calculateCanvasSize(containerW, containerH, aspectW, aspectH) {
  if (aspectW === 0 || aspectH === 0) {
    return [containerW, containerH];
  } else if (containerW / containerH > aspectW / aspectH) {
    return [containerH * (aspectW / aspectH), containerH];
  } else {
    return [containerW, containerW * (aspectH / aspectW)];
  }
}
