const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { displayWelcome, createSectionHeader, displaySuccess, displayInfo, displayWarning } = require('./scaffolders/common');
const { createClassicStructure } = require('./scaffolders/classic');
const { createBedrockStructure } = require('./scaffolders/bedrock');

// Catppuccin Mocha Theme Colors
const catppuccin = {
  background: '#1e1e2e',
  text: '#cdd6f4',
  rosewater: '#f5e0dc',
  flamingo: '#f2cdcd',
  pink: '#f5c2e7',
  mauve: '#cba6f7',
  red: '#f38ba8',
  maroon: '#eba0ac',
  peach: '#fab387',
  yellow: '#f9e2af',
  green: '#a6e3a1',
  teal: '#94e2d5',
  sky: '#89dceb',
  sapphire: '#74c7ec',
  blue: '#89b4fa',
  lavender: '#b4befe'
};

/**
 * Initialize a new WordPress project
 * @param {Object} config - Project configuration
 * @param {string} config.name - Name of the project and root folder
 * @param {string} config.structure - Structure type ('classic' or 'bedrock')
 */
async function initializeProject(config) {
  const projectName = config.name;
  const structureType = config.structure || 'classic';
  
  // Display welcome message
  displayWelcome();
  
  // Create project directory
  createSectionHeader('Project Initialization');
  displayInfo(`Creating project directory: ${projectName}`);
  
  try {
    const projectPath = path.join(process.cwd(), projectName);
    
    // Check if directory already exists
    if (fs.existsSync(projectPath)) {
      displayWarning(`Directory '${projectName}' already exists. Please choose a different name.`);
      process.exit(1);
    }
    
    // Create the directory
    fs.mkdirSync(projectPath);
    console.log(chalk.hex(catppuccin.green)(`  ✓ Created directory: ${projectName}`));
    
    // Create the folder structure based on the selected type
    await createFolderStructure(projectPath, structureType);
    
    displaySuccess(`Project initialized successfully!`);
    console.log(chalk.hex(catppuccin.sapphire).bold('\n📝 Next steps:'));
    console.log(chalk.hex(catppuccin.text)(`  1. cd ${projectName}`));
    console.log(chalk.hex(catppuccin.text)(`  2. Follow the instructions in the README.md file`));
    console.log('\n');
  } catch (error) {
    displayWarning(`Error creating project: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Create the folder structure based on type
 * @param {string} projectPath - Path to the project directory
 * @param {string} structureType - Structure type ('classic' or 'bedrock')
 */
async function createFolderStructure(projectPath, structureType) {
  createSectionHeader(`Setting Up ${structureType.charAt(0).toUpperCase() + structureType.slice(1)} Structure`);
  
  if (structureType === 'classic') {
    createClassicStructure(projectPath);
  } else if (structureType === 'bedrock') {
    await createBedrockStructure(projectPath);
  } else {
    displayWarning(`Unknown structure type '${structureType}', using classic structure.`);
    createClassicStructure(projectPath);
  }
}

module.exports = {
  initializeProject
}; 