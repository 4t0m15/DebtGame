// Game state variables
let gameMoney = 1000;
let gameDay = 1;
let gameLocation = "Main Menu"; // Start at the main menu
let gameMessages = []; // Each message will be {text: "...", type: "...", timestamp: millis()}

// Game state management
let currentGameState = 'mainMenu'; // 'mainMenu', 'drugWars', 'stockMarket', 'gamblingMenu', 'wallet', 'moveRegion', 'buySellStock', 'gamblingRoulette', 'gamblingDice', 'gamblingHighLow'
let selectedStockSymbol = null; // Used for the 'buySellStock' state
let buySellQuantity = ""; // String for simulated text input quantity

// Variables for main menu buttons (their positions and sizes)
let btnDrugWars, btnStockMarket, btnGambling, btnNewGame;

// Variables for Canvas-drawn game title
let gameCanvasTitle;

// Constants for fading messages
const MESSAGE_FADE_IN_DURATION = 500;   // milliseconds for messages to fade in
const MESSAGE_HOLD_DURATION = 2000;    // milliseconds for messages to stay fully opaque
const MESSAGE_FADE_OUT_DURATION = 1500; // milliseconds for messages to fade out
const MESSAGE_TOTAL_DURATION = MESSAGE_FADE_IN_DURATION + MESSAGE_HOLD_DURATION + MESSAGE_FADE_OUT_DURATION;

const MESSAGE_MAX_DISPLAY_HEIGHT_FACTOR = 0.25; // Percentage of canvas height for message area
const MESSAGE_LINE_HEIGHT_FACTOR = 0.03; // Percentage of canvas height for each message line

// Constant for blinking effect
const BLINK_INTERVAL = 700; // milliseconds for one phase (e.g., 700ms on, 700ms off)

// --- Stock Market Variables ---
const regions = [
    { name: "Global Exchange", stocks: ["AURAX", "CYBRP", "ENRGY", "FINCO", "HYGEN"] },
    { name: "Tech Innovations Hub", stocks: ["QUANT", "NEURO", "DATAM", "ROBOS", "SPACEX"] },
    { name: "Emerging Markets League", stocks: ["AGROX", "INFRA", "MINEF", "TEXLA", "PHARM"] },
    { name: "European Financial Core", stocks: ["LUXOR", "PRISM", "VANGU", "ALPHO", "ZETAO"] },
    { name: "Asian Growth Nexus", stocks: ["KRYPT", "ZENIT", "DYNMC", "NEXUS", "OMEGA"] },
    { name: "Latin American Ventures", stocks: ["SOLAR", "RAINF", "HARVST", "TRADE", "BRIGHT"] }
];
let currentRegionIndex = 0; // Default to Global Exchange

// Stores stock data: { symbol: { price: float, prevPrice: float, volatility: float, history: [] } }
let stocksData = {};
// Player's portfolio: { symbol: { quantity: int, avgPrice: float } }
let playerPortfolio = {};

// Buttons specific to stock market screen
let btnNextDay, btnMoveRegion, btnWallet;
let stockTiles = []; // Array of objects for clickable stock tiles

// Buttons for navigation
let btnBackToStockMarket;
let btnBackToMain; // Declared globally for access
let btnBackToGamblingMenu; // Back button for individual gambling games

// --- Gambling Variables ---
let gamblingBetAmount = ""; // Current bet amount input
let gamblingResultText = ""; // Text to display game result
let gamblingOutcomeColor = color(255); // Color for game result text

// Roulette specific
let rouletteWheelValue = -1; // -1 for not spun, 0 for green, 1-36 for numbers
let rouletteBetType = 'none'; // 'red', 'black', 'green', 'even', 'odd', 'number'
let rouletteLastSpinTime = 0;
const ROULETTE_SPIN_DURATION = 1500; // Time for spin animation

// Dice specific
let diceRollValue1 = 1;
let diceRollValue2 = 1;
let diceBetType = 'none'; // 'over7', 'under7', 'exact7'
let diceLastRollTime = 0;
const DICE_ROLL_DURATION = 1000; // Time for roll animation

// High-Low specific
let highLowCard1 = null;
let highLowCard2 = null;
let highLowChoice = 'none'; // 'high', 'low'
let highLowRevealed = false; // True if second card is revealed
const CARD_SUITS = ['♠', '♣', '♥', '♦'];
const CARD_RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
// Values for High-Low (Aces high)
const CARD_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 11, 'Q': 12, 'K': 13, 'A': 14
};
let highLowLastGameTime = 0;
const HIGHLOW_REVEAL_DURATION = 1000; // Time for second card reveal


// p5.js setup function - runs once when the sketch starts
function setup() {
    // Set canvas to fill the entire window
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('game-container'); // Attach canvas to the specific div

    // Initialize stock data
    initializeStocks();

    // Initial game message
    addGameMessage("Welcome to Debt Game!");

    // Setup title and button positions based on new full-screen canvas
    setupCanvasTitle();
    setupMainMenuButtons(); // Call once at start

    // Set up stock market specific buttons (done once as their relative position is stable)
    setupStockMarketButtons();

    // Set up gambling specific buttons (done once)
    setupGamblingButtons();

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
    } else if (currentGameState === 'gamblingMenu') {
        drawGamblingMenu();
    } else if (currentGameState === 'gamblingRoulette') {
        drawRouletteGame();
    } else if (currentGameState === 'gamblingDice') {
        drawDiceGame();
    } else if (currentGameState === 'gamblingHighLow') {
        drawHighLowGame();
    }
    else if (currentGameState === 'wallet') {
        drawWalletScreen();
    } else if (currentGameState === 'moveRegion') {
        drawMoveRegionScreen();
    } else if (currentGameState === 'buySellStock') {
        drawBuySellStockScreen(selectedStockSymbol);
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
    setupMainMenuButtons(); // Re-calculate main menu button positions
    setupStockMarketButtons(); // Re-calculate stock market specific button positions
    setupGamblingButtons(); // Re-calculate gambling buttons
}

