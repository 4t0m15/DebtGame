// Game state variables
let gameMoney = 1000;
let gameDay = 1;
let gameLocation = "Main Menu"; // Start at the main menu
let gameMessages = []; // Each message will be {text: "...", type: "...", timestamp: millis(), opacity: 255}

// Game state management
let currentGameState = 'mainMenu'; // 'mainMenu', 'drugWars', 'stockMarket', 'gambling'

// Variables for main menu buttons (their positions and sizes)
let btnDrugWars, btnStockMarket, btnGambling, btnNewGame;

// Variables for Canvas-drawn game title
let gameCanvasTitle;

// Constants for fading messages
const MESSAGE_FADE_DURATION = 4000; // milliseconds for messages to fade out
const MESSAGE_MAX_DISPLAY_HEIGHT_FACTOR = 0.25; // Percentage of canvas height for message area
const MESSAGE_LINE_HEIGHT_FACTOR = 0.03; // Percentage of canvas height for each message line

// p5.js setup function - runs once when the sketch starts
function setup() {
    // Set canvas to fill the entire window
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game-container'); // Attach canvas to the specific div

    // Initial game message
    addGameMessage("Welcome to Debt Game!");

    // Setup title and button positions based on new full-screen canvas
    setupCanvasTitle();
    setupMainMenuButtons();

    // Initialize the game state display (will draw the mainMenu)
    setGameState(currentGameState);
}

// p5.js draw function - runs continuously after setup()
function draw() {
    background(50, 70, 90); // Dark blue-gray background for the canvas, matching the theme

    // Always draw the game title at the top
    drawCanvasTitle();

    // Depending on the current game state, draw different things
    if (currentGameState === 'mainMenu') {
        drawMainMenu();
    } else if (currentGameState === 'drugWars') {
        drawDrugWarsScreen();
    } else if (currentGameState === 'stockMarket') {
        drawStockMarketScreen();
    } else if (currentGameState === 'gambling') {
        drawGamblingScreen();
    }

    // Always draw game info (left) and messages (right) on top of any game screen
    drawGameInfo();
    drawFadingMessages(); // Call the new fading messages function
}

function windowResized() {
    // Resize canvas to new window dimensions
    resizeCanvas(windowWidth, windowHeight);
    // Recalculate positions for all drawn elements
    setupCanvasTitle();
    setupMainMenuButtons();
}

function mousePressed() {
    // Check for clicks only if on the main menu
    if (currentGameState === 'mainMenu') {
        if (isMouseOver(btnDrugWars)) {
            setGameState('drugWars');
        } else if (isMouseOver(btnStockMarket)) {
            setGameState('stockMarket');
        } else if (isMouseOver(btnGambling)) {
            setGameState('gambling');
        } else if (isMouseOver(btnNewGame)) {
            resetGame();
        }
    }
    // More functions will go here later for other clickable entities.
    // Handle back button click for other screens
    if (currentGameState !== 'mainMenu') {
        const backButtonWidth = width * 0.3;
        const backButtonHeight = height * 0.08;
        const backButtonX = (width - backButtonWidth) / 2;
        const backButtonY = height * 0.85;

        if (mouseX > backButtonX && mouseX < backButtonX + backButtonWidth &&
            mouseY > backButtonY && mouseY < backButtonY + backButtonHeight) {
            setGameState('mainMenu');
        }
    }
}

// Extrq function to check if mouse is hovering.
function isMouseOver(button) {
    return mouseX > button.x && mouseX < button.x + button.width &&
           mouseY > button.y && mouseY < button.y + button.height;
}

// --- Canvas Title Drawing ---
function setupCanvasTitle() {
    gameCanvasTitle = {
        text: "Debt Game",
        textSize: width * 0.05, // Responsive text size
        x: width / 2,
        y: height * 0.07, // Positioned at the top
        color: color(239, 68, 68), // Red
        shadowColor: color(255, 0, 0), // Base for glow
        shadowStrength: 4 // Reduced strength for less glare
    };
}

