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
    const canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('game-container'); // Attach canvas to the specific div

    // Initial game message
    addGameMessage("Welcome to Millionaire Tycoon!");

    // Set initial display values
    updateGameInfoDisplay();

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
    //More functions will go here later for other clickable entities.
}

//Extrq function to check if mouse is hovering.
function isMouseOver(button) {
    return mouseX > button.x && mouseX < button.x + button.width &&
           mouseY > button.y && mouseY < button.y + button.height;
}

//Drawing the main menu
function setupMainMenuButtons() {
    // Calculate sizes and positions dynamically
    const buttonWidth = width * 0.6; // 60% of canvas width
    const buttonHeight = height * 0.1; // 10% of canvas height
    const gap = height * 0.03; // 3% of canvas height for spacing

    const startY = (height / 2) - (1.5 * buttonHeight + 1.5 * gap); // Center the group of 3 buttons

    btnDrugWars = {
        x: (width - buttonWidth) / 2,
        y: startY,
        width: buttonWidth,
        height: buttonHeight,
        text: '💰 Drug Wars',
        color: color(220, 50, 50) // Red
    };

    btnStockMarket = {
        x: (width - buttonWidth) / 2,
        y: startY + buttonHeight + gap,
        width: buttonWidth,
        height: buttonHeight,
        text: '📈 Stock Market',
        color: color(50, 180, 50) // Green
    };

    btnGambling = {
        x: (width - buttonWidth) / 2,
        y: startY + 2 * (buttonHeight + gap),
        width: buttonWidth,
        height: buttonHeight,
        text: '🎲 Gambling Hall',
        color: color(150, 50, 220) // Purple
    };

    btnNewGame = {
        x: (width - buttonWidth * 0.8) / 2, // Slightly narrower
        y: startY + 3 * (buttonHeight + gap) + gap * 2, // Below other buttons
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

    // Title for main menu
    textAlign(CENTER, CENTER);
    textSize(width * 0.05); // Responsive text size
    fill(255, 200, 0); // Yellow
    text("Choose Your Path", width / 2, height * 0.2);

    // Subtitle
    textSize(width * 0.025);
    fill(200);
    text("Make a Million Dollars!", width / 2, height * 0.3);

    // Draw buttons
    drawButton(btnDrugWars);
    drawButton(btnStockMarket);
    drawButton(btnGambling);
    drawButton(btnNewGame);
}