function mousePressed() {
    if (currentGameState === 'mainMenu') {
        if (isMouseOver(btnDrugWars)) {
            setGameState('drugWars');
        } else if (isMouseOver(btnStockMarket)) {
            setGameState('stockMarket');
        } else if (isMouseOver(btnGambling)) {
            setGameState('gamblingMenu');
        } else if (isMouseOver(btnNewGame)) {
            resetGame();
        }
    } else if (currentGameState === 'stockMarket') {
        if (isMouseOver(btnNextDay)) {
            advanceDay();
        } else if (isMouseOver(btnMoveRegion)) {
            setGameState('moveRegion');
        } else if (isMouseOver(btnWallet)) {
            setGameState('wallet');
        } else if (isMouseOver(btnBackToMain)) {
            setGameState('mainMenu');
        } else {
            // Check for stock tile clicks
            for (let i = 0; i < stockTiles.length; i++) {
                if (isMouseOver(stockTiles[i])) {
                    selectedStockSymbol = stockTiles[i].symbol;
                    setGameState('buySellStock');
                    buySellQuantity = ""; // Clear quantity input
                    break;
                }
            }
        }
    } else if (currentGameState === 'wallet') {
        if (isMouseOver(btnBackToStockMarket)) {
            setGameState('stockMarket');
        }
    } else if (currentGameState === 'moveRegion') {
        // Handle region selection buttons
        for (let i = 0; i < regions.length; i++) {
            const regionBtn = {
                x: width / 2 - (width * 0.45) / 2,
                y: height * 0.25 + i * (height * 0.08 + height * 0.02),
                width: width * 0.45,
                height: height * 0.08,
            };
            if (isMouseOver(regionBtn)) {
                if (i !== currentRegionIndex) {
                    changeRegion(i);
                } else {
                    addGameMessage(`Already in ${regions[i].name}.`, 'warning');
                }
                break;
            }
        }
        if (isMouseOver(btnBackToStockMarket)) {
            setGameState('stockMarket');
        }
    } else if (currentGameState === 'buySellStock') {
        const btnBuy = { x: width * 0.35, y: height * 0.7, width: width * 0.1, height: height * 0.06 };
        const btnSell = { x: width * 0.55, y: height * 0.7, width: width * 0.1, height: height * 0.06 };
        const btnMaxBuy = { x: btnBuy.x - (width * 0.07 + 10), y: height * 0.63, width: width * 0.07, height: height * 0.04 };
        const btnMaxSell = { x: btnSell.x + btnSell.width + 10, y: height * 0.63, width: width * 0.07, height: height * 0.04 };


        if (isMouseOver(btnBuy)) {
            buyStock(selectedStockSymbol, int(buySellQuantity));
            buySellQuantity = "";
        } else if (isMouseOver(btnSell)) {
            sellStock(selectedStockSymbol, int(buySellQuantity));
            buySellQuantity = "";
        } else if (isMouseOver(btnBackToStockMarket)) {
            setGameState('stockMarket');
        } else if (isMouseOver(btnMaxSell)) {
            buySellQuantity = (playerPortfolio[selectedStockSymbol] ? playerPortfolio[selectedStockSymbol].quantity : 0).toString();
        } else if (isMouseOver(btnMaxBuy)) {
            const stockPrice = stocksData[selectedStockSymbol].price;
            if (stockPrice > 0) {
                buySellQuantity = Math.floor(gameMoney / stockPrice).toString();
            } else {
                buySellQuantity = "0";
            }
        }
    } else if (currentGameState === 'gamblingMenu') {
        const btnRoulette = { x: width / 2 - (width * 0.45) / 2, y: height * 0.25 + 0 * (height * 0.08 + height * 0.02), width: width * 0.45, height: height * 0.08 };
        const btnDice = { x: width / 2 - (width * 0.45) / 2, y: height * 0.25 + 1 * (height * 0.08 + height * 0.02), width: width * 0.45, height: height * 0.08 };
        const btnHighLow = { x: width / 2 - (width * 0.45) / 2, y: height * 0.25 + 2 * (height * 0.08 + height * 0.02), width: width * 0.45, height: height * 0.08 };

        if (isMouseOver(btnRoulette)) {
            setGameState('gamblingRoulette');
            gamblingBetAmount = ""; // Reset bet input
            rouletteWheelValue = -1; // Reset roulette state
            rouletteBetType = 'none';
            gamblingResultText = "";
        } else if (isMouseOver(btnDice)) {
            setGameState('gamblingDice');
            gamblingBetAmount = ""; // Reset bet input
            diceRollValue1 = 1; // Reset dice state
            diceRollValue2 = 1;
            diceBetType = 'none';
            gamblingResultText = "";
        } else if (isMouseOver(btnHighLow)) {
            setGameState('gamblingHighLow');
            gamblingBetAmount = ""; // Reset bet input
            highLowCard1 = null; // Reset high-low state
            highLowCard2 = null;
            highLowRevealed = false;
            gamblingResultText = "";
            startHighLow(); // Start a new round
        } else if (isMouseOver(btnBackToMain)) {
            setGameState('mainMenu');
        }
    } else if (currentGameState === 'gamblingRoulette') {
        const betAmt = int(gamblingBetAmount);
        const betRed = { x: width * 0.3, y: height * 0.65, width: width * 0.1, height: height * 0.06 };
        const betBlack = { x: width * 0.45, y: height * 0.65, width: width * 0.1, height: height * 0.06 };
        const betGreen = { x: width * 0.6, y: height * 0.65, width: width * 0.1, height: height * 0.06 };
        const betSpin = { x: width / 2 - (width * 0.15) / 2, y: height * 0.75, width: width * 0.15, height: height * 0.08 };

        if (isMouseOver(betRed) && betAmt > 0) spinRoulette(betAmt, 'red');
        else if (isMouseOver(betBlack) && betAmt > 0) spinRoulette(betAmt, 'black');
        else if (isMouseOver(betGreen) && betAmt > 0) spinRoulette(betAmt, 'green');
        else if (isMouseOver(betSpin) && rouletteBetType !== 'none' && betAmt > 0) { // Only spin if a bet type is selected
            spinRoulette(betAmt, rouletteBetType); // Use the currently selected bet type
        }
        else if (isMouseOver(btnBackToGamblingMenu)) {
            setGameState('gamblingMenu');
        } else if (betAmt <= 0 && isMouseOver(betSpin)) {
             addGameMessage("Please enter a bet amount.", 'warning');
        }
    } else if (currentGameState === 'gamblingDice') {
        const betAmt = int(gamblingBetAmount);
        const betUnder7 = { x: width * 0.3, y: height * 0.65, width: width * 0.15, height: height * 0.06 };
        const betExact7 = { x: width * 0.475, y: height * 0.65, width: width * 0.15, height: height * 0.06 };
        const betOver7 = { x: width * 0.65, y: height * 0.65, width: width * 0.15, height: height * 0.06 };
        const betRoll = { x: width / 2 - (width * 0.15) / 2, y: height * 0.75, width: width * 0.15, height: height * 0.08 };

        if (isMouseOver(betUnder7) && betAmt > 0) rollDice(betAmt, 'under7');
        else if (isMouseOver(betExact7) && betAmt > 0) rollDice(betAmt, 'exact7');
        else if (isMouseOver(betOver7) && betAmt > 0) rollDice(betAmt, 'over7');
        else if (isMouseOver(betRoll) && diceBetType !== 'none' && betAmt > 0) {
            rollDice(betAmt, diceBetType);
        }
        else if (isMouseOver(btnBackToGamblingMenu)) {
            setGameState('gamblingMenu');
        } else if (betAmt <= 0 && isMouseOver(betRoll)) {
             addGameMessage("Please enter a bet amount.", 'warning');
        }
    } else if (currentGameState === 'gamblingHighLow') {
        const betAmt = int(gamblingBetAmount);
        const btnHigh = { x: width * 0.35, y: height * 0.7, width: width * 0.1, height: height * 0.06 };
        const btnLow = { x: width * 0.55, y: height * 0.7, width: width * 0.1, height: height * 0.06 };
        const btnDeal = { x: width / 2 - (width * 0.15) / 2, y: height * 0.8, width: width * 0.15, height: height * 0.08 };

        if (!highLowRevealed) { // Only allow High/Low choice if cards not revealed
            if (isMouseOver(btnHigh) && highLowCard1 && betAmt > 0) placeHighLowBet(betAmt, 'high');
            else if (isMouseOver(btnLow) && highLowCard1 && betAmt > 0) placeHighLowBet(betAmt, 'low');
        }

        if (isMouseOver(btnDeal) && (highLowRevealed || !highLowCard1) ) { // Allow new game if revealed or initial state
            startHighLow();
            gamblingBetAmount = ""; // Reset bet amount
            gamblingResultText = ""; // Clear result text
        }
        else if (isMouseOver(btnBackToGamblingMenu)) {
            setGameState('gamblingMenu');
        } else if (betAmt <= 0 && !highLowRevealed && highLowCard1 && (isMouseOver(btnHigh) || isMouseOver(btnLow))) {
            addGameMessage("Please enter a bet amount.", 'warning');
        }
    }
    // Generic back button for drugWars
    else if (currentGameState === 'drugWars') {
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

function keyPressed() {
    if (currentGameState === 'buySellStock' || currentGameState === 'gamblingRoulette' || currentGameState === 'gamblingDice' || currentGameState === 'gamblingHighLow') {
        if (keyCode === BACKSPACE) {
            gamblingBetAmount = gamblingBetAmount.substring(0, gamblingBetAmount.length - 1);
        } else if (key >= '0' && key <= '9') {
            gamblingBetAmount += key;
        }
    }
}

// Helper function to check if mouse is over a button
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


// --- Main Menu Drawing and Logic (p5.js handled) ---
function setupMainMenuButtons() {
    // Define the area where main menu elements should be drawn
    const topOffsetForTitle = gameCanvasTitle.y + gameCanvasTitle.textSize / 2 + height * 0.05; // Below title + some margin

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

    // Blinking "Choose Your Path" text
    if (floor(millis() / BLINK_INTERVAL) % 2 === 0) { // Toggle visibility based on time
        textAlign(CENTER, CENTER);
        textSize(width * 0.04);
        fill(255, 200, 0); // Yellow
        text("Choose Your Path", width / 2, height * 0.30); // Adjusted Y position
    }

    // "Make a Million Dollars!" subtitle (non-blinking)
    textAlign(CENTER, CENTER);
    textSize(width * 0.02);
    fill(200);
    text("Make a Million Dollars!", width / 2, height * 0.38); // Adjusted Y position

    // Draw buttons
    drawButton(btnDrugWars);
    drawButton(btnStockMarket);
    drawButton(btnGambling);
    drawButton(btnNewGame);
}
    // Generic function to draw a button with enhanced styling
function drawButton(button) {
    let btnColor = button.color;
    let textColor = color(255); // White text
    let currentStrokeWeight = 2;
    let currentShadowBlur = 0;
    let shadowColor = 'rgba(0,0,0,0)';

    // Hover effect
    if (isMouseOver(button)) {
        btnColor = lerpColor(btnColor, color(255), 0.2); // Lighten on hover
        currentShadowBlur = 15; // Increased glow on hover
        shadowColor = btnColor; // Glow color matches button
        cursor(HAND); // Change cursor to hand
    } else {
        cursor(ARROW); // Default cursor
    }

    // Apply shadow before drawing the button
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = currentShadowBlur;
    drawingContext.shadowColor = shadowColor;

    // Draw button background (gradient-like effect)
    for (let i = 0; i < button.height / 2; i++) {
        let inter = map(i, 0, button.height / 2, 0, 1);
        let c = lerpColor(btnColor, color(btnColor.levels[0] * 0.6, btnColor.levels[1] * 0.6, btnColor.levels[2] * 0.6), inter);
        fill(c);
        rect(button.x, button.y + i, button.width, 2, 15); // Top half
        rect(button.x, button.y + button.height - i - 2, button.width, 2, 15); // Bottom half
    }
    fill(btnColor); // Fill the middle part
    rect(button.x, button.y + button.height / 2, button.width, 0, 15);


    noStroke();
    rect(button.x, button.y, button.width, button.height, 15); // Main button shape for click detection and final fill

    // Reset shadow properties after drawing button
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)';

    // Add a subtle border
    stroke(btnColor.levels[0] * 0.8, btnColor.levels[1] * 0.8, btnColor.levels[2] * 0.8);
    strokeWeight(currentStrokeWeight);
    noFill(); // Draw only border
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

// --- Stock Market Functions ---

function initializeStocks() {
    for (const region of regions) {
        for (const symbol of region.stocks) {
            stocksData[symbol] = {
                price: parseFloat((random(50, 200)).toFixed(2)), // Initial price
                prevPrice: 0, // Will be updated on first day advance
                volatility: random(0.08, 0.25), // Increased volatility range
                history: [] // To store price history if needed later
            };
        }
    }
    // Initial portfolio (empty)
    playerPortfolio = {};
}

function advanceStockPrices() {
    for (const symbol in stocksData) {
        stocksData[symbol].prevPrice = stocksData[symbol].price; // Store previous price
        let change = stocksData[symbol].price * stocksData[symbol].volatility * random(-1, 1);
        stocksData[symbol].price = parseFloat((stocksData[symbol].price + change).toFixed(2));
        // Ensure price doesn't go below a reasonable minimum
        if (stocksData[symbol].price < 1) stocksData[symbol].price = 1; // Prevent price from going to zero or negative
    }
    addGameMessage("Stock prices updated.", 'info');
}

function setupStockMarketButtons() {
    const buttonWidth = width * 0.2;
    const buttonHeight = height * 0.07;
    const gap = width * 0.01;

    // Position buttons at the bottom center
    const startX = width / 2 - (buttonWidth * 1.5 + gap); // Adjusted to center 3 buttons
    const btnY = height * 0.9;

    btnNextDay = {
        x: startX,
        y: btnY,
        width: buttonWidth,
        height: buttonHeight,
        text: 'Next Day',
        color: color(60, 90, 150) // Blueish-gray
    };
    btnMoveRegion = {
        x: startX + buttonWidth + gap,
        y: btnY,
        width: buttonWidth,
        height: buttonHeight,
        text: 'Move',
        color: color(90, 60, 150) // Purplish-gray
    };
    btnWallet = {
        x: startX + 2 * (buttonWidth + gap),
        y: btnY,
        width: buttonWidth,
        height: buttonHeight,
        text: 'Wallet',
        color: color(60, 150, 90) // Greenish-gray
    };
    // Back to Stock Market button (used in wallet/move/buy-sell)
    btnBackToStockMarket = {
        x: width / 2 - (width * 0.2) / 2, // Centered
        y: height * 0.9, // Positioned at the bottom
        width: width * 0.2,
        height: height * 0.07,
        text: 'Back',
        color: color(100, 100, 100) // Neutral gray
    };

    // Main stock market back button (to main menu)
    btnBackToMain = {
        x: width / 2 - (width * 0.2) / 2, // Centered
        y: height * 0.8, // Slightly higher to not overlap with stock market specific buttons
        width: width * 0.2,
        height: height * 0.07,
        text: 'Main Menu',
        color: color(100, 100, 100) // Neutral gray
    };
}

function drawStockMarketScreen() {
    background(35, 45, 60); // Dark, desaturated blue-gray background, replacing green

    // Region Display Panel
    const regionPanelWidth = width * 0.6;
    const regionPanelHeight = height * 0.1;
    const regionPanelX = width / 2 - regionPanelWidth / 2;
    const regionPanelY = height * 0.15; // Position below main title

    // Modern flat/subtle design for region panel
    fill(45, 55, 70); // Slightly lighter than background
    stroke(80, 95, 110); // Subtle light border
    strokeWeight(1);
    rect(regionPanelX, regionPanelY, regionPanelWidth, regionPanelHeight, 10); // Slightly rounded corners

    // Add a very subtle inner shadow for depth
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 2;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = 'rgba(0,0,0,0.3)';
    rect(regionPanelX, regionPanelY, regionPanelWidth, regionPanelHeight, 10);
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)';

    fill(240, 245, 250); // Off-white for readability
    textSize(width * 0.028); // Slightly smaller, sleeker text
    textAlign(CENTER, CENTER);
    text(regions[currentRegionIndex].name, regionPanelX + regionPanelWidth / 2, regionPanelY + regionPanelHeight / 2);


    // Draw stock tiles
    const stocksInRegion = regions[currentRegionIndex].stocks;
    const numStocks = stocksInRegion.length;
    const tileWidth = width * 0.17; // Adjust tile width
    const tileHeight = height * 0.18; // Taller tiles for more info
    const tileGapX = width * 0.015; // Reduced gap
    const tileGapY = height * 0.02;

    // Calculate starting X to center the tiles
    const totalTilesWidth = numStocks * tileWidth + (numStocks - 1) * tileGapX;
    let startX = (width - totalTilesWidth) / 2;
    const startY = height * 0.3; // Position below region panel

    stockTiles = []; // Clear and re-populate for current view

    for (let i = 0; i < numStocks; i++) {
        const symbol = stocksInRegion[i];
        const stock = stocksData[symbol];
        const tileX = startX + i * (tileWidth + tileGapX);
        const tileY = startY;

        stockTiles.push({ x: tileX, y: tileY, width: tileWidth, height: tileHeight, symbol: symbol });

        // Tile background with subtle modern look
        let tileBaseColor = color(50, 60, 75); // Dark blue-gray
        let tileHoverColor = color(70, 85, 100); // Lighter blue-gray on hover

        let currentTileColor = tileBaseColor;
        if (isMouseOver(stockTiles[i])) {
            currentTileColor = tileHoverColor;
            cursor(HAND);
        } else {
            cursor(ARROW);
        }

        // Apply outer shadow for depth
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 5;
        drawingContext.shadowBlur = 10;
        drawingContext.shadowColor = 'rgba(0,0,0,0.4)';

        fill(currentTileColor);
        noStroke();
        rect(tileX, tileY, tileWidth, tileHeight, 12); // Rounded corners

        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = 'rgba(0,0,0,0)'; // Reset shadow

        // Inner border for crispness
        stroke(100, 115, 130);
        strokeWeight(1);
        noFill();
        rect(tileX, tileY, tileWidth, tileHeight, 12);

        // Stock Info - Symbols (top center)
        fill(240, 245, 250); // Off-white
        textSize(tileHeight * 0.22); // Responsive text size
        textAlign(CENTER, TOP);
        text(symbol, tileX + tileWidth / 2, tileY + tileHeight * 0.1);

        // Current Price (middle center)
        fill(255, 230, 0); // Gold-yellow for price
        textSize(tileHeight * 0.28); // Larger, more prominent price
        text(`$${stock.price.toFixed(2)}`, tileX + tileWidth / 2, tileY + tileHeight * 0.45);

        // Price change indicator (bottom center)
        if (stock.prevPrice !== 0) {
            const change = stock.price - stock.prevPrice;
            let changeColor;
            let arrow = '';

            if (change > 0) {
                changeColor = color(50, 220, 100); // Muted green for positive
                arrow = '▲ ';
            } else if (change < 0) {
                changeColor = color(220, 80, 80); // Muted red for negative
                arrow = '▼ ';
            } else {
                changeColor = color(180, 180, 180); // Gray for no change
            }

            fill(changeColor);
            textSize(tileHeight * 0.15); // Smaller text for change
            text(`${arrow}${abs(change).toFixed(2)}`, tileX + tileWidth / 2, tileY + tileHeight * 0.75);
        }
    }

    // Draw action buttons - using enhanced drawButton function
    drawButton(btnNextDay);
    drawButton(btnMoveRegion);
    drawButton(btnWallet);
    drawButton(btnBackToMain); // Back to main menu
}

function drawWalletScreen() {
    background(45, 55, 70); // Darker blue-gray background for Wallet

    fill(240, 245, 250);
    textSize(width * 0.03);
    textAlign(CENTER, TOP);
    text("Your Portfolio", width / 2, height * 0.15);

    // Table design
    const tableYStart = height * 0.25;
    const colWidth = width * 0.15;
    const rowHeight = height * 0.05;
    const startX = width / 2 - (colWidth * 2.5); // Center the table

    // Table background container
    fill(35, 45, 60, 220); // Darker, more opaque background
    stroke(80, 95, 110);
    strokeWeight(1);
    rect(startX - 10, tableYStart - rowHeight * 0.8, colWidth * 5 + 20, (Object.keys(playerPortfolio).length + 1) * rowHeight + rowHeight * 0.6, 8); // Slightly rounded

    // Table headers
    textSize(height * 0.023); // Slightly smaller header text
    fill(255, 230, 0); // Gold-yellow for headers
    textAlign(CENTER, CENTER);
    text("Symbol", startX + colWidth * 0.5, tableYStart);
    text("Quantity", startX + colWidth * 1.5, tableYStart);
    text("Avg. Price", startX + colWidth * 2.5, tableYStart);
    text("Current Value", startX + colWidth * 3.5, tableYStart);
    text("P/L", startX + colWidth * 4.5, tableYStart);

    let currentY = tableYStart + rowHeight;
    let rowNumber = 0;
    for (const symbol in playerPortfolio) {
        const item = playerPortfolio[symbol];
        const currentStock = stocksData[symbol];
        if (!currentStock) continue; // Skip if stock data not found

        const currentValue = item.quantity * currentStock.price;
        const profitLoss = currentValue - (item.quantity * item.avgPrice);

        // Alternating row background
        if (rowNumber % 2 === 0) {
            fill(50, 60, 75, 180); // Slightly lighter blue-gray for even rows
        } else {
            fill(45, 55, 70, 180); // Darker blue-gray for odd rows
        }
        noStroke();
        rect(startX - 10, currentY - rowHeight * 0.5, colWidth * 5 + 20, rowHeight, 0); // Draw row background

        fill(240, 245, 250); // Off-white for data text
        textSize(height * 0.018); // Smaller data text
        textAlign(CENTER, CENTER);

        text(symbol, startX + colWidth * 0.5, currentY);
        text(item.quantity, startX + colWidth * 1.5, currentY);
        text(`$${item.avgPrice.toFixed(2)}`, startX + colWidth * 2.5, currentY);
        text(`$${currentValue.toFixed(2)}`, startX + colWidth * 3.5, currentY);

        let plColor;
        if (profitLoss > 0) plColor = color(50, 220, 100);
        else if (profitLoss < 0) plColor = color(220, 80, 80);
        else plColor = color(180); // Neutral gray
        fill(plColor);
        text(`$${profitLoss.toFixed(2)}`, startX + colWidth * 4.5, currentY);

        currentY += rowHeight;
        rowNumber++;
    }

    drawButton(btnBackToStockMarket); // Reusing the back button style
}

function drawMoveRegionScreen() {
    background(45, 55, 70); // Dark blue-gray background for Move screen
    fill(240, 245, 250);
    textSize(width * 0.03);
    textAlign(CENTER, TOP);
    text("Choose a Region", width / 2, height * 0.15);

    // Draw region buttons
    const buttonWidth = width * 0.45;
    const buttonHeight = height * 0.08;
    const gap = height * 0.02; // Vertical gap

    let currentY = height * 0.25;
    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        const btnX = width / 2 - buttonWidth / 2;
        const btnY = currentY;

        let regionColor = color(60, 70, 85); // Darker blue-gray for unselected
        let textColor = color(240, 245, 250);
        let currentStrokeWeight = 1.5;
        let borderColor = color(100, 115, 130); // Subtle border
        let currentShadowBlur = 0;
        let shadowColor = 'rgba(0,0,0,0)';

        if (i === currentRegionIndex) {
            regionColor = color(80, 130, 100); // Muted green for selected
            textColor = color(255); // Brighter text for selected
            currentStrokeWeight = 3;
            borderColor = color(255, 230, 0); // Yellow border for selected
            currentShadowBlur = 10;
            shadowColor = color(80, 130, 100, 150); // Greenish glow for selected
        }

        if (mouseX > btnX && mouseX < btnX + buttonWidth &&
            mouseY > btnY && mouseY < btnY + buttonHeight) {
            regionColor = lerpColor(regionColor, color(100, 115, 130), 0.2); // Lighten on hover
            currentShadowBlur = 15; // Increased glow on hover
            shadowColor = regionColor; // Glow color matches button
            cursor(HAND);
        } else {
            cursor(ARROW);
        }

        // Apply shadow
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 5;
        drawingContext.shadowBlur = currentShadowBlur;
        drawingContext.shadowColor = shadowColor;

        fill(regionColor);
        stroke(borderColor);
        strokeWeight(currentStrokeWeight);
        rect(btnX, btnY, buttonWidth, buttonHeight, 15); // Rounded corners

        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = 'rgba(0,0,0,0)'; // Reset shadow

        fill(textColor);
        textSize(buttonHeight * 0.4);
        textAlign(CENTER, CENTER);
        text(region.name, btnX + buttonWidth / 2, btnY + buttonHeight / 2);

        currentY += buttonHeight + gap;
    }

    drawButton(btnBackToStockMarket);
}

