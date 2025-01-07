import kaplay from "kaplay";
// Global variables
let SCORE = 0;
let CLICKPOINTS = 1; // Points added per click
let CLICKABLE = true;
let SHOWSETTINGS = false;
let SHOWUPGRADE = false;

let targetScale = 3;
let targetAngle = 0;
let TIMER = 15000; // Energy refill timer in milliseconds
let ENERGY = 80;
let MAXENERGY = ENERGY;
let progressBarValue = 1; // Progress value (0 to 1)
const progressBarWidth = 400;
const progressBarHeight = 20;
const progressBarPos = [250, 50];
const configPos = [1850, 50];

const COINPOS = [40, 50];

// Track hover state
let isHovered = false;

// Store upgrade panel elements
let upgradePanelElements = [];

// Initialize Kaplay
kaplay();
setBackground("#000000");

// Load all assets
loadSprite("sukomi", "../src/sprites/sukomi.png");
loadSprite("coin", "../src/sprites/coin.png");
loadSprite("lightning", "../src/sprites/lightening.png");
loadSprite("config", "../src/sprites/config.png");
loadSprite("upgrade", "../src/sprites/api_book.png");

// Sukomi setup
let sukomi = add([
  sprite("sukomi"),
  pos(width() / 2, height() / 2),
  area(),
  anchor("center"),
  scale(3), // Initial scale
  "sukomi",
]);

let upgrade = add([
  sprite("upgrade"),
  pos(80, height() / 1.1),
  area(),
  anchor("center"),
  scale(1.5),
  "upgrade",
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
  rect(progressBarWidth, progressBarHeight, { radius: 10 }),
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

  // Clamp progressBarValue between 0 and 1
  progressBarValue = Math.min(Math.max(progressBarValue, 0), 1);

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
    SCORE += CLICKPOINTS;

    // Decrease ENERGY only if it's above 0
    ENERGY--;
    progressBarValue = ENERGY / MAXENERGY;

    // Update CLICKABLE based on ENERGY
    CLICKABLE = ENERGY > 0;
  }
});

// Function to replenish energy at intervals
setInterval(() => {
  if (ENERGY < MAXENERGY) {
    ENERGY++; // Increase energy
    progressBarValue = ENERGY / MAXENERGY; // Update progress bar

    // Allow clicking again if energy is replenished
    if (ENERGY > 0) {
      CLICKABLE = true;
    }
  }
}, TIMER);

// Upgrade Panel Functionality
function upgradePanel() {
  const panelWidth = 350;
  const panelHeight = 200;
  const panelPos = vec2(upgrade.pos.x + 30, upgrade.pos.y - 350);

  // Panel background
  const panelBackground = add([
    rect(panelWidth, panelHeight, { radius: 10 }),
    pos(panelPos),
    area(),
    anchor("topleft"),
    scale(1.5),
    color(rgb(26, 25, 28)),
  ]);
  upgradePanelElements.push(panelBackground);

  // Panel Title
  const panelTitle = add([
    text("Upgrade Options", { size: 16 }),
    pos(panelPos.x + panelWidth / 2, panelPos.y + 20),
    anchor("center"),
    color(rgb(255, 255, 255)),
  ]);
  upgradePanelElements.push(panelTitle);

  // Upgrade Click Points Button
  const upgradeClickButton = add([
    rect(150, 40, { radius: 5 }),
    pos(panelPos.x + 100, panelPos.y + 50),
    area(),
    color(rgb(86, 255, 86)), // Green
    "upgradeClickButton",
  ]);
  upgradePanelElements.push(upgradeClickButton);

  add([
    text("Upgrade Click (+1)", { size: 14 }),
    pos(upgradeClickButton.pos.x + 75, upgradeClickButton.pos.y + 10),
    anchor("center"),
    color(rgb(0, 0, 0)), // Black text
  ]);

  // Upgrade Energy Timer Button
  const upgradeTimerButton = add([
    rect(150, 40, { radius: 5 }),
    pos(panelPos.x + 100, panelPos.y + 110),
    area(),
    color(rgb(255, 255, 86)), // Yellow
    "upgradeTimerButton",
  ]);
  upgradePanelElements.push(upgradeTimerButton);

  add([
    text("Faster Energy (+10%)", { size: 14 }),
    pos(upgradeTimerButton.pos.x + 75, upgradeTimerButton.pos.y + 10),
    anchor("center"),
    color(rgb(0, 0, 0)), // Black text
  ]);
}

// Toggle Upgrade Panel
onClick("upgrade", () => {
  if (SHOWUPGRADE) {
    // Destroy all elements in the upgrade panel
    upgradePanelElements.forEach((element) => destroy(element));
    upgradePanelElements = []; // Clear the array
  } else {
    // Create the upgrade panel
    upgradePanel();
  }
  SHOWUPGRADE = !SHOWUPGRADE;
});

// Upgrade Click Points
onClick("upgradeClickButton", () => {
  if (SCORE >= 20) {
    SCORE -= 20;
    CLICKPOINTS++; // Add 1 to click points
  }
});

// Upgrade Energy Timer
onClick("upgradeTimerButton", () => {
  TIMER = Math.max(1000, TIMER * 0.9); // Reduce timer by 10% but not below 1 second
});
