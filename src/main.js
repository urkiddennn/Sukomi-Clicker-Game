import kaplay from "kaplay";

// Global variables
let SCORE = 0;
let CLICKPOINTS = 1;

let targetScale = 3;
let targetAngle = 0;

let ENERGY = 20;
let progressBarValue = 1; // Progress value (0 to 1)
const progressBarWidth = 400;
let progressBarFillWidth = 400;
const progressBarHeight = 20;
const progressBarPos = [200, 50]; // UI Variables

const COINPOS = [40, 50];

// Initialize Kaplay
kaplay();
setBackground("#000000");

// Load all assets
loadSprite("sukomi", "../src/sprites/sukomi.png");
loadSprite("coin", "../src/sprites/coin.png");

// Sukomi setup
let sukomi = add([
  sprite("sukomi"),
  pos(width() / 2, height() / 2),
  area(),
  anchor("center"),
  scale(3), // Initial scale
  "sukomi",
]);

add([
  rect(progressBarWidth, progressBarHeight),
  pos(progressBarPos[0], progressBarPos[1]),
  color(rgb(50, 50, 50)), // Gray background
  anchor("topleft"),
]);

let progressBarFill = add([
  rect(progressBarFillWidth, progressBarHeight),
  // Initial width is 0
  pos(progressBarPos[0], progressBarPos[1]),
  color(rgb(86, 255, 86)), // Green fill
  anchor("topleft"),
]);

// Coin setup
const coin = add([
  sprite("coin"),
  pos(COINPOS[0], COINPOS[1]),
  area(),
  anchor("center"),
  scale(2),
  "coin",
]);

// Display Score (optimized)
let scoreText = add([
  text(SCORE),
  pos(COINPOS[0] + 80, COINPOS[1] + 5),
  anchor("center"),
  scale(1.5),
]);

// Hover effect
onHoverUpdate("sukomi", () => {
  setCursor("pointer");
  targetScale = 4;
  targetAngle = 340;
});

onHoverEnd("sukomi", () => {
  targetScale = 3;
  targetAngle = 340;
});

onUpdate(() => {
  if (scoreText.text !== SCORE) {
    scoreText.text = SCORE;
  }

  if (sukomi.scale) {
    sukomi.scaleTo(lerp(sukomi.scale.x, targetScale, 0.1));
  }
  if (sukomi.angle) {
    sukomi.angle = lerp(sukomi.angle, targetAngle, 0.1);
  }

  // if (progressBarValue < 1) {
  //   progressBarValue += 0.01; // Increment progress
  // }

  // Update the width of the progress bar fill
  progressBarFill.width = progressBarValue * progressBarWidth;
});

let addNumberPoints = (startPos) => {
  const offsetRange = 100;
  let endPos = vec2(
    startPos.x + (Math.random() * offsetRange - offsetRange / 2),
    startPos.y + (Math.random() * offsetRange - offsetRange / 2)
  );
  let progress = 0; // Progress of movement (0 to 1)

  let number = add([
    pos(startPos),
    text(`+${CLICKPOINTS}`),
    anchor("center"),
    scale(0.5),
    color(rgb(255, 255, 255)),
    opacity(1),
    "numberEffect", // Tag for identification
  ]);

  onUpdate(() => {
    if (progress < 1) {
      progress += 0.02; // Speed of movement
      number.pos = vec2(
        lerp(startPos.x, endPos.x, progress),
        lerp(startPos.y, endPos.y, progress)
      );
      number.scaleTo(lerp(1, 2, progress));
      number.opacity = lerp(1, 0, progress);
    } else {
      destroy(number);
    }
  });
};

onClick("sukomi", () => {
  addNumberPoints(sukomi.pos);
  sukomi.scaleTo(lerp(sukomi.scale.x + 1, targetScale, 0.1));
  SCORE++;
  progressBarValue -= 0.01;
});

if (debug.active) {
  let debugFrameCounter = 0;
  const frameThrottle = 2;
  onUpdate(() => {
    debugFrameCounter++;
    if (debugFrameCounter % frameThrottle !== 0) return;

    debug.collisions(true);
    debug.fps(true);
  });
}