function drawBuySellStockScreen(symbol) {
    if (!symbol || !stocksData[symbol]) {
        background(0);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(32);
        text("Error: Stock not found!", width / 2, height / 2);
        drawButton(btnBackToStockMarket);
        return;
    }

    const stock = stocksData[symbol];
    const ownedQuantity = playerPortfolio[symbol] ? playerPortfolio[symbol].quantity : 0;

    background(35, 45, 60); // Dark blue-gray background for buy/sell

    fill(240, 245, 250);
    textSize(width * 0.04);
    textAlign(CENTER, TOP);
    text(`${symbol} Stock Details`, width / 2, height * 0.15);

    // Display stock details prominently
    const detailTextSize = height * 0.035; // Larger text for details
    const detailLineSpacing = detailTextSize * 1.5;
    const detailX = width / 2;
    let detailY = height * 0.25;

    fill(255, 230, 0); // Gold-yellow for current price
    textSize(detailTextSize);
    text(`Current Price: $${stock.price.toFixed(2)}`, detailX, detailY);

    fill(200, 210, 220); // Light gray for owned quantity
    detailY += detailLineSpacing;
    text(`Owned: ${ownedQuantity}`, detailX, detailY);

    fill(255, 180, 180); // Softer red for money
    detailY += detailLineSpacing;
    text(`Your Money: $${gameMoney.toLocaleString()}`, detailX, detailY);

    // Quantity input (simulated)
    const inputX = width / 2 - (width * 0.2) / 2;
    const inputY = height * 0.5;
    const inputWidth = width * 0.2;
    const inputHeight = height * 0.06;

    // Input field background
    fill(30, 40, 50); // Even darker grey
    stroke(100, 115, 130); // Lighter border
    strokeWeight(1);
    rect(inputX, inputY, inputWidth, inputHeight, 8); // Rounded corners

    fill(240, 245, 250);
    textSize(width * 0.02);
    textAlign(CENTER, CENTER);
    text(buySellQuantity || 'Enter Qty', inputX + inputWidth / 2, inputY + inputHeight / 2);

    // Buy / Sell / Max buttons
    const btnBuy = { x: width * 0.35, y: height * 0.7, width: width * 0.1, height: height * 0.06, text: 'Buy', color: color(50, 180, 50) };
    const btnSell = { x: width * 0.55, y: height * 0.7, width: width * 0.1, height: height * 0.06, text: 'Sell', color: color(220, 50, 50) };
    const btnMaxSell = { x: btnSell.x + btnSell.width + 10, y: height * 0.63, width: width * 0.07, height: height * 0.04, text: 'Max', color: color(100, 100, 100) };
    const btnMaxBuy = { x: btnBuy.x - (width * 0.07 + 10), y: height * 0.63, width: width * 0.07, height: height * 0.04, text: 'Max', color: color(100, 100, 100) };

    drawButton(btnBuy);
    drawButton(btnSell);
    drawButton(btnMaxSell);
    drawButton(btnMaxBuy);

    drawButton(btnBackToStockMarket);
}

