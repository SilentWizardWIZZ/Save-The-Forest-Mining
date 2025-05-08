// Game state
const gameState = {
    trees: 0,
    treesPerClick: 1,
    autoPlantRate: 0,
    forestHealth: 0,
    pollution: 100,
    upgrades: {
        betterSeeds: false,
        gardeningTools: false,
        treeSaplings: false,
        autoPlanter: false,
        treeFarm: false,
        reforestationProject: false
    },
    milestones: {
        firstTree: false,
        tenTrees: false,
        fiftyTrees: false,
        hundredTrees: false,
        cleanAir: false,
        healthyForest: false,
        savedForest: false
    }
};

// Game elements
const elements = {
    treesCount: document.getElementById('trees-count'),
    treesPerClick: document.getElementById('trees-per-click'),
    autoPlantRate: document.getElementById('auto-plant-rate'),
    forestHealthValue: document.getElementById('forest-health-value'),
    forestHealthBar: document.getElementById('forest-health-bar'),
    pollutionValue: document.getElementById('pollution-value'),
    pollutionBar: document.getElementById('pollution-bar'),
    plantButton: document.getElementById('plant-button'),
    clickFeedback: document.getElementById('click-feedback'),
    milestonePopup: document.getElementById('milestone-popup'),
    milestoneTitle: document.getElementById('milestone-title'),
    milestoneMessage: document.getElementById('milestone-message'),
    milestoneClose: document.getElementById('milestone-close'),
    upgradeButtons: document.querySelectorAll('.buy-button')
};

// Initialize the game
function initGame() {
    updateUI();
    setupEventListeners();
    startAutoPlanting();
}

// Update the UI with current game state
function updateUI() {
    elements.treesCount.textContent = Math.floor(gameState.trees);
    elements.treesPerClick.textContent = gameState.treesPerClick;
    elements.autoPlantRate.textContent = gameState.autoPlantRate + ' / sec';
    
    elements.forestHealthValue.textContent = Math.floor(gameState.forestHealth);
    elements.forestHealthBar.style.width = gameState.forestHealth + '%';
    
    elements.pollutionValue.textContent = Math.floor(gameState.pollution);
    elements.pollutionBar.style.width = gameState.pollution + '%';
    
    // Update upgrade buttons availability
    elements.upgradeButtons.forEach(button => {
        const cost = parseInt(button.getAttribute('data-cost'));
        button.disabled = gameState.trees < cost;
    });
}

// Set up event listeners
function setupEventListeners() {
    // Plant button
    elements.plantButton.addEventListener('click', () => {
        plantTrees(gameState.treesPerClick);
        showClickFeedback(gameState.treesPerClick);
    });
    
    // Upgrade buttons
    elements.upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const upgrade = button.getAttribute('data-upgrade');
            const cost = parseInt(button.getAttribute('data-cost'));
            buyUpgrade(upgrade, cost);
        });
    });
    
    // Milestone close button
    elements.milestoneClose.addEventListener('click', () => {
        elements.milestonePopup.classList.remove('show');
    });
}

// Plant trees function
function plantTrees(amount) {
    gameState.trees += amount;
    
    // Update forest health and pollution based on trees planted
    updateEnvironment();
    
    // Check for milestones
    checkMilestones();
    
    // Update UI
    updateUI();
}

// Update forest health and pollution levels
function updateEnvironment() {
    // Adjust forest health (will max out at 100)
    gameState.forestHealth = Math.min(100, gameState.trees / 10);
    
    // Adjust pollution (will min out at 0)
    gameState.pollution = Math.max(0, 100 - (gameState.trees / 15));
}

// Buy upgrades
function buyUpgrade(upgrade, cost) {
    if (gameState.trees < cost) return;
    
    gameState.trees -= cost;
    
    switch (upgrade) {
        case 'better-seeds':
            gameState.upgrades.betterSeeds = true;
            gameState.treesPerClick = 2;
            break;
        case 'gardening-tools':
            gameState.upgrades.gardeningTools = true;
            gameState.treesPerClick = 5;
            break;
        case 'tree-saplings':
            gameState.upgrades.treeSaplings = true;
            gameState.treesPerClick = 10;
            break;
        case 'auto-planter':
            gameState.upgrades.autoPlanter = true;
            gameState.autoPlantRate += 1;
            break;
        case 'tree-farm':
            gameState.upgrades.treeFarm = true;
            gameState.autoPlantRate += 5;
            break;
        case 'reforestation-project':
            gameState.upgrades.reforestationProject = true;
            gameState.autoPlantRate += 20;
            break;
    }
    
    // Disable the button after purchase
    const buttonElement = document.querySelector(`[data-upgrade="${upgrade}"]`);
    buttonElement.disabled = true;
    buttonElement.textContent = 'Purchased';
    
    updateUI();
}

