const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { displayWelcome } = require('./scaffolders/common');
const { createClassicStructure } = require('./scaffolders/classic');
const { createBedrockStructure } = require('./scaffolders/bedrock');

/**
 * Initialize a new WordPress project
 * @param {Object} config - Project configuration
 * @param {string} config.name - Name of the project and root folder
 * @param {string} config.structure - Structure type ('classic' or 'bedrock')
 */
function initializeProject(config) {
  const projectName = config.name;
  const structureType = config.structure || 'classic';
  
  // Display welcome message
  displayWelcome();
  
  // Create project directory
  console.log(chalk.cyan(`Creating project directory: ${chalk.bold(projectName)}`));
  
  try {
    const projectPath = path.join(process.cwd(), projectName);
    
    // Check if directory already exists
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Error: Directory '${projectName}' already exists.`));
      process.exit(1);
    }
    
    // Create the directory
    fs.mkdirSync(projectPath);
    console.log(chalk.green(`✅ Created directory: ${projectName}`));
    
    // Create the folder structure based on the selected type
    createFolderStructure(projectPath, structureType);
    
    console.log(chalk.green(`\n✅ Project initialized successfully!`));
    console.log(chalk.cyan(`\nNext steps:`));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  # Start building your WordPress project`));
  } catch (error) {
    console.log(chalk.red(`Error creating project: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Create the folder structure based on type
 * @param {string} projectPath - Path to the project directory
 * @param {string} structureType - Structure type ('classic' or 'bedrock')
 */
function createFolderStructure(projectPath, structureType) {
  console.log(chalk.cyan(`Setting up ${chalk.bold(structureType)} folder structure...`));
  
  if (structureType === 'classic') {
    createClassicStructure(projectPath);
  } else if (structureType === 'bedrock') {
    createBedrockStructure(projectPath);
  } else {
    console.log(chalk.yellow(`Warning: Unknown structure type '${structureType}', using classic structure.`));
    createClassicStructure(projectPath);
  }
}

module.exports = {
  initializeProject
}; 