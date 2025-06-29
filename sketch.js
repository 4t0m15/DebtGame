// Game state variables
let gameMoney = 1000;
let gameDay = 1;
let gameLocation = "Main Menu"; // Start at the main menu
let gameMessages = [];

// Game state management
let currentGameState = 'mainMenu'; // 'mainMenu', 'drugWars', 'stockMarket', 'gambling'

// Variables for main menu buttons (their positions and sizes)
let btnDrugWars, btnStockMarket, btnGambling, btnNewGame;

// p5.js setup function - runs once when the sketch starts
function setup() {
    const container = document.getElementById('game-container');
    // Set canvas to fill the game-container (which is now full screen)
    const canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('game-container'); // Attach canvas to the specific div

    // Initial game message
    addGameMessage("Welcome to Millionaire Tycoon!");

    // Calculate button positions and sizes based on canvas dimensions
    // These will be relative to the canvas to ensure responsiveness
    setupMainMenuButtons();

    // Initialize the game state display (will draw the mainMenu)
    setGameState(currentGameState);
}

// p5.js draw function - runs continuously after setup()
function draw() {
    background(50, 70, 90); // Dark blue-gray background for the canvas, matching the theme

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

    // Always draw game info and messages on top of any game screen
    drawGameInfo();
    drawGameMessages();
}