function buyStock(symbol, quantity) {
    if (quantity <= 0 || isNaN(quantity)) {
        addGameMessage("Enter a valid quantity.", 'error');
        return;
    }
    const stock = stocksData[symbol];
    const cost = stock.price * quantity;

    if (gameMoney >= cost) {
        gameMoney -= cost;
        if (!playerPortfolio[symbol]) {
            playerPortfolio[symbol] = { quantity: 0, avgPrice: 0 };
        }
        // Calculate new average price
        const totalOldCost = playerPortfolio[symbol].quantity * playerPortfolio[symbol].avgPrice;
        playerPortfolio[symbol].quantity += quantity;
        playerPortfolio[symbol].avgPrice = (totalOldCost + cost) / playerPortfolio[symbol].quantity;

        addGameMessage(`Bought ${quantity} shares of ${symbol} for $${cost.toFixed(2)}.`, 'success');
        updateMoney(0); // Trigger money display update
    } else {
        addGameMessage("Not enough money to buy!", 'error');
    }
}

function sellStock(symbol, quantity) {
    if (quantity <= 0 || isNaN(quantity)) {
        addGameMessage("Enter a valid quantity.", 'error');
        return;
    }
    if (!playerPortfolio[symbol] || playerPortfolio[symbol].quantity < quantity) {
        addGameMessage("Not enough shares to sell!", 'error');
        return;
    }
    const stock = stocksData[symbol];
    const revenue = stock.price * quantity;
    gameMoney += revenue;

    playerPortfolio[symbol].quantity -= quantity;

    if (playerPortfolio[symbol].quantity === 0) {
        delete playerPortfolio[symbol]; // Remove from portfolio if quantity is zero
    }
    addGameMessage(`Sold ${quantity} shares of ${symbol} for $${revenue.toFixed(2)}.`, 'success');
    updateMoney(0); // Trigger money display update
}