// Auto plant trees based on auto plant rate
function startAutoPlanting() {
    setInterval(() => {
        if (gameState.autoPlantRate > 0) {
            plantTrees(gameState.autoPlantRate / 10);
        }
    }, 100);
}

// Check for milestones
function checkMilestones() {
    // Tree count milestones
    if (!gameState.milestones.firstTree && gameState.trees >= 1) {
        showMilestone('First Tree Planted!', 'You\'ve planted your first tree! Keep going to restore the forest.');
        gameState.milestones.firstTree = true;
    }
    
    if (!gameState.milestones.tenTrees && gameState.trees >= 10) {
        showMilestone('Small Grove Growing!', 'You\'ve planted 10 trees! Your small grove is starting to take shape.');
        gameState.milestones.tenTrees = true;
    }
    
    if (!gameState.milestones.fiftyTrees && gameState.trees >= 50) {
        showMilestone('Mini Forest Established!', 'With 50 trees planted, your mini forest is growing nicely!');
        gameState.milestones.fiftyTrees = true;
    }
    
    if (!gameState.milestones.hundredTrees && gameState.trees >= 100) {
        showMilestone('Forest Guardian!', 'You\'ve planted 100 trees! You\'re becoming a true guardian of the forest.');
        gameState.milestones.hundredTrees = true;
    }
    
    // Environmental milestones
    if (!gameState.milestones.cleanAir && gameState.pollution <= 50) {
        showMilestone('Cleaner Air!', 'The pollution has been reduced by half! The air is starting to feel fresher.');
        gameState.milestones.cleanAir = true;
    }
    
    if (!gameState.milestones.healthyForest && gameState.forestHealth >= 50) {
        showMilestone('Growing Forest!', 'Your forest is now at 50% health! Wildlife is returning to the area.');
        gameState.milestones.healthyForest = true;
    }
    
    if (!gameState.milestones.savedForest && gameState.forestHealth >= 100) {
        showMilestone('Forest Restored!', 'Congratulations! The forest is now fully restored to health. The ecosystem is thriving thanks to your efforts!');
        gameState.milestones.savedForest = true;
    }
}

// Show milestone popup
function showMilestone(title, message) {
    elements.milestoneTitle.textContent = title;
    elements.milestoneMessage.textContent = message;
    elements.milestonePopup.classList.add('show');
}

// Show click feedback animation
function showClickFeedback(amount) {
    const feedback = elements.clickFeedback;
    
    // Set position slightly above the button
    const buttonRect = elements.plantButton.getBoundingClientRect();
    feedback.style.top = (buttonRect.top - 40) + 'px';
    feedback.style.left = (buttonRect.left + buttonRect.width / 2) + 'px';
    
    // Update text and show
    feedback.textContent = '+' + amount;
    feedback.style.opacity = '1';
    feedback.style.transform = 'translateY(-20px)';
    
    // Hide after animation
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-40px)';
    }, 700);
}

// Create tree visual effect
function createTreeEffect() {
    const treeElement = document.createElement('div');
    treeElement.className = 'tree-effect';
    treeElement.innerHTML = '<i class="fas fa-tree"></i>';
    
    // Random position near the button
    const gameArea = document.querySelector('.main-area');
    const rect = gameArea.getBoundingClientRect();
    
    treeElement.style.position = 'absolute';
    treeElement.style.top = Math.random() * rect.height + 'px';
    treeElement.style.left = Math.random() * rect.width + 'px';
    treeElement.style.color = '#4caf50';
    treeElement.style.fontSize = '20px';
    treeElement.style.zIndex = '-1';
    
    gameArea.appendChild(treeElement);
    
    // Animate and remove
    treeElement.classList.add('tree-animation');
    setTimeout(() => {
        gameArea.removeChild(treeElement);
    }, 2000);
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);