function drawCanvasTitle() {
    fill(gameCanvasTitle.color);
    textSize(gameCanvasTitle.textSize);
    textAlign(CENTER, CENTER);

    // Apply text shadow manually for glow effect (reduced glare)
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = gameCanvasTitle.shadowStrength; // Reduced blur for less glare
    drawingContext.shadowColor = gameCanvasTitle.shadowColor;

    text(gameCanvasTitle.text, gameCanvasTitle.x, gameCanvasTitle.y);

    // Reset shadow properties after drawing to avoid affecting other elements
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)';
}


//Drawing the main menu
function setupMainMenuButtons() {
    // Define the area where main menu elements should be drawn
    // Accounting for the Canvas Title at the top
    const topOffsetForTitle = gameCanvasTitle.y + gameCanvasTitle.textSize / 2 + height * 0.05; // Below title + some margin

    // The game info and messages are now positioned independently,
    // so the main menu can occupy more central space.
    // Adjust these based on visual testing to avoid overlap.
    const usableHeightForMenu = height * 0.6; // Take up 60% of vertical space for menu
    const menuAreaYStart = (height - usableHeightForMenu) / 2 + height * 0.1; // Shift down slightly

    const buttonWidth = width * 0.45; // Adjusted width for buttons
    const buttonHeight = usableHeightForMenu * 0.12;
    const gap = usableHeightForMenu * 0.03;

    // Center the group of 4 buttons vertically within the available menu area
    const totalButtonsHeight = 4 * buttonHeight + 3 * gap;
    const startY = menuAreaYStart + (usableHeightForMenu - totalButtonsHeight) / 2;
    const centerX = width / 2;


    btnDrugWars = {
        x: centerX - buttonWidth / 2,
        y: startY,
        width: buttonWidth,
        height: buttonHeight,
        text: '💰 Drug Wars',
        color: color(220, 50, 50) // Red
    };

    btnStockMarket = {
        x: centerX - buttonWidth / 2,
        y: startY + buttonHeight + gap,
        width: buttonWidth,
        height: buttonHeight,
        text: '📈 Stock Market',
        color: color(50, 180, 50) // Green
    };

    btnGambling = {
        x: centerX - buttonWidth / 2,
        y: startY + 2 * (buttonHeight + gap),
        width: buttonWidth,
        height: buttonHeight,
        text: '🎲 Gambling Hall',
        color: color(150, 50, 220) // Purple
    };

    btnNewGame = {
        x: centerX - (buttonWidth * 0.8) / 2, // Slightly narrower
        y: startY + 3 * (buttonHeight + gap) + gap * 2, // Below other buttons, more gap
        width: buttonWidth * 0.8,
        height: buttonHeight * 0.7, // Slightly smaller
        text: 'Start New Game',
        color: color(80, 80, 80) // Gray
    };
}

function drawMainMenu() {
    // Draw background overlay for menu (no longer covering title)
    fill(0, 0, 0, 180); // Semi-transparent dark overlay
    // Only draw overlay from below the title to the bottom
    rect(0, gameCanvasTitle.y + gameCanvasTitle.textSize / 2, width, height - (gameCanvasTitle.y + gameCanvasTitle.textSize / 2));


    // Draw buttons
    drawButton(btnDrugWars);
    drawButton(btnStockMarket);
    drawButton(btnGambling);
    drawButton(btnNewGame);

    // Main menu title and subtitle
    textAlign(CENTER, CENTER);
    textSize(width * 0.04);
    fill(255, 200, 0); // Yellow
    text("Choose Your Path", width / 2, height * 0.30); // Adjusted Y position
    textSize(width * 0.02);
    fill(200);
    text("Make a Million Dollars!", width / 2, height * 0.38); // Adjusted Y position
}
    // Generic function to draw a button