function changeRegion(newIndex) {
    // A small cost to move regions to add more strategy
    const moveCost = 50; // Example cost

    if (gameMoney < moveCost) {
        addGameMessage(`Not enough money to move! Requires $${moveCost}.`, 'error');
        return;
    }
    
    if (gameDay <= 1) { // Prevent moving on Day 1 (or other logic if needed)
        addGameMessage("Cannot move on Day 1.", 'warning');
        return;
    }

    if (newIndex >= 0 && newIndex < regions.length) {
        gameMoney -= moveCost; // Deduct cost
        currentRegionIndex = newIndex;
        advanceDay(); // Moving takes a day
        addGameMessage(`Moved to ${regions[currentRegionIndex].name} for $${moveCost}.`, 'info');
        setGameState('stockMarket'); // Return to stock market view
    } else {
        addGameMessage("Invalid region selected.", 'error');
    }
}


// --- Gambling Hall Functions ---
function setupGamblingButtons() {
    // These buttons are setup once, their positions are relative to canvas size.
    // btnBackToGamblingMenu is also setup here for consistent styling.
    btnBackToGamblingMenu = {
        x: width / 2 - (width * 0.2) / 2, // Centered
        y: height * 0.9,
        width: width * 0.2,
        height: height * 0.07,
        text: 'Back',
        color: color(100, 100, 100) // Neutral gray
    };
}

function drawGamblingMenu() {
    background(40, 50, 70); // Darker blue-gray for gambling menu

    fill(240, 245, 250);
    textSize(width * 0.035);
    textAlign(CENTER, TOP);
    text("Gambling Hall", width / 2, height * 0.15);
    textSize(width * 0.02);
    text("Choose your game of chance:", width / 2, height * 0.20);


    const buttonWidth = width * 0.45;
    const buttonHeight = height * 0.08;
    const gap = height * 0.02;

    let currentY = height * 0.25;

    const btnRoulette = { x: width / 2 - buttonWidth / 2, y: currentY, width: buttonWidth, height: buttonHeight, text: '🎡 Roulette', color: color(150, 50, 50) };
    currentY += buttonHeight + gap;
    const btnDice = { x: width / 2 - buttonWidth / 2, y: currentY, width: buttonWidth, height: buttonHeight, text: '🎲 Roll Dice', color: color(50, 150, 50) };
    currentY += buttonHeight + gap;
    const btnHighLow = { x: width / 2 - buttonWidth / 2, y: currentY, width: buttonWidth, height: buttonHeight, text: '🃏 High-Low', color: color(50, 50, 150) };

    drawButton(btnRoulette);
    drawButton(btnDice);
    drawButton(btnHighLow);
    drawButton(btnBackToMain);
}

