/**
 * Project class for handling WordPress project initialization
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { catppuccin } = require('../config/theme');
const { 
  displayWelcome, 
  createSectionHeader, 
  displayInfo, 
  displayWarning, 
} = require('../utils/ui');
const structureRegistry = require('../structures');

class Project {
  /**
   * Create a new WordPress project
   * @param {Object} config - Project configuration
   * @param {string} config.name - Name of the project and root folder
   * @param {string} config.structure - Structure type ('classic' or 'bedrock')
   */
  constructor(config) {
    this.name = config.name;
    this.structureType = config.structure || structureRegistry.getDefaultName();
  }

  /**
   * Initialize the WordPress project
   */
  async initialize() {
    // Display welcome message
    displayWelcome();
    
    // Create project directory
    createSectionHeader('Project Initialization');
    displayInfo(`Creating project directory: ${this.name}`);
    
    try {
      const projectPath = path.join(process.cwd(), this.name);
      
      // Check if directory already exists
      if (fs.existsSync(projectPath)) {
        displayWarning(`Directory '${this.name}' already exists. Please choose a different name.`);
        process.exit(1);
      }
      
      // Create the directory
      fs.mkdirSync(projectPath);
      console.log(chalk.hex(catppuccin.green)(`  ✓ Created directory: ${this.name}`));
      
      // Create the folder structure based on the selected type
      await this.createStructure(projectPath);
      
    } catch (error) {
      displayWarning(`Error creating project: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Create the folder structure for the project
   * @param {string} projectPath - Path to the project directory
   */
  async createStructure(projectPath) {
    // Generate the structure based on the selected type
    const structureGenerator = structureRegistry.create(this.structureType, projectPath);
    
    // Create the structure
    createSectionHeader(`Setting Up ${this.structureType.charAt(0).toUpperCase() + this.structureType.slice(1)} Structure`);
    await structureGenerator.generate();
  }
}

module.exports = Project; 