function windowResized() {
    const container = document.getElementById('game-container');
    resizeCanvas(container.offsetWidth, container.offsetHeight);
    // Recalculate button positions on resize
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

//Drawing the main menu
function setupMainMenuButtons() {
    // Define the area where menu elements should be drawn to avoid overlapping info/log boxes
    // Info box is on the right, so menu can extend more to the left
    const usableWidth = width * 0.6; // Use 60% of width for main menu content
    const usableLeftPadding = (width - usableWidth) / 2; // Center this usable area

    // Top and bottom boundaries for the menu items to avoid top UI and bottom back button (if any)
    // Considering info/message boxes take up space from the top-right
    const topOffsetForUI = height * 0.35; // Start menu content below info/message boxes
    const bottomOffsetForUI = height * 0.1; // Ensure space at bottom for general layout

    const availableMenuHeight = height - topOffsetForUI - bottomOffsetForUI;

    const buttonWidth = usableWidth * 0.8; // Buttons will be 80% of usable width
    const buttonHeight = availableMenuHeight * 0.12; // Adjusted height based on available space
    const gap = availableMenuHeight * 0.03; // Spacing between buttons

    // Center the group of 4 buttons within the available menu area
    const totalButtonsHeight = 4 * buttonHeight + 3 * gap;
    const startY = topOffsetForUI + (availableMenuHeight - totalButtonsHeight) / 2;


    btnDrugWars = {
        x: usableLeftPadding + (usableWidth - buttonWidth) / 2, // Centered in usable area
        y: startY,
        width: buttonWidth,
        height: buttonHeight,
        text: '💰 Drug Wars',
        color: color(220, 50, 50) // Red
    };

    btnStockMarket = {
        x: usableLeftPadding + (usableWidth - buttonWidth) / 2,
        y: startY + buttonHeight + gap,
        width: buttonWidth,
        height: buttonHeight,
        text: '📈 Stock Market',
        color: color(50, 180, 50) // Green
    };

    btnGambling = {
        x: usableLeftPadding + (usableWidth - buttonWidth) / 2,
        y: startY + 2 * (buttonHeight + gap),
        width: buttonWidth,
        height: buttonHeight,
        text: '🎲 Gambling Hall',
        color: color(150, 50, 220) // Purple
    };

    btnNewGame = {
        x: usableLeftPadding + (usableWidth - buttonWidth * 0.8) / 2, // Slightly narrower
        y: startY + 3 * (buttonHeight + gap) + gap * 2, // Below other buttons, more gap
        width: buttonWidth * 0.8,
        height: buttonHeight * 0.7, // Slightly smaller
        text: 'Start New Game',
        color: color(80, 80, 80) // Gray
    };
}

function drawMainMenu() {
    // Draw background overlay for menu
    fill(0, 0, 0, 180); // Semi-transparent dark overlay
    rect(0, 0, width, height);

    // Title for main menu (positioned lower to avoid info boxes)
    textAlign(CENTER, CENTER);
    textSize(width * 0.04); // Slightly smaller text size
    fill(255, 200, 0); // Yellow
    text("Choose Your Path", width / 2, height * 0.15); // Adjusted Y position

    // Subtitle (positioned lower)
    textSize(width * 0.02); // Slightly smaller text size
    fill(200);
    text("Make a Million Dollars!", width / 2, height * 0.22); // Adjusted Y position

    // Draw buttons
    drawButton(btnDrugWars);
    drawButton(btnStockMarket);
    drawButton(btnGambling);
    drawButton(btnNewGame);
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

// Function to draw game parameters (Money, Day, Location) on the canvas
function drawGameInfo() {
    const boxWidth = width * 0.25; // Example: 25% of canvas width
    const boxHeight = height * 0.2; // Example: 20% of canvas height
    const padding = 10;
    const cornerRadius = 10;

    // Position in the top right corner
    const boxX = width - boxWidth - padding;
    const boxY = padding;

    // Draw background box
    fill(0, 0, 0, 150); // Semi-transparent black
    noStroke();
    rect(boxX, boxY, boxWidth, boxHeight, cornerRadius);

    // Draw text
    fill(255); // White text
    textSize(width * 0.025); // Responsive text size
    textAlign(LEFT, TOP);
    text(`Money: $${gameMoney.toLocaleString()}`, boxX + padding, boxY + padding);
    text(`Day: ${gameDay}`, boxX + padding, boxY + padding + textSize() * 1.2);
    text(`Location: ${gameLocation}`, boxX + padding, boxY + padding + textSize() * 2.4);
}

// Function to draw game messages on the canvas
function drawGameMessages() {
    const boxWidth = width * 0.35; // Example: 35% of canvas width
    const boxHeight = height * 0.3; // Example: 30% of canvas height
    const padding = 10;
    const cornerRadius = 10;
    const lineHeight = 18; // Fixed line height for messages

    // Position in the top right, below game info (adjust as needed)
    const infoBoxHeight = height * 0.2 + 20; // Approx height of info box + padding
    const boxX = width - boxWidth - padding;
    const boxY = infoBoxHeight + padding; // Below the info box

    // Draw background box
    fill(0, 0, 0, 150); // Semi-transparent black
    noStroke();
    rect(boxX, boxY, boxWidth, boxHeight, cornerRadius);

    // Draw text messages
    textSize(14); // Fixed text size for log for now
    textAlign(LEFT, TOP);

    for (let i = 0; i < gameMessages.length; i++) {
        const msg = gameMessages[i];
        let textColor;
        if (msg.type === 'success') textColor = color(72, 187, 120); // Green
        else if (msg.type === 'error') textColor = color(239, 68, 68); // Red
        else if (msg.type === 'warning') textColor = color(246, 173, 85); // Orange
        else textColor = color(226, 232, 240); // Light gray (info)

        fill(textColor);
        // Position each message line
        text(msg.text, boxX + padding, boxY + padding + i * lineHeight);

        // Basic clipping to prevent text from overflowing the box visually
        // For more advanced scrolling/clipping, you'd need a separate graphics buffer
        if (boxY + padding + (i + 1) * lineHeight > boxY + boxHeight) {
            break; // Stop drawing if past the box bottom
        }
    }
}


// --- Utility Functions ---
function addGameMessage(message, type = 'info') {
    gameMessages.push({ text: message, type: type });

    // Keep only the last 10 messages from the actual array (max 10 messages in log)
    if (gameMessages.length > 10) {
        gameMessages = gameMessages.slice(-10);
    }
    // The drawing of these messages will now be handled by drawGameMessages() in the draw loop
}

// Removed: This function is no longer needed as game info is drawn by drawGameInfo()
/*
function updateGameInfoDisplay() {
    document.getElementById('money-display').textContent = `$${gameMoney.toLocaleString()}`;
    document.getElementById('day-display').textContent = gameDay;
    document.getElementById('location-display').textContent = gameLocation;
}
*/

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
    // updateGameInfoDisplay(); // Removed: HTML info display is gone, p5.js will draw it
}

// Function to reset the game to its initial state
function resetGame() {
    gameMoney = 1000;
    gameDay = 1;
    gameLocation = "Main Menu"; // Reset location to main menu, this line was corrected
    gameMessages = []; // Clear all messages
    addGameMessage("Game reset. Welcome back!");
    setGameState('mainMenu'); // Go back to main menu
    // updateGameInfoDisplay(); // Removed: HTML info display is gone, p5.js will draw it
}

// Example functions for game progress
function advanceDay() {
    gameDay++;
    addGameMessage(`Advanced to Day ${gameDay}.`);
    // updateGameInfoDisplay(); // Removed: HTML info display is gone, p5.js will draw it
}

function updateMoney(amount) {
    gameMoney += amount;
    addGameMessage(`Money changed by $${amount}. Current: $${gameMoney}`);
    // updateGameInfoDisplay(); // Removed: HTML info display is gone, p5.js will draw it
}