function drawRouletteGame() {
    background(30, 40, 55); // Dark background for roulette
    fill(240, 245, 250);
    textSize(width * 0.035);
    textAlign(CENTER, TOP);
    text("Roulette", width / 2, height * 0.15);

    // Roulette Wheel visualization (simple)
    let wheelX = width / 2;
    let wheelY = height * 0.4;
    let wheelSize = width * 0.2;

    noFill();
    stroke(200);
    strokeWeight(5);
    ellipse(wheelX, wheelY, wheelSize, wheelSize); // Outer wheel

    // Spin animation for wheel value
    let displayValue = rouletteWheelValue;
    if (millis() - rouletteLastSpinTime < ROULETTE_SPIN_DURATION) {
        // Simple animation: show random numbers during spin
        displayValue = floor(random(0, 37));
    }

    // Display result
    if (rouletteWheelValue !== -1) {
        fill(gamblingOutcomeColor);
        textSize(wheelSize * 0.2);
        text(gamblingResultText, wheelX, wheelY + wheelSize * 0.6); // Below wheel
        // Display the actual spun number
        textSize(wheelSize * 0.3);
        fill(255);
        if (displayValue === 0) fill(0, 150, 0); // Green for 0
        else if (displayValue % 2 === 0) fill(255, 0, 0); // Red for even (simplified color logic)
        else fill(0); // Black for odd (simplified color logic)

        // Draw the number on the wheel
        ellipse(wheelX, wheelY, wheelSize * 0.5, wheelSize * 0.5); // Inner circle for number
        fill(255);
        text(displayValue, wheelX, wheelY);
    } else {
        fill(150);
        textSize(wheelSize * 0.2);
        text("Place your bet and spin!", wheelX, wheelY + wheelSize * 0.6);
    }


    // Bet Amount Input
    drawBetInput();

    // Bet Type Buttons
    const betButtonWidth = width * 0.1;
    const betButtonHeight = height * 0.06;
    const betGap = width * 0.01;
    const betBtnY = height * 0.65;

    const btnRed = { x: width * 0.3, y: betBtnY, width: betButtonWidth, height: betButtonHeight, text: 'Red', color: color(200, 50, 50) };
    const btnBlack = { x: width * 0.45, y: betBtnY, width: betButtonWidth, height: betButtonHeight, text: 'Black', color: color(50, 50, 50) };
    const btnGreen = { x: width * 0.6, y: betBtnY, width: betButtonWidth, height: betButtonHeight, text: 'Green (0)', color: color(50, 150, 50) };

    drawButton(btnRed);
    drawButton(btnBlack);
    drawButton(btnGreen);

    // Spin Button
    const btnSpin = { x: width / 2 - (width * 0.15) / 2, y: height * 0.75, width: width * 0.15, height: height * 0.08, text: 'Spin!', color: color(100, 100, 200) };
    drawButton(btnSpin);

    drawButton(btnBackToGamblingMenu);
}

function drawDiceGame() {
    background(30, 55, 40); // Dark background for dice
    fill(240, 245, 250);
    textSize(width * 0.035);
    textAlign(CENTER, TOP);
    text("Roll the Dice", width / 2, height * 0.15);

    // Dice visualization
    let diceSize = width * 0.08;
    let diceGap = width * 0.02;
    let diceX1 = width / 2 - diceSize - diceGap / 2;
    let diceX2 = width / 2 + diceGap / 2;
    let diceY = height * 0.4;

    drawDice(diceX1, diceY, diceSize, diceRollValue1);
    drawDice(diceX2, diceY, diceSize, diceRollValue2);

    // Display result
    fill(gamblingOutcomeColor);
    textSize(width * 0.025);
    textAlign(CENTER, TOP);
    text(gamblingResultText, width / 2, height * 0.55);

    // Bet Amount Input
    drawBetInput();

    // Bet Type Buttons
    const betButtonWidth = width * 0.15;
    const betButtonHeight = height * 0.06;
    const betGap = width * 0.01;
    const betBtnY = height * 0.65;

    const btnUnder7 = { x: width * 0.3, y: betBtnY, width: betButtonWidth, height: betButtonHeight, text: 'Under 7 (2x)', color: color(50, 150, 200) };
    const btnExact7 = { x: width * 0.475, y: betBtnY, width: betButtonWidth, height: betButtonHeight, text: 'Exact 7 (5x)', color: color(200, 150, 50) };
    const btnOver7 = { x: width * 0.65, y: betBtnY, width: betButtonWidth, height: betButtonHeight, text: 'Over 7 (2x)', color: color(50, 200, 150) };

    drawButton(btnUnder7);
    drawButton(btnExact7);
    drawButton(btnOver7);

    // Roll Button
    const btnRoll = { x: width / 2 - (width * 0.15) / 2, y: height * 0.75, width: width * 0.15, height: height * 0.08, text: 'Roll!', color: color(150, 50, 200) };
    drawButton(btnRoll);

    drawButton(btnBackToGamblingMenu);
}

function drawDice(x, y, size, value) {
    fill(240, 240, 240); // White dice
    stroke(50);
    strokeWeight(2);
    rect(x, y, size, size, size * 0.1); // Rounded square

    fill(50); // Black dots
    const dotSize = size * 0.1;
    const offset = size * 0.25;

    const drawDot = (dx, dy) => {
        ellipse(x + dx, y + dy, dotSize, dotSize);
    };

    if (value === 1) {
        drawDot(size / 2, size / 2);
    } else if (value === 2) {
        drawDot(offset, size - offset);
        drawDot(size - offset, offset);
    } else if (value === 3) {
        drawDot(offset, size - offset);
        drawDot(size / 2, size / 2);
        drawDot(size - offset, offset);
    } else if (value === 4) {
        drawDot(offset, offset);
        drawDot(size - offset, offset);
        drawDot(offset, size - offset);
        drawDot(size - offset, size - offset);
    } else if (value === 5) {
        drawDot(offset, offset);
        drawDot(size - offset, offset);
        drawDot(size / 2, size / 2);
        drawDot(offset, size - offset);
        drawDot(size - offset, size - offset);
    } else if (value === 6) {
        drawDot(offset, offset);
        drawDot(size - offset, offset);
        drawDot(offset, size / 2);
        drawDot(size - offset, size / 2);
        drawDot(offset, size - offset);
        drawDot(size - offset, size - offset);
    }
}

function drawHighLowGame() {
    background(55, 40, 30); // Dark background for High-Low
    fill(240, 245, 250);
    textSize(width * 0.035);
    textAlign(CENTER, TOP);
    text("High or Low?", width / 2, height * 0.15);

    // Card dimensions
    const cardWidth = width * 0.1;
    const cardHeight = cardWidth * 1.4; // Standard card aspect ratio
    const cardGap = width * 0.05;
    const cardY = height * 0.35;

    // First Card
    let card1X = width / 2 - cardWidth - cardGap / 2;
    drawCard(card1X, cardY, cardWidth, cardHeight, highLowCard1);

    // Second Card (face down or revealed)
    let card2X = width / 2 + cardGap / 2;
    if (highLowRevealed) {
        drawCard(card2X, cardY, cardWidth, cardHeight, highLowCard2);
    } else {
        drawCardBack(card2X, cardY, cardWidth, cardHeight);
    }

    // Display result
    fill(gamblingOutcomeColor);
    textSize(width * 0.025);
    textAlign(CENTER, TOP);
    text(gamblingResultText, width / 2, height * 0.55);

    // Bet Amount Input
    drawBetInput();

    // High / Low Buttons
    const btnHigh = { x: width * 0.35, y: height * 0.7, width: width * 0.1, height: height * 0.06, text: 'High', color: color(50, 180, 50) };
    const btnLow = { x: width * 0.55, y: height * 0.7, width: width * 0.1, height: height * 0.06, text: 'Low', color: color(220, 50, 50) };

    if (!highLowRevealed && highLowCard1) { // Only show these if a choice is needed
        drawButton(btnHigh);
        drawButton(btnLow);
    }


    // Deal New Card / Back Button
    const btnDeal = { x: width / 2 - (width * 0.15) / 2, y: height * 0.8, width: width * 0.15, height: height * 0.08, text: (highLowCard1 && !highLowRevealed) ? 'Choose!' : 'New Game', color: color(100, 100, 200) };
    drawButton(btnDeal); // Always show this button, text changes based on state

    drawButton(btnBackToGamblingMenu);
}