function drawButton(button) {
    let btnColor = button.color;
    let textColor = color(255); // White text

    // Hover effect
    if (isMouseOver(button)) {
        btnColor = lerpColor(btnColor, color(255), 0.2); // Lighten on hover
        cursor(HAND); // Change cursor to hand
    } else {
        cursor(ARROW); // Default cursor
    }

    fill(btnColor);
    noStroke();
    rect(button.x, button.y, button.width, button.height, 15); // Rounded corners

    // Add a subtle border for theme
    stroke(btnColor.levels[0] * 0.8, btnColor.levels[1] * 0.8, btnColor.levels[2] * 0.8);
    strokeWeight(2);
    rect(button.x, button.y, button.width, button.height, 15);


    fill(textColor);
    textSize(button.height * 0.4); // Responsive text size
    textAlign(CENTER, CENTER);
    text(button.text, button.x + button.width / 2, button.y + button.height / 2);
}


// --- Game Screen Drawing Functions (Placeholders) ---
function drawDrugWarsScreen() {
    background(100, 30, 30); // Dark red background for Drug Wars
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255, 200, 200); // Light red
    text("Drug Wars: In Progress...", width / 2, height / 2 - 40);
    textSize(18);
    fill(255);
    text("This is where the Drug Wars game logic and UI will be drawn.", width / 2, height / 2 + 10);
    // Add a "Back to Main Menu" button for testing
    drawBackButton();
}

function drawStockMarketScreen() {
    background(30, 100, 30); // Dark green background for Stock Market
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(200, 255, 200); // Light green
    text("Stock Market: Coming Soon!", width / 2, height / 2 - 40);
    textSize(18);
    fill(255);
    text("Get ready to invest.", width / 2, height / 2 + 10);
    drawBackButton();
}

function drawGamblingScreen() {
    background(80, 30, 100); // Dark purple background for Gambling
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(200, 200, 255); // Light purple
    text("Gambling Hall: Coming Soon!", width / 2, height / 2 - 40);
    textSize(18);
    fill(255);
    text("Try your luck!", width / 2, height / 2 + 10);
    drawBackButton();
}

// Function to draw a generic "Back to Main Menu" button
function drawBackButton() {
    const backButtonWidth = width * 0.3;
    const backButtonHeight = height * 0.08;
    const backButtonX = (width - backButtonWidth) / 2;
    const backButtonY = height * 0.85;

    let btnColor = color(100, 100, 100); // Gray
    if (mouseX > backButtonX && mouseX < backButtonX + backButtonWidth &&
        mouseY > backButtonY && mouseY < backButtonY + backButtonHeight) {
        btnColor = lerpColor(btnColor, color(255), 0.2);
        cursor(HAND);
    } else {
        cursor(ARROW);
    }

    fill(btnColor);
    noStroke();
    rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight, 10);

    stroke(btnColor.levels[0] * 0.8, btnColor.levels[1] * 0.8, btnColor.levels[2] * 0.8);
    strokeWeight(1);
    rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight, 10);

    fill(255);
    textSize(backButtonHeight * 0.4);
    textAlign(CENTER, CENTER);
    text("Back to Main Menu", backButtonX + backButtonWidth / 2, backButtonY + backButtonHeight / 2);

    // Attach click event for back button
    // Note: mousePressed() is where all clicks are handled for p5.js elements.
    // This `if (mouseIsPressed)` block here is just for direct visual feedback for this button.
    // The actual state change happens in mousePressed() if the button is clicked there.
}

// Function to draw game parameters (Money, Day, Location) on the canvas (positioned left)
function drawGameInfo() {
    const boxWidth = width * 0.22; // Responsive width
    const boxHeight = height * 0.15; // Responsive height
    const padding = width * 0.01; // Responsive padding
    const cornerRadius = 8;

    // Position in the top LEFT corner
    const boxX = padding;
    const boxY = padding;

    // Draw background box
    fill(0, 0, 0, 180); // More opaque black for sleekness
    noStroke();
    rect(boxX, boxY, boxWidth, boxHeight, cornerRadius);

    // Draw text
    fill(255); // White text
    const textBaseSize = height * 0.025; // Base responsive text size
    textSize(textBaseSize);
    textAlign(LEFT, TOP);
    text(`Money: $${gameMoney.toLocaleString()}`, boxX + padding, boxY + padding);
    textSize(textBaseSize * 0.9); // Slightly smaller for other lines
    text(`Day: ${gameDay}`, boxX + padding, boxY + padding + textBaseSize * 1.4);
    text(`Location: ${gameLocation}`, boxX + padding, boxY + padding + textBaseSize * 2.8);
}

