import kaplay from "kaplay";

// Global variables
let SCORE = 0;
let CLICKPOINTS = 1;
let CLICKABLE = true;
let SHOWSETTINGS = false;

let targetScale = 3;
let targetAngle = 0;
let TIMER = 1200000; // 20 minutes

let ENERGY = 20;
let MAXENERGY = ENERGY; // Initial ENERGY value
let progressBarValue = 1; // Progress value (0 to 1)
const progressBarWidth = 400;
let progressBarFillWidth = 400;
const progressBarHeight = 20;
const progressBarPos = [250, 50];
const configPos = [1850, 50]; // UI Variables

const COINPOS = [40, 50];

// Track hover state
let isHovered = false;

// Initialize Kaplay
kaplay();
setBackground("#000000");

// Load all assets
loadSprite("sukomi", "../src/sprites/sukomi.png");
loadSprite("coin", "../src/sprites/coin.png");
loadSprite("lightning", "../src/sprites/lightening.png");
loadSprite("config", "../src/sprites/config.png");

// Sukomi setup
let sukomi = add([
  sprite("sukomi"),
  pos(width() / 2, height() / 2),
  area(),
  anchor("center"),
  scale(3), // Initial scale
  "sukomi",
]);

let config = add([
  sprite("config"),
  pos(configPos[0], configPos[1]),
  area(),
  anchor("center"),
  scale(1.5),
  "config",
]);

add([
  sprite("lightning"),
  pos(progressBarPos[0] - 50, progressBarPos[1]),
  area(),
  anchor("left"),
  scale(1.5),
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
  text(`${ENERGY}/${MAXENERGY}`, { size: 20 }),
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
  if (energyText.text !== `${ENERGY}/${MAXENERGY}`) {
    energyText.text = `${ENERGY}/${MAXENERGY}`;
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
  if (CLICKABLE && ENERGY > 0) {
    addNumberPoints(sukomi.pos);
    sukomi.scaleTo(lerp(sukomi.scale.x + 1, 2, 0.1));

    // Increment the score
    SCORE++;

    // Decrease ENERGY only if it's above 0
    ENERGY--;
    progressBarValue = ENERGY / 20;

    // Update CLICKABLE based on ENERGY
    CLICKABLE = ENERGY > 0;
  }
});

// Function to replenish energy every 2 seconds
setInterval(() => {
  if (ENERGY < MAXENERGY) {
    ENERGY++; // Increase energy
    progressBarValue = ENERGY / 20; // Update progress bar

    // Allow clicking again if energy is replenished
    if (ENERGY > 0) {
      CLICKABLE = true;
    }
  }
}, TIMER);

function settingsPanel() {
  // Panel dimensions and position
  const panelWidth = 150;
  const panelHeight = 200;
  const panelPos = vec2(configPos[0] - 30, configPos[1] + 30);

  // Panel background
  let panel = add([
    rect(panelWidth, panelHeight, { radius: 10 }), // Adjust panel size
    pos(panelPos),
    area(),
    anchor("topright"),
    scale(1.5),
    color(rgb(26, 25, 28)), // Panel background color
    "panel",
  ]);

  // Center point of the panel
  const panelCenter = vec2(
    panelPos.x - panelWidth / 2, // Subtract half width for centering
    panelPos.y + panelHeight / 2 // Add half height for centering
  );

  // Title text
  add([
    text("Settings", { size: 16 }),
    pos(panelCenter.x, panelPos.y + 20), // Center horizontally, offset vertically
    anchor("center"),
    color(rgb(255, 255, 255)), // White text color
    "panelText",
  ]);

  // Example setting option text
  add([
    text("Option 1", { size: 14 }),
    pos(panelCenter.x, panelCenter.y - 20), // Center horizontally, offset slightly above center
    anchor("center"),
    color(rgb(200, 200, 200)), // Light gray text color
    "panelOption",
  ]);

  // Example button
  let button = add([
    rect(100, 30, { radius: 5 }),
    pos(panelCenter.x - 100, panelCenter.y + 20), // Center horizontally by subtracting half the button width
    area(),
    color(rgb(50, 50, 255)), // Button color
    "panelButton",
  ]);

  // Button text
  add([
    text("Click Me", { size: 12 }),
    pos(button.pos.x + button.width / 2, button.pos.y + button.height / 2), // Center inside the button
    anchor("center"),
    color(rgb(255, 255, 255)), // White text color
    "buttonText",
  ]);
}

onClick("config", () => {
  settingsPanel();
});