function drawCard(x, y, w, h, card) {
    fill(255);
    stroke(50);
    strokeWeight(2);
    rect(x, y, w, h, 10); // Card border

    if (card) {
        let rank = card.rank;
        let suit = card.suit;
        let suitColor = (suit === '♥' || suit === '♦') ? color(200, 0, 0) : color(0); // Red or Black

        fill(suitColor);
        textSize(w * 0.25);
        textAlign(LEFT, TOP);
        text(rank, x + 5, y + 5); // Top-left rank
        textAlign(RIGHT, BOTTOM);
        text(rank, x + w - 5, y + h - 5); // Bottom-right rank

        textSize(w * 0.4);
        textAlign(CENTER, CENTER);
        text(suit, x + w / 2, y + h / 2); // Center suit
    }
}

function drawCardBack(x, y, w, h) {
    fill(80, 100, 150); // Blueish back
    stroke(50);
    strokeWeight(2);
    rect(x, y, w, h, 10);

    // Simple pattern for card back
    noFill();
    stroke(50, 70, 120);
    strokeWeight(2);
    for (let i = 0; i < 10; i++) {
        line(x + i * (w / 10), y, x + i * (w / 10), y + h);
        line(x, y + i * (h / 10), x + w, y + i * (h / 10));
    }
}


function drawBetInput() {
    const inputX = width / 2 - (width * 0.2) / 2;
    const inputY = height * 0.6;
    const inputWidth = width * 0.2;
    const inputHeight = height * 0.06;

    fill(30, 40, 50); // Input field background
    stroke(100, 115, 130);
    strokeWeight(1);
    rect(inputX, inputY, inputWidth, inputHeight, 8);

    fill(240, 245, 250);
    textSize(width * 0.02);
    textAlign(CENTER, CENTER);
    text(gamblingBetAmount || 'Enter Bet', inputX + inputWidth / 2, inputY + inputHeight / 2);
}

function handleBet(amount, payoutMultiplier, isWin) {
    if (amount <= 0 || isNaN(amount)) {
        addGameMessage("Invalid bet amount.", 'error');
        return false;
    }
    if (gameMoney < amount) {
        addGameMessage("Not enough money for that bet!", 'error');
        return false;
    }

    gameMoney -= amount; // Deduct bet first

    if (isWin) {
        const winnings = amount * payoutMultiplier;
        gameMoney += winnings;
        addGameMessage(`You won $${winnings.toFixed(2)}! Total: $${gameMoney.toLocaleString()}`, 'success');
        gamblingOutcomeColor = color(50, 200, 50); // Green for win
        return true;
    } else {
        addGameMessage(`You lost $${amount.toFixed(2)}. Total: $${gameMoney.toLocaleString()}`, 'error');
        gamblingOutcomeColor = color(200, 50, 50); // Red for loss
        return false;
    }
}

function spinRoulette(betAmount, type) {
    if (millis() - rouletteLastSpinTime < ROULETTE_SPIN_DURATION) {
        addGameMessage("Wheel is still spinning!", 'warning');
        return;
    }

    rouletteBetType = type; // Store the bet type for drawing
    rouletteWheelValue = -1; // Reset value for animation
    gamblingResultText = "Spinning...";
    rouletteLastSpinTime = millis();

    setTimeout(() => {
        const result = floor(random(0, 37)); // 0-36
        rouletteWheelValue = result;

        let isWin = false;
        let payout = 0;

        // Simplified roulette rules for demonstration:
        // 0 is green (35x)
        // Even numbers (excluding 0) are red (2x)
        // Odd numbers are black (2x)
        if (type === 'green') {
            if (result === 0) { isWin = true; payout = 35; }
        } else if (type === 'red') {
            if (result !== 0 && result % 2 === 0) { isWin = true; payout = 2; }
        } else if (type === 'black') {
            if (result !== 0 && result % 2 !== 0) { isWin = true; payout = 2; }
        }
        
        // Handle the bet outcome
        handleBet(betAmount, payout, isWin);
        gamblingResultText = `Result: ${rouletteWheelValue}`;
        if(isWin) gamblingResultText += " - WIN!"; else gamblingResultText += " - LOSE.";
    }, ROULETTE_SPIN_DURATION);
}


function rollDice(betAmount, type) {
    if (millis() - diceLastRollTime < DICE_ROLL_DURATION) {
        addGameMessage("Dice are still rolling!", 'warning');
        return;
    }

    diceBetType = type; // Store bet type for drawing
    gamblingResultText = "Rolling...";
    diceLastRollTime = millis();

    setTimeout(() => {
        const roll1 = floor(random(1, 7)); // 1-6
        const roll2 = floor(random(1, 7)); // 1-6
        diceRollValue1 = roll1;
        diceRollValue2 = roll2;
        const totalRoll = roll1 + roll2;

        let isWin = false;
        let payout = 0;

        if (type === 'under7') {
            if (totalRoll < 7) { isWin = true; payout = 2; }
        } else if (type === 'exact7') {
            if (totalRoll === 7) { isWin = true; payout = 5; } // 5x payout for exact 7
        } else if (type === 'over7') {
            if (totalRoll > 7) { isWin = true; payout = 2; }
        }

        handleBet(betAmount, payout, isWin);
        gamblingResultText = `Rolled: ${roll1} + ${roll2} = ${totalRoll}`;
        if(isWin) gamblingResultText += " - WIN!"; else gamblingResultText += " - LOSE.";
    }, DICE_ROLL_DURATION);
}

function startHighLow() {
    highLowRevealed = false;
    highLowCard1 = drawRandomCard();
    highLowCard2 = null; // Hide second card
    highLowChoice = 'none';
    gamblingResultText = "Bet and choose High or Low!";
    highLowLastGameTime = millis();
}

function drawRandomCard() {
    const rank = random(CARD_RANKS);
    const suit = random(CARD_SUITS);
    return { rank: rank, suit: suit, value: CARD_VALUES[rank] };
}

function placeHighLowBet(betAmount, choice) {
    if (highLowRevealed) {
        addGameMessage("Game already played. Deal a new game.", 'warning');
        return;
    }
    if (!highLowCard1) {
        addGameMessage("Please deal a new game first.", 'warning');
        return;
    }
    if (gamblingBetAmount <= 0 || isNaN(gamblingBetAmount)) {
        addGameMessage("Please enter a valid bet amount.", 'error');
        return;
    }

    highLowChoice = choice; // Store player's choice
    gamblingResultText = "Revealing...";
    
    setTimeout(() => {
        highLowCard2 = drawRandomCard();
        highLowRevealed = true;

        let isWin = false;
        if (highLowCard2.value > highLowCard1.value && choice === 'high') {
            isWin = true;
        } else if (highLowCard2.value < highLowCard1.value && choice === 'low') {
            isWin = true;
        } else if (highLowCard2.value === highLowCard1.value) {
            // Push or lose, depending on house rules. For simplicity, let's say a tie is a loss for now.
            isWin = false;
        }

        handleBet(betAmount, 2, isWin); // 2x payout for High-Low
        gamblingResultText = `Your choice: ${choice.toUpperCase()}! Card 2: ${highLowCard2.rank}${highLowCard2.suit}.`;
        if (isWin) gamblingResultText += " YOU WIN!"; else gamblingResultText += " YOU LOSE!";
    }, HIGHLOW_REVEAL_DURATION);
}