// Function to draw game messages on the canvas (positioned right, smaller, sleek, fading)
function drawFadingMessages() {
    const messageAreaRightEdge = width * 0.98; // Closer to right edge
    const messageAreaTop = height * 0.02; // Start from top, slightly below canvas top
    const messageLineHeight = height * MESSAGE_LINE_HEIGHT_FACTOR; // Responsive line height

    textSize(height * 0.02); // Responsive text size for messages
    textAlign(RIGHT, TOP); // Align text to the right

    // Filter out messages that have completely faded and update opacity for others
    gameMessages = gameMessages.filter(msg => {
        const elapsedTime = millis() - msg.timestamp;
        const remainingOpacity = 255 - map(elapsedTime, 0, MESSAGE_FADE_DURATION, 0, 255);

        if (remainingOpacity <= 0) {
            return false; // Remove message if completely faded
        }
        msg.opacity = remainingOpacity; // Update opacity for drawing
        return true; // Keep message if still visible
    });

    // Draw active messages, stacking upwards from the bottom of the message area
    // Determine the Y position for the newest message, and then stack upwards.
    let currentY = messageAreaTop + (MESSAGE_MAX_DISPLAY_HEIGHT_FACTOR * height) - messageLineHeight; // Start at the "bottom" of the display area for newest message

    for (let i = gameMessages.length - 1; i >= 0; i--) { // Loop from newest to oldest
        const msg = gameMessages[i];
        let textColor;
        // Define colors for message types, applying the current opacity
        if (msg.type === 'success') textColor = color(72, 187, 120, msg.opacity); // Green
        else if (msg.type === 'error') textColor = color(239, 68, 68, msg.opacity); // Red
        else if (msg.type === 'warning') textColor = color(246, 173, 85, msg.opacity); // Orange
        else textColor = color(226, 232, 240, msg.opacity); // Light gray (info)

        fill(textColor);
        text(msg.text, messageAreaRightEdge, currentY); // Draw text aligned right
        currentY -= messageLineHeight; // Move up for the next older message

        if (currentY < messageAreaTop) { // Stop drawing if out of allocated message area
            break;
        }
    }
}


// --- Utility Functions ---
function addGameMessage(message, type = 'info') {
    // Add new message with current time and full opacity
    gameMessages.push({ text: message, type: type, timestamp: millis(), opacity: 255 });
    // Messages will be automatically removed by drawFadingMessages() when they fully fade
}

// Function to change the game state (which screen is active)
function setGameState(newState) {
    currentGameState = newState;
    if (newState === 'mainMenu') {
        gameLocation = "Main Menu";
        addGameMessage("Returned to main menu.");
    } else {
        if (newState === 'drugWars') {
            gameLocation = "Drug Wars";
            addGameMessage("Entering Drug Wars...", 'info');
        } else if (newState === 'stockMarket') {
            gameLocation = "Stock Market";
            addGameMessage("Entering Stock Market...", 'info');
        } else if (newState === 'gambling') {
            gameLocation = "Gambling Hall";
            addGameMessage("Entering Gambling Hall...", 'info');
        }
    }
}

// Function to reset the game to its initial state
function resetGame() {
    gameMoney = 1000;
    gameDay = 1;
    gameLocation = "Main Menu";
    gameMessages = []; // Clear all messages immediately on reset
    addGameMessage("Game reset. Welcome back!");
    setGameState('mainMenu'); // Go back to main menu
}

// Example functions for game progress
function advanceDay() {
    gameDay++;
    addGameMessage(`Advanced to Day ${gameDay}.`);
}

function updateMoney(amount) {
    gameMoney += amount;
    addGameMessage(`Money changed by $${amount}. Current: $${gameMoney}`);
}
