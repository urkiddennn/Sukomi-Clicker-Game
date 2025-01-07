import kaplay from "kaplay";

// Global variables
let SCORE = 0;
let CLICKPOINTS = 1;
let CLICKABLE = true;

let targetScale = 3;
let targetAngle = 0;

let ENERGY = 20;
let CURRENTENERGY = ENERGY; // Initial ENERGY value
let progressBarValue = 1; // Progress value (0 to 1)
const progressBarWidth = 400;
let progressBarFillWidth = 400;
const progressBarHeight = 20;
const progressBarPos = [200, 50]; // UI Variables

const COINPOS = [40, 50];

// Track hover state
let isHovered = false;

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

// Progress bar background
add([
  rect(progressBarWidth, progressBarHeight, { radius: 10 }),
  pos(progressBarPos[0], progressBarPos[1]),
  color(rgb(50, 50, 50)), // Gray background
  anchor("topleft"),
]);

// Progress bar fill
let progressBarFill = add([
  rect(progressBarFillWidth, progressBarHeight, { radius: 10 }),
  pos(progressBarPos[0], progressBarPos[1]),
  color(rgb(86, 255, 86)), // Green fill
  anchor("topleft"),
]);

// ENERGY text
let energyText = add([
  text(`${ENERGY}/${CURRENTENERGY}`),
  pos(progressBarPos[0], progressBarPos[1] - 15),
  anchor("left"),
  scale(1),
  "energyText", // Tag for identification
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

// Display Score
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
  isHovered = true; // Set hover state to true
});

onHoverEnd("sukomi", () => {
  targetScale = 3;
  targetAngle = 340;
  isHovered = false; // Set hover state to false
});

// Update loop
onUpdate(() => {
  // Update score display
  if (scoreText.text !== SCORE) {
    scoreText.text = SCORE;
  }

  // Smooth scaling and rotation for Sukomi
  if (sukomi.scale) {
    sukomi.scaleTo(lerp(sukomi.scale.x, targetScale, 0.1));
  }
  if (sukomi.angle) {
    sukomi.angle = lerp(sukomi.angle, targetAngle, 0.1);
  }

  // Update progress bar width
  progressBarFill.width = progressBarValue * progressBarWidth;

  // Update ENERGY text
  if (energyText.text !== `${ENERGY}/${CURRENTENERGY}`) {
    energyText.text = `${ENERGY}/${CURRENTENERGY}`;
  }
});

// Number effect on click
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

// Click event for Sukomi
onClick("sukomi", () => {
  if (CLICKABLE === true) {
    addNumberPoints(sukomi.pos);
    sukomi.scaleTo(lerp(sukomi.scale.x + 1, 2, 0.1));

    // Increment the score
    SCORE++;

    // Only decrease ENERGY if it is greater than 0
    if (ENERGY > 0) {
      ENERGY--; // Decrease ENERGY
      progressBarValue = ENERGY / 20; // Update progressBarValue based on ENERGY
    }

    // Optional: Prevent ENERGY from going negative
    if (ENERGY < 0) {
      ENERGY = 0;
      progressBarValue = 0;
      CLICKABLE = false; // Progress bar is fully depleted
    }
  }
  // Add points visually
});