// Function to draw game parameters (Money, Day, Location) on the canvas (positioned left)
function drawGameInfo() {
    const boxWidth = width * 0.22; // Responsive width
    const boxHeight = height * 0.15; // Responsive height
    const padding = width * 0.01; // Responsive padding
    const cornerRadius = 8;

    // Position in the top LEFT corner
    const boxX = padding; // Left side
    const boxY = padding; // Top side

    // Draw background box with a subtle darker shade and a border
    fill(30, 40, 50, 200); // Darker, slightly transparent background
    stroke(80, 100, 120, 200); // Subtle blue-gray border
    strokeWeight(1.5);
    rect(boxX, boxY, boxWidth, boxHeight, cornerRadius);

    // Inner glow for the box
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 8; // Subtle glow
    drawingContext.shadowColor = 'rgba(100, 150, 255, 0.2)'; // Blueish glow

    rect(boxX, boxY, boxWidth, boxHeight, cornerRadius); // Redraw for shadow

    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)'; // Reset shadow

    // Text and Icons
    const iconSize = height * 0.025; // Responsive icon size
    const textBaseSize = height * 0.022; // Base responsive text size, adjusted to fit
    const lineSpacing = textBaseSize * 1.5; // Adjusted line spacing

    fill(255); // White text
    textAlign(LEFT, CENTER); // Center text vertically within its line

    // Text shadow for readability on text
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 3;
    drawingContext.shadowColor = 'rgba(0,0,0,0.5)';


    let currentTextY = boxY + padding + textBaseSize * 0.8; // Start point for first line

    // Money
    textSize(textBaseSize);
    text('💰', boxX + padding, currentTextY); // Icon
    text(`Money: $${gameMoney.toLocaleString()}`, boxX + padding + iconSize + 5, currentTextY);

    currentTextY += lineSpacing;

    // Day
    textSize(textBaseSize);
    text('🗓️', boxX + padding, currentTextY); // Icon
    text(`Day: ${gameDay}`, boxX + padding + iconSize + 5, currentTextY);

    currentTextY += lineSpacing;

    // Location
    textSize(textBaseSize);
    text('📍', boxX + padding, currentTextY); // Icon
    text(`Location: ${gameLocation}`, boxX + padding + iconSize + 5, currentTextY);

    // Reset shadow
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)';
}

// Function to draw game messages on the canvas (positioned right, smaller, sleek, fading)
function drawFadingMessages() {
    const messageAreaRightEdge = width * 0.98; // Closer to right edge
    const messageAreaTop = height * 0.02; // Start from top, slightly below canvas top
    const messageLineHeight = height * MESSAGE_LINE_HEIGHT_FACTOR; // Responsive line height

    textSize(height * 0.02); // Responsive text size for messages
    textAlign(RIGHT, TOP); // Align text to the right

    // Filter out messages that have completed their full fade cycle
    gameMessages = gameMessages.filter(msg => {
        const elapsedTime = millis() - msg.timestamp;
        // Keep message if its total duration has not passed
        return elapsedTime < MESSAGE_TOTAL_DURATION;
    });

    // Draw active messages, stacking upwards from the bottom of the message area
    // Determine the Y position for the newest message, and then stack upwards.
    let currentY = messageAreaTop + (MESSAGE_MAX_DISPLAY_HEIGHT_FACTOR * height) - messageLineHeight; // Start at the "bottom" of the display area for newest message

    // Text shadow for readability on message text
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 2; // Subtle shadow
    drawingContext.shadowColor = 'rgba(0,0,0,0.7)';


    for (let i = gameMessages.length - 1; i >= 0; i--) { // Loop from newest to oldest
        const msg = gameMessages[i];
        const elapsedTime = millis() - msg.timestamp;
        let opacity;

        if (elapsedTime < MESSAGE_FADE_IN_DURATION) {
            // Fading in
            opacity = map(elapsedTime, 0, MESSAGE_FADE_IN_DURATION, 0, 255);
        } else if (elapsedTime < MESSAGE_FADE_IN_DURATION + MESSAGE_HOLD_DURATION) {
            // Fully visible
            opacity = 255;
        } else {
            // Fading out
            const fadeOutTime = elapsedTime - (MESSAGE_FADE_IN_DURATION + MESSAGE_HOLD_DURATION);
            opacity = map(fadeOutTime, 0, MESSAGE_FADE_OUT_DURATION, 255, 0);
        }

        let textColor;
        // Define colors for message types, applying the current opacity
        if (msg.type === 'success') textColor = color(72, 187, 120, opacity); // Green
        else if (msg.type === 'error') textColor = color(239, 68, 68, opacity); // Red
        else if (msg.type === 'warning') textColor = color(246, 173, 85, opacity); // Orange
        else textColor = color(226, 232, 240, opacity); // Light gray (info)

        fill(textColor);
        text(msg.text, messageAreaRightEdge, currentY); // Draw text aligned right
        currentY -= messageLineHeight; // Move up for the next older message

        if (currentY < messageAreaTop) { // Stop drawing if out of allocated message area
            break;
        }
    }
    // Reset shadow
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'rgba(0,0,0,0)';
}


// --- Utility Functions ---
function addGameMessage(message, type = 'info') {
    // Add new message with current time. Opacity will be calculated by drawFadingMessages.
    gameMessages.push({ text: message, type: type, timestamp: millis() });
}

// Function to change the game state (which screen is active)
function setGameState(newState) {
    currentGameState = newState;
    if (newState === 'mainMenu') {
        gameLocation = "Main Menu";
        addGameMessage("Returned to main menu.");
    } else if (newState === 'stockMarket') {
        gameLocation = regions[currentRegionIndex].name;
        addGameMessage(`Entering ${gameLocation}...`, 'info');
    } else if (newState === 'wallet') {
        addGameMessage("Viewing your portfolio.", 'info');
    } else if (newState === 'moveRegion') {
        addGameMessage("Choosing new market region.", 'info');
    } else if (newState === 'buySellStock') {
        addGameMessage(`Trading ${selectedStockSymbol}.`, 'info');
    } else if (newState === 'gamblingMenu') {
        gameLocation = "Gambling Hall";
        addGameMessage("Welcome to the Gambling Hall!", 'info');
    } else if (newState === 'gamblingRoulette') {
        gameLocation = "Roulette Table";
        addGameMessage("Playing Roulette. Place your bets!", 'info');
    } else if (newState === 'gamblingDice') {
        gameLocation = "Dice Table";
        addGameMessage("Playing Dice. Roll 'em!", 'info');
    } else if (newState === 'gamblingHighLow') {
        gameLocation = "High-Low Card Game";
        addGameMessage("Playing High-Low. Choose wisely!", 'info');
    }
    else {
        // Generic messages for other states if needed
        gameLocation = newState; // Placeholder
        addGameMessage(`Entering ${newState}...`, 'info');
    }
}

// Function to reset the game to its initial state
function resetGame() {
    gameMoney = 1000;
    gameDay = 1;
    gameLocation = "Main Menu";
    gameMessages = []; // Clear all messages immediately on reset
    initializeStocks(); // Re-initialize stock prices and clear portfolio
    playerPortfolio = {};

    // Reset gambling variables
    gamblingBetAmount = "";
    gamblingResultText = "";
    rouletteWheelValue = -1;
    rouletteBetType = 'none';
    diceRollValue1 = 1;
    diceRollValue2 = 1;
    diceBetType = 'none';
    highLowCard1 = null;
    highLowCard2 = null;
    highLowRevealed = false;
    highLowChoice = 'none';


    addGameMessage("Game reset. Welcome back!");
    setGameState('mainMenu'); // Go back to main menu
}

// Example functions for game progress
function advanceDay() {
    gameDay++;
    advanceStockPrices(); // Update stock prices when day advances
    addGameMessage(`Advanced to Day ${gameDay}.`);
}

function updateMoney(amount) {
    gameMoney += amount;
    addGameMessage(`Money changed by $${amount}. Current: $${gameMoney.toLocaleString()}`, amount >= 0 ? 'success' : 'error');